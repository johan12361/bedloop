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
    disconnect(): void;
}

export { type BedloopEvent, Client, type ClientOptions, EventType, type PollingOptions };
