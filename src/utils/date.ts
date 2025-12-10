// Agrega o resta días a una fecha y retorna en formato ISO (YYYY-MM-DD)
export function addDays(date: Date, days: number): string {
  const result = new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
  return result.toISOString().split('T')[0]
}

// Obtiene una fecha en el pasado
export function getMinutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000)
}
