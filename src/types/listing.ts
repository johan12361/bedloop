export interface Listing {
	id: number
	active: number
	name?: string
	mu?: string
	destination: number
	street?: string
	floor?: string
	door?: string
	city?: string
	state?: {
		id?: number
		region_id?: number
		name?: string
		nombre?: string
	}
	country?: number
	zipcode?: string
	license?: string
	lat?: string
	lng?: string
	person_capacity?: number
	bathrooms?: number
	bath?: number
	bedrooms?: number
	m2?: number
	longstay?: number
	checkinfrom?: string
	checkinto?: string
	checkout?: string
	latecheckinfrom?: string
	latecheckinto?: string
	price_latecheckin?: string
	entry_limit_time?: string
	deposit?: number
	intercom_number?: string
	key_number?: string
	wifi_network?: string
	wifi_password?: string
	description?: Record<string, unknown>
	short_description?: string[] | Record<string, unknown> | string
	property_type?: number
	url?: string
	num_sofa_beds?: number
	fees?: Record<string, unknown>[]
	services?: number[]
	tourist_tax?: string
	owner_id?: number
	owner_name?: string
}

export interface PaginationLinks {
	first: string | null
	last: string | null
	prev: string | null
	next: string | null
}

export interface PaginationMeta {
	path: string
	per_page: number
	next_cursor: string | null
	prev_cursor: string | null
}

export interface PaginatedListings {
	data: Listing[]
	links: PaginationLinks
	meta: PaginationMeta
}

export interface GetListingsParams {
	per_page?: number
	cursor?: string
	category_id?: number
	city?: string
	country_id?: number
	owner_id?: number
}
