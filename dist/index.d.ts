interface ConversationMessage {
    id: number;
    thread_id: number | null;
    in_out: number;
    message: string;
    external_id: string | null;
    type: string | null;
    created_at: string;
}

declare enum EventType {
    NEW_MESSAGE = "new_message"
}
interface BedloopEvent {
    event: EventType;
    timestamp: Date;
    newMessage?: {
        bookingId?: number;
        conversationId?: number;
        messageId?: number;
        message?: ConversationMessage;
    };
}

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
interface PollingOptions {
    interval: number;
    beforeDays: number;
    afterDays: number;
    recentMinutes?: number;
}

declare class Client {
    readonly options: ClientOptions;
    readonly pollingOptions: PollingOptions;
    private authorization?;
    private tokenRefreshInterval?;
    constructor(options: ClientOptions, pollingOptions?: Partial<PollingOptions>);
    private refreshToken;
    getAuthorization(): Promise<Authorization>;
    connect(callback: (events: BedloopEvent[]) => void): Promise<void>;
    getDestinations(): Promise<Destination[]>;
    getListings(): Promise<Listing[]>;
    getPhotosByListing(listingId: string): Promise<Photo[]>;
    disconnect(): void;
}

export { type BedloopEvent, Client, type ClientOptions, EventType, type PollingOptions };
