import { getAuthorization } from './auth/getAuthorization.js'
import { getDestinations } from './request/getDestinations.js'
import { getListings } from './request/getListings.js'
import { getListingById } from './request/getListingById.js'
import { getAvailability } from './request/getAvailability.js'
import { getPhotosByListing } from './request/getPhotosByListing.js'
import { getBookingByDate } from './request/getBookingByDate.js'

import type { Destination } from '../types/destination.js'
import type { GetListingsParams, Listing, PaginatedListings } from '../types/listing.js'
import type { Photo } from '../types/photo.js'
import type { Availability } from '../types/availability.js'
import type { Booking } from '../types/booking.js'

import type { ClientOptions, Authorization } from '../types/client.js'

export class Client {
	readonly options: ClientOptions
	readonly log: (...args: unknown[]) => void
	private authorization?: Authorization
	private authPromise?: Promise<Authorization>

	constructor(options: ClientOptions) {
		this.options = options
		this.log = options.debug === true ? console.log.bind(console, '[Bedloop]') : (): void => {}
	}

	async getAuthorization(): Promise<Authorization> {
		const now = Date.now()
		const bufferMs = 60 * 1000

		if (this.authorization && this.authorization.expiresAt.getTime() - bufferMs > now) return this.authorization

		if (this.authPromise) return await this.authPromise

		this.authPromise = (async (): Promise<Authorization> => {
			try {
				const auth = await getAuthorization(this)
				this.authorization = auth
				this.log(`Token refreshed at ${auth.expiresAt.toISOString()}`)
				return auth
			} finally {
				this.authPromise = undefined
			}
		})()

		return await this.authPromise
	}

	async getDestinations(): Promise<Destination[]> {
		return await getDestinations(this)
	}

	async getListings(params?: GetListingsParams): Promise<PaginatedListings> {
		return await getListings(this, params)
	}

	async getListingById(listingId: string | number): Promise<Listing> {
		return await getListingById(this, listingId)
	}

	async getPhotosByListing(listingId: string | number): Promise<Photo[]> {
		return await getPhotosByListing(this, listingId)
	}

	async getAvailability(listingId: string | number, startDate: string, endDate: string): Promise<Availability> {
		return await getAvailability(this, listingId, startDate, endDate)
	}

	async getBookingByDate(startDate: string, endDate: string): Promise<Booking[]> {
		return await getBookingByDate(this, startDate, endDate)
	}
}
