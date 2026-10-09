# Bedloop API Client

A TypeScript client for the Bedloop API, providing direct access to property listings, destinations, availability, photos, and bookings.

## Features

- **Automatic Authentication & Token Caching**: Handles login via Basic Auth, retries on failure (up to 3 attempts), caches tokens in memory, and refreshes them automatically before expiration.
- **Listings & Photos**: Fetch full property listings and photo galleries.
- **Destinations**: Query destinations with geographic coordinates and local settings.
- **Availability & Rates**: Check real-time date availability and rate calendars for any listing.
- **Bookings**: Retrieve reservations within specific date ranges.
- **Full TypeScript Support**: Strongly typed request parameters, client options, and API response models.
- **Dual ESM & CommonJS**: Ready to use in Node.js, Bun, and modern build tooling.

## Installation

```bash
bun add bedloop
# or
npm install bedloop
# or
pnpm add bedloop
# or
yarn add bedloop
```

## Quick Start

```typescript
import { Client } from 'bedloop'

const client = new Client({
  user: 'your-username',
  password: 'your-password',
  url: 'https://api.bedloop.com',
  debug: false
})

// Fetch all property listings
const listings = await client.getListings()
console.log(`Found ${listings.length} listings`)

// Check availability for a specific listing
const availability = await client.getAvailability(123, '2026-06-01', '2026-06-30')
console.log(availability)
```

## API Reference

### `Client`

#### Constructor

```typescript
const client = new Client(options: ClientOptions)
```

**ClientOptions:**

| Option | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user` | `string` | Yes | Username or API user ID for authentication. |
| `password` | `string` | Yes | Password for authentication. |
| `url` | `string` | Yes | Base URL of the Bedloop instance (e.g. `https://api.bedloop.com`). |
| `debug` | `boolean` | No | Enables debug logging to the console (default: `false`). |

---

### Methods

#### `getAuthorization(): Promise<Authorization>`
Authenticates with `/api/v1/login` or returns the current cached token if still valid.
- Deduplicates concurrent in-flight authentication calls.
- Automatically refreshes the token when within 60 seconds of expiration.
- Retries up to 3 times with a 1-second delay upon failure.

```typescript
const auth = await client.getAuthorization()
console.log('Token expires at:', auth.expiresAt)
```

#### `getListings(): Promise<Listing[]>`
Fetches all property listings.

```typescript
const listings = await client.getListings()
```

#### `getPhotosByListing(listingId: string | number): Promise<Photo[]>`
Fetches all photos for a given listing.

```typescript
const photos = await client.getPhotosByListing(123)
```

#### `getDestinations(): Promise<Destination[]>`
Retrieves all configured destinations.

```typescript
const destinations = await client.getDestinations()
```

#### `getAvailability(listingId: string | number, startDate: string, endDate: string): Promise<Availability>`
Fetches availability and rates for a listing within a date range (`YYYY-MM-DD`).

```typescript
const availability = await client.getAvailability(123, '2026-07-01', '2026-07-15')
```

#### `getBookingByDate(startDate: string, endDate: string): Promise<Booking[]>`
Retrieves reservations created or active within a date range (`YYYY-MM-DD`).

```typescript
const bookings = await client.getBookingByDate('2026-06-01', '2026-06-30')
```

---

## TypeScript Interfaces

All core models are exported from the package:

```typescript
import type {
  ClientOptions,
  Authorization,
  Destination,
  Listing,
  Photo,
  Availability,
  Rate,
  RateDate,
  Booking,
  BookingService
} from 'bedloop'
```

### Key Models

- **`Listing`**: Property configuration, address, capacity, check-in/out policies, amenities, and descriptions.
- **`Photo`**: Listing photos metadata, zone, title, and position.
- **`Destination`**: Geographic information, local tourist taxes, and coordinates.
- **`Availability`**: Rates and date-by-date availability flags.
- **`Booking`**: Reservation details including customer ID, arrival/departure dates, payment totals, notes, and booked services.

---

## Examples

### Complete Example

```typescript
import { Client } from 'bedloop'

async function main() {
  const client = new Client({
    user: process.env.BEDLOOP_USER!,
    password: process.env.BEDLOOP_PASSWORD!,
    url: process.env.BEDLOOP_URL!,
    debug: true
  })

  // 1. Get all listings
  const listings = await client.getListings()
  console.log('Listings:', listings.map(l => ({ id: l.id, name: l.name })))

  if (listings.length > 0) {
    const firstListingId = listings[0].id

    // 2. Get photos for the first listing
    const photos = await client.getPhotosByListing(firstListingId)
    console.log(`Photos for listing ${firstListingId}:`, photos.length)

    // 3. Check availability for the next month
    const availability = await client.getAvailability(firstListingId, '2026-08-01', '2026-08-31')
    console.log('Availability rates count:', availability.rates.length)
  }

  // 4. Query bookings
  const bookings = await client.getBookingByDate('2026-08-01', '2026-08-31')
  console.log(`Bookings in August: ${bookings.length}`)
}

main().catch(console.error)
```

---

## License

MIT © [johan12361](https://github.com/johan12361)
