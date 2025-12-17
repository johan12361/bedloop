import { getAuthorization } from './auth/getAuthorization.js'
import { pollingMessages } from './pollingMessages/pollingMessages.js'
import type { BedloopEvent } from '../types/events.js'
import type { ClientOptions, Authorization, PollingOptions } from '../types/client.js'

// default polling options
const defaultPollingOptions: PollingOptions = {
  interval: 5000, // 5 segundos
  beforeDays: 7,
  afterDays: 30,
  recentMinutes: 15
}

export class Client {
  readonly options: ClientOptions
  readonly pollingOptions: PollingOptions

  private authorization?: Authorization
  private tokenRefreshInterval?: NodeJS.Timeout

  constructor(options: ClientOptions, pollingOptions: Partial<PollingOptions> = {}) {
    this.options = options
    this.pollingOptions = {
      ...defaultPollingOptions,
      ...pollingOptions
    }
    if (this.options.debug) {
      console.log('Client initialized')
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      this.authorization = await getAuthorization(this.options)
      if (this.options.debug) {
        console.log('Token refreshed:', this.authorization)
      }
    } catch (error) {
      if (this.options.debug) {
        console.error('Error refreshing token:', error)
      }
    }
  }

  async connect(callback: (events: BedloopEvent[]) => void): Promise<void> {
    this.authorization = await getAuthorization(this.options)
    if (this.options.debug) {
      console.log('Connected:', this.authorization)
    }

    // Refrescar token cada 12 horas
    this.tokenRefreshInterval = setInterval(
      () => {
        void this.refreshToken()
      },
      12 * 60 * 60 * 1000
    )

    pollingMessages(this.options, () => this.authorization!, this.pollingOptions, callback)
  }

  disconnect(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval)
      this.tokenRefreshInterval = undefined
    }
    if (this.options.debug) {
      console.log('Client disconnected')
    }
  }
}
