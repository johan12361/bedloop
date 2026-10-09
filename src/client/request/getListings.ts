import axios from 'axios'

import type { Client } from '../client.js'
import type { Listing } from '../../types/listing.js'

export async function getListings(client: Client): Promise<Listing[]> {
	const url = `${client.options.url}/api/v1/listings`
	const auth = await client.getAuthorization()

	const headers = {
		Accept: 'application/json',
		Authorization: `Bearer ${auth.token}`
	}

	const response = await axios.get(url, { headers })

	if (!response.data) {
		throw new Error('No data received from getListings')
	}

	if (!Array.isArray(response.data.data)) {
		throw new TypeError('Invalid data format received from getListings')
	}
	return response.data.data as Listing[]
}
