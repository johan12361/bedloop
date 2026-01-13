import axios from 'axios'

import type { Availability } from '../../types/availability.js'

export async function getAvailability(
  baseUrl: string,
  token: string,
  listingId: string,
  startDate: string,
  endDate: string
): Promise<Availability> {
  const url = `${baseUrl}/api/v1/availability`

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  }

  const params = {
    listing_id: listingId,
    from: startDate,
    to: endDate
  }

  const response = await axios.get(url, { headers, params })

  if (!response.data) {
    throw new Error('No data received from getBookingByDate')
  }

  return response.data.data as Availability
}
