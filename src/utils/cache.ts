// Cache con límite de tamaño y limpieza automática
export class LimitedCache<K, V> {
  private cache: Map<K, { value: V; timestamp: number }>
  private maxSize: number
  private maxAge: number

  constructor(maxSize: number = 1000, maxAgeMinutes: number = 60) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.maxAge = maxAgeMinutes * 60 * 1000
  }

  // Agrega un elemento al cache
  set(key: K, value: V): void {
    // Si el cache está lleno, eliminar el más antiguo
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, { value, timestamp: Date.now() })
  }

  // Verifica si un elemento existe en el cache
  has(key: K): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Verificar si el elemento expiró
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Limpia elementos expirados
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key)
      }
    }
  }

  // Obtiene el tamaño actual del cache
  get size(): number {
    return this.cache.size
  }
}
