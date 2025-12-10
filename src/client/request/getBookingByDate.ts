import axios from 'axios'

import type { Booking } from '../../types/booking.js'

export async function getBookingByDate(
  baseUrl: string,
  token: string,
  startDate: string,
  endDate: string
): Promise<Booking[]> {
  const url = `${baseUrl}/api/v1/bookings?start_date=${startDate}&end_date=${endDate}`

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
  return response.data.data as Booking[]
}
