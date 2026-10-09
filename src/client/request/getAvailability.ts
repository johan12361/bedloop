import axios from 'axios'

import type { Client } from '../client.js'
import type { Availability } from '../../types/availability.js'

export async function getAvailability(
	client: Client,
	listingId: string | number,
	startDate: string,
	endDate: string
): Promise<Availability> {
	const url = `${client.options.url}/api/v1/availability`
	const auth = await client.getAuthorization()

	const headers = {
		Accept: 'application/json',
		Authorization: `Bearer ${auth.token}`
	}

	const params = {
		listing_id: listingId,
		from: startDate,
		to: endDate
	}

	const response = await axios.get(url, { headers, params })

	if (!response.data) {
		throw new Error('No data received from getAvailability')
	}

	return response.data.data as Availability
}
