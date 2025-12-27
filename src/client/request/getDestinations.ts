import axios from 'axios'

import type { Destination } from '../../types/destination.js'

export async function getDestinations(baseUrl: string, token: string): Promise<Destination[]> {
  const url = `${baseUrl}/api/v1/destinations`

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  }

  const response = await axios.get(url, { headers })

  if (!response.data) {
    throw new Error('No data received from getBookingByDate')
  }

  if (!Array.isArray(response.data.data)) {
    throw new Error('Invalid data format received from getBookingByDate')
  }
  return response.data.data as Destination[]
}
