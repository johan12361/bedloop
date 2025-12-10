import axios from 'axios'

import type { Conversation } from '../../types/messages.js'

export async function getMessages(baseUrl: string, token: string, bookingId: string): Promise<Conversation[]> {
  const url = `${baseUrl}/api/v1/threads/${bookingId}`

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
  return response.data.data as Conversation[]
}
