import { getBookingByDate } from '../request/getBookingByDate.js'
import { getMessages } from '../request/getMessages.js'
import { LimitedCache } from '../../utils/cache.js'
import { addDays } from '../../utils/date.js'
import { isTokenExpired } from '../../utils/tokenValidation.js'
import { filterNewMessages } from './filterMessages.js'
import { DEFAULT_CACHE_SIZE, DEFAULT_CACHE_AGE_MINUTES, type Booking } from '../../types/messages.js'
import { EventType, type BedloopEvent } from '../../types/events.js'

import type { Authorization, PollingOptions, ClientOptions } from '../../types/client.js'

const messagesCache = new LimitedCache<number, unknown>(DEFAULT_CACHE_SIZE, DEFAULT_CACHE_AGE_MINUTES)

export async function pollingMessages(
  clientConfig: ClientOptions,
  getAuthorization: () => Authorization,
  pollingOptions: PollingOptions,
  callback: (events: BedloopEvent[]) => void
): Promise<void> {
  const baseUrl = clientConfig.url
  const debug = clientConfig.debug ?? false

  // Limpiar cache periódicamente (cada 10 minutos)
  const cleanupInterval = setInterval(
    () => {
      messagesCache.cleanup()
    },
    10 * 60 * 1000
  )

  const pollingInterval = setInterval((): void => {
    void (async (): Promise<void> => {
      try {
        const authorization = getAuthorization()

        // Verificar si el token expiró
        if (isTokenExpired(authorization)) {
          if (debug) {
            console.warn('Authorization token has expired')
          }
          clearInterval(pollingInterval)
          clearInterval(cleanupInterval)
          return
        }

        const token = authorization.token
        const now = new Date()
        const startDate = addDays(now, -pollingOptions.beforeDays)
        const endDate = addDays(now, pollingOptions.afterDays)

        if (debug) {
          console.log(`Polling bookings from ${startDate} to ${endDate}`)
        }

        const bookings: Booking[] = await getBookingByDate(baseUrl, token, startDate, endDate)

        // Procesar todos los bookings en paralelo
        const messagesPromises = bookings.map(async (booking) => {
          try {
            const conversations = await getMessages(baseUrl, token, String(booking.booking_number))

            if (conversations.length === 0) return []

            return filterNewMessages(conversations, booking.booking_number, messagesCache, pollingOptions.recentMinutes)
          } catch (error) {
            if (debug) {
              console.error(`Error getting messages for booking ${booking.booking_number}:`, error)
            }
            return []
          }
        })

        const results = await Promise.all(messagesPromises)
        const allNewMessages = results.flat()

        if (allNewMessages.length > 0) {
          if (debug) {
            console.log(`Found ${allNewMessages.length} new message(s)`)
          }
          const events: BedloopEvent[] = allNewMessages.map((msg) => ({
            event: EventType.NEW_MESSAGE,
            timestamp: new Date(),
            newMessage: {
              bookingId: msg.bookingId,
              conversationId: msg.conversationId,
              messageId: msg.message.id,
              message: msg.message
            }
          }))
          callback(events)
        }
      } catch (error) {
        if (debug) {
          console.error('Error polling messages:', error)
        }
      }
    })()
  }, pollingOptions.interval)
}
