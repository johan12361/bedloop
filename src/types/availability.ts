export interface Availability {
	listing_id: number
	rates: Rate[]
}

export interface Rate {
	rate_id: number
	dates: RateDate[]
}

export interface RateDate {
	date: string
	availability: boolean
}
