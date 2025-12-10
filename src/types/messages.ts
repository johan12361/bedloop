import type { Booking } from './booking.js'

// Constantes de polling
export const DEFAULT_RECENT_MINUTES = 5
export const DEFAULT_CACHE_SIZE = 1000
export const DEFAULT_CACHE_AGE_MINUTES = 60

// Re-exportar tipos existentes
export type { Booking }

// Tipos de mensajes y conversaciones
export interface ConversationMessage {
  id: number
  thread_id: number | null
  in_out: number
  message: string
  external_id: string | null
  type: string | null
  created_at: string // ISO timestamp
}

export interface Conversation {
  id: number
  listing_id: number
  booking_id: number
  customer_id: number
  origin: string
  external_id: string | null
  type: string
  created_at: string // ISO timestamp
  messages: ConversationMessage[]
}

// Tipo para mensajes procesados
export interface ProcessedMessage {
  bookingId: number
  conversationId: number
  message: ConversationMessage
}
