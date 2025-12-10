export const MESSAGE_DIRECTION = {
  OUTGOING: 0,
  INCOMING: 1
} as const

export type MessageDirection = (typeof MESSAGE_DIRECTION)[keyof typeof MESSAGE_DIRECTION]
