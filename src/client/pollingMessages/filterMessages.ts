import type { LimitedCache } from '../../utils/cache.js'
import { getMinutesAgo } from '../../utils/date.js'
import { MESSAGE_DIRECTION } from '../../enums/messageDirection.js'
import { DEFAULT_RECENT_MINUTES, type Conversation, type ProcessedMessage } from '../../types/messages.js'

// Filtra mensajes nuevos de conversaciones
export function filterNewMessages(
  conversations: Conversation[],
  bookingId: number,
  cache: LimitedCache<number, unknown>,
  recentMinutes: number = DEFAULT_RECENT_MINUTES
): ProcessedMessage[] {
  const newMessages: ProcessedMessage[] = []
  const cutoffTime = getMinutesAgo(recentMinutes)

  for (const conversation of conversations) {
    // Validar que haya mensajes
    if (!conversation.messages || conversation.messages.length === 0) {
      continue
    }

    for (const message of conversation.messages) {
      // Solo procesar mensajes entrantes
      if (message.in_out !== MESSAGE_DIRECTION.INCOMING) {
        continue
      }

      // Verificar si ya fue procesado
      if (cache.has(message.id)) {
        continue
      }

      // Verificar si es reciente
      const receivedAt = new Date(message.created_at)
      if (receivedAt < cutoffTime) {
        continue
      }

      // Marcar como procesado
      cache.set(message.id, message)

      // Agregar a la lista de mensajes nuevos
      newMessages.push({
        bookingId,
        conversationId: conversation.id,
        message
      })
    }
  }

  return newMessages
}
