import axios from 'axios'

import type { Photo } from '../../types/photo.js'

export async function getPhotosByListing(baseUrl: string, token: string, id: string): Promise<Photo[]> {
  const url = `${baseUrl}/api/v1/photos?listing_id=${id}`

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  }

  const response = await axios.get(url, { headers })

  if (!response.data) {
    throw new Error('No data received from getPhotosByListing')
  }

  if (!Array.isArray(response.data.data)) {
    throw new Error('Invalid data format received from getPhotosByListing')
  }
  return response.data.data as Photo[]
}
