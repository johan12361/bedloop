import type { Authorization } from '../types/client.js'

// Verifica si el token de autorización ha expirado
export function isTokenExpired(authorization: Authorization): boolean {
  return new Date() >= authorization.expiresAt
}

// Calcula el tiempo restante hasta que expire el token en milisegundos
export function getTokenTimeRemaining(authorization: Authorization): number {
  return authorization.expiresAt.getTime() - Date.now()
}

// Verifica si el token expirará pronto (en los próximos minutos especificados)
export function isTokenExpiringSoon(authorization: Authorization, minutesThreshold: number = 5): boolean {
  const timeRemaining = getTokenTimeRemaining(authorization)
  return timeRemaining <= minutesThreshold * 60 * 1000
}
