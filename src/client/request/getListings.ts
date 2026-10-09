import axios from 'axios'

import type { Client } from '../client.js'
import type { GetListingsParams, PaginatedListings } from '../../types/listing.js'

export async function getListings(client: Client, params?: GetListingsParams): Promise<PaginatedListings> {
	const auth = await client.getAuthorization()
	const url = `${client.options.url}/api/v1/listings`

	const headers = {
		Accept: 'application/json',
		Authorization: `Bearer ${auth.token}`
	}

	const queryParams = {
		per_page: params?.per_page ?? 100,
		...params
	}

	const response = await axios.get(url, { headers, params: queryParams })

	if (!response.data) {
		throw new Error('No data received from getListings')
	}

	if (!Array.isArray(response.data.data)) {
		throw new TypeError('Invalid data format received from getListings')
	}

	return {
		data: response.data.data,
		links: response.data.links,
		meta: response.data.meta
	}
}
