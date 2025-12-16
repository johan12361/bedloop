# Bedloop API Client

A TypeScript client for the Bedloop API with real-time messaging and booking management capabilities.

## Features

- Authentication with automatic token management and retry logic
- Real-time message polling from conversations
- Booking management with date range queries
- Auto-retry mechanism for failed requests (up to 3 attempts)
- Memory-efficient cache with automatic cleanup
- Automatic token refresh every 12 hours
- Type-safe event system
- Full TypeScript support

## Installation

```bash
npm install bedloop
# or
pnpm add bedloop
# or
yarn add bedloop
```

## Quick Start

```typescript
import { Client, EventType } from 'bedloop'

const client = new Client(
  {
    user: 'your-username',
    password: 'your-password',
    url: 'https://your-bedloop-instance.com'
  },
  {
    interval: 5000,
    beforeDays: 7,
    afterDays: 30
  }
)

client.connect((events) => {
  events.forEach((event) => {
    if (event.event === EventType.NEW_MESSAGE) {
      console.log('New message:', event.newMessage)
    }
  })
})
```

## API Reference

### Client

#### Constructor

```typescript
new Client(options: ClientOptions, pollingOptions?: PollingOptions)
```

**ClientOptions:**

- `user` (string): Username for authentication
- `password` (string): Password for authentication
- `url` (string): Base URL of your Bedloop instance
- `debug` (boolean, optional): Enable debug logging (default: false)

**PollingOptions:**

- `interval` (number): Polling interval in milliseconds (default: 5000)
- `beforeDays` (number): Days to look back for bookings (default: 7)
- `afterDays` (number): Days to look ahead for bookings (default: 30)

#### Methods

**connect(callback: (events: BedloopEvent[]) => void): Promise<void>**

Connects to the Bedloop API and starts polling for events. Automatically refreshes the authentication token every 12 hours.

**disconnect(): void**

Disconnects from the API and cleans up resources including token refresh interval.

### Event Types

#### BedloopEvent

```typescript
interface BedloopEvent {
  event: EventType
  timestamp: Date
  newMessage?: {
    bookingId: number
    conversationId: number
    messageId: number
    message: ConversationMessage
  }
}
```

#### EventType Enum

```typescript
enum EventType {
  NEW_MESSAGE = 'new_message'
}
```

## Examples

### Basic Usage

```typescript
const client = new Client({
  user: 'username',
  password: 'password',
  url: 'https://api.bedloop.com'
})

await client.connect((events) => {
  events.forEach((event) => {
    console.log('Event received:', event)
  })
})
```

### With Debug Logging

```typescript
const client = new Client({
  user: 'username',
  password: 'password',
  url: 'https://api.bedloop.com',
  debug: true
})
```

### Custom Polling Configuration

```typescript
const client = new Client(
  {
    user: 'username',
    password: 'password',
    url: 'https://api.bedloop.com'
  },
  {
    interval: 10000,
    beforeDays: 14,
    afterDays: 60
  }
)
```

### Graceful Shutdown

```typescript
const client = new Client({...})
await client.connect((events) => {...})

// Clean up resources when done
client.disconnect()
```

## Error Handling

The client automatically handles:

- Network failures with retry logic (3 attempts, 1 second intervals)
- Token expiration with automatic refresh every 12 hours
- Rate limiting with configurable polling intervals

```typescript
client.connect((events) => {
  try {
    events.forEach((event) => {
      // Process event
    })
  } catch (error) {
    console.error('Error processing events:', error)
  }
})
```

## License

MIT

## Author

johan12361

---

**Note:** This is an alpha release. The API may change in future versions.
# bedloop
