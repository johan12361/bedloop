import axios from 'axios'

import type { Client } from '../client.js'
import type { Booking } from '../../types/booking.js'

export async function getBookingByDate(client: Client, startDate: string, endDate: string): Promise<Booking[]> {
	const url = `${client.options.url}/api/v1/bookings?start_date=${startDate}&end_date=${endDate}`
	const auth = await client.getAuthorization()

	const headers = {
		Accept: 'application/json',
		Authorization: `Bearer ${auth.token}`
	}

	const response = await axios.get(url, { headers })

	if (!response.data) {
		throw new Error('No data received from getBookingByDate')
	}

	if (!Array.isArray(response.data.data)) {
		throw new TypeError('Invalid data format received from getBookingByDate')
	}
	return response.data.data as Booking[]
}
