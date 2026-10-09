import axios from 'axios'

import type { Client } from '../client.js'
import type { Photo } from '../../types/photo.js'

export async function getPhotosByListing(client: Client, listingId: string | number): Promise<Photo[]> {
	const url = `${client.options.url}/api/v1/photos?listing_id=${listingId}`
	const auth = await client.getAuthorization()

	const headers = {
		Accept: 'application/json',
		Authorization: `Bearer ${auth.token}`
	}

	const response = await axios.get(url, { headers })

	if (!response.data) {
		throw new Error('No data received from getPhotosByListing')
	}

	if (!Array.isArray(response.data.data)) {
		throw new TypeError('Invalid data format received from getPhotosByListing')
	}
	return response.data.data as Photo[]
}
