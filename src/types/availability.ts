export interface Availability {
  listing_id: number
  rates: Rate[]
}

interface Rate {
  rate_id: number
  dates: RateDate[]
}

interface RateDate {
  date: string
  availability: boolean
}
