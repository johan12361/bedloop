interface BookingService {
  id: number
  qty: number
  price: number
}

export interface Booking {
  booking_number: number
  start_date: string
  end_date: string
  listing_id: number
  customer_id: number
  state: number
  adults: number
  children: number
  paid: number
  arrival_time: string
  departure_time: string
  source_id: number
  deposit: number
  total: number
  prepaid: number
  tourist_tax: number
  opening_code: string | null
  checkin_completed: boolean
  key_numbers: number
  notes: string
  services: BookingService[]
  extras: unknown[]
}
