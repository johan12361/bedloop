import axios from 'axios'

import type { Client } from '../client.js'
import type { Destination } from '../../types/destination.js'

export async function getDestinations(client: Client): Promise<Destination[]> {
	const url = `${client.options.url}/api/v1/destinations`
	const auth = await client.getAuthorization()

	const headers = {
		Accept: 'application/json',
		Authorization: `Bearer ${auth.token}`
	}

	const response = await axios.get(url, { headers })

	if (!response.data) {
		throw new Error('No data received from getDestinations')
	}

	if (!Array.isArray(response.data.data)) {
		throw new TypeError('Invalid data format received from getDestinations')
	}
	return response.data.data as Destination[]
}
