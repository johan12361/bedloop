import type { ConversationMessage } from './messages.js'

// Tipos de eventos que pueden ser emitidos
export enum EventType {
  NEW_MESSAGE = 'new_message'
  // Otros tipos de eventos pueden ser añadidos aquí
}

// Evento unificado con propiedades opcionales según el tipo
export interface BedloopEvent {
  event: EventType
  timestamp: Date

  newMessage?: {
    bookingId?: number
    conversationId?: number
    messageId?: number
    message?: ConversationMessage
  }
  // Otras propiedades para diferentes tipos de eventos pueden ser añadidas aquí
}
