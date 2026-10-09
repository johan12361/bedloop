interface Destination {
    id: number;
    id2?: string;
    name?: string;
    tourist_tax?: string;
    latitude?: number;
    longitude?: number;
    max_days?: number;
}

interface Listing {
    id: number;
    active: number;
    name?: string;
    mu?: string;
    destination: number;
    street?: string;
    floor?: string;
    door?: string;
    city?: string;
    state?: {
        id?: number;
        region_id?: number;
        name?: string;
    };
    country?: number;
    zipcode?: string;
    license?: string;
    lat?: string;
    lng?: string;
    person_capacity?: number;
    bathrooms?: number;
    bath?: number;
    bedrooms?: number;
    m2?: number;
    longstay?: number;
    checkinfrom?: string;
    checkinto?: string;
    checkout?: string;
    latecheckinfrom?: string;
    latecheckinto?: string;
    price_latecheckin?: string;
    entry_limit_time?: string;
    deposit?: number;
    intercom_number?: string;
    key_number?: string;
    wifi_network?: string;
    wifi_password?: string;
    description?: Record<string, unknown>;
    short_description: string[];
    property_type?: number;
    url?: string;
    num_sofa_beds?: number;
    fees?: Record<string, unknown>[];
    services?: number[];
    tourist_tax?: string;
}

interface Photo {
    id: number;
    listing_id: number;
    name: string;
    zone: string;
    type: number;
    position: number;
    alt_text: string;
    title: string;
}

interface Availability {
    listing_id: number;
    rates: Rate[];
}
interface Rate {
    rate_id: number;
    dates: RateDate[];
}
interface RateDate {
    date: string;
    availability: boolean;
}

interface BookingService {
    id: number;
    qty: number;
    price: number;
}
interface Booking {
    booking_number: number;
    start_date: string;
    end_date: string;
    listing_id: number;
    customer_id: number;
    state: number;
    adults: number;
    children: number;
    paid: number;
    arrival_time: string;
    departure_time: string;
    source_id: number;
    deposit: number;
    total: number;
    prepaid: number;
    tourist_tax: number;
    opening_code: string | null;
    checkin_completed: boolean;
    key_numbers: number;
    notes: string;
    services: BookingService[];
    extras: unknown[];
}

interface ClientOptions {
    user: string;
    password: string;
    url: string;
    debug?: boolean;
}
interface Authorization {
    token: string;
    expiresAt: Date;
}

declare class Client {
    readonly options: ClientOptions;
    readonly log: (...args: unknown[]) => void;
    private authorization?;
    private authPromise?;
    constructor(options: ClientOptions);
    getAuthorization(): Promise<Authorization>;
    getDestinations(): Promise<Destination[]>;
    getListings(): Promise<Listing[]>;
    getPhotosByListing(listingId: string | number): Promise<Photo[]>;
    getAvailability(listingId: string | number, startDate: string, endDate: string): Promise<Availability>;
    getBookingByDate(startDate: string, endDate: string): Promise<Booking[]>;
}

export { type Authorization, type Availability, type Booking, type BookingService, Client, type ClientOptions, type Destination, type Listing, type Photo, type Rate, type RateDate };
