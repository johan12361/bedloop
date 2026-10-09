import axios from 'axios'

import type { Client } from '../client.js'
import type { Listing } from '../../types/listing.js'

export async function getListingById(client: Client, listingId: string | number): Promise<Listing> {
	const url = `${client.options.url}/api/v1/listings/${listingId}`
	const auth = await client.getAuthorization()

	const headers = {
		Accept: 'application/json',
		Authorization: `Bearer ${auth.token}`
	}

	const response = await axios.get(url, { headers })

	if (!response.data) {
		throw new Error('No data received from getListingById')
	}

	const listing = response.data.Listings ?? response.data.data

	if (!listing || typeof listing !== 'object') {
		throw new TypeError('Invalid data format received from getListingById')
	}

	return listing as Listing
}
