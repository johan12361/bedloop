import axios from 'axios'

import type { Listing } from '../../types/listing.js'

export async function getListings(baseUrl: string, token: string): Promise<Listing[]> {
  const url = `${baseUrl}/api/v1/listings`

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
  return response.data.data as Listing[]
}
