# bedloop

A TypeScript client for the Bedloop API that makes it easy to interact with property listings, destinations, availability, photos, and bookings through a typed and user-friendly SDK.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Authentication](#authentication)
  - [Get All Destinations](#get-all-destinations)
  - [Get Listings (Paginated)](#get-listings-paginated)
  - [Get Listing by ID](#get-listing-by-id)
  - [Get Photos by Listing](#get-photos-by-listing)
  - [Get Availability & Rates](#get-availability--rates)
  - [Get Bookings by Date](#get-bookings-by-date)
- [Advanced Configuration](#advanced-configuration)
  - [Client Configuration](#client-configuration)
  - [Automatic Token Refresh & Retry Strategy](#automatic-token-refresh--retry-strategy)
  - [Working with Pagination](#working-with-pagination)
- [TypeScript Types](#typescript-types)
- [Features](#features)
- [License](#license)
- [Report Issues](#report-issues)
- [Resources](#resources)

## Installation

```bash
npm install bedloop
# or
bun add bedloop
# or
pnpm add bedloop
# or
yarn add bedloop
```

## Quick Start

```typescript
import { Client } from 'bedloop'

// Initialize the client
const client = new Client({
  user: 'your-api-user',
  password: 'your-api-password',
  url: 'https://api.bedloop.com',
  debug: false
})

// Fetch property listings (paginated)
const listings = await client.getListings({ per_page: 25 })
console.log(`Found ${listings.data.length} listings on page 1`)

// Retrieve a single property by ID
const listing = await client.getListingById(listings.data[0].id)
console.log('Listing Name:', listing.name)
```

## Usage

### Authentication

Authenticates against `/api/v1/login` or returns the cached in-memory token if it is still valid:

```typescript
const auth = await client.getAuthorization()
console.log('Token:', auth.token)
console.log('Expires at:', auth.expiresAt.toISOString())
```

**Note:** You do not need to call this manually before calling other methods. Every request automatically acquires and refreshes tokens as needed.

### Get All Destinations

Retrieves all configured destinations with geo-coordinates and tourist tax configuration:

```typescript
const destinations = await client.getDestinations()
console.log(`Total destinations: ${destinations.length}`)

if (destinations.length > 0) {
  console.log('First destination:', destinations[0].name)
}
```

### Get Listings (Paginated)

Retrieves listings with cursor pagination and optional filters. The method always returns `{ data, links, meta }`:

```typescript
// Fetch the first page of listings (defaults to per_page: 100)
const page1 = await client.getListings({ per_page: 20 })
console.log('Listings on page 1:', page1.data.length)
console.log('Next cursor:', page1.meta.next_cursor)

// Filter by city and category
const filtered = await client.getListings({
  city: 'Barcelona',
  category_id: 2,
  per_page: 15
})
console.log('Filtered listings:', filtered.data)
```

#### Pagination with Cursors

```typescript
// Fetch first page
const page1 = await client.getListings({ per_page: 50 })

// Fetch second page using the cursor
if (page1.meta.next_cursor) {
  const page2 = await client.getListings({
    per_page: 50,
    cursor: page1.meta.next_cursor
  })
  console.log('Page 2 results:', page2.data.length)
}
```

**Available filters for `getListings`:**

- `per_page` (number, max: 500, default: 100) - Results per page
- `cursor` (string) - Cursor token for pagination
- `city` (string) - Filter by city name (e.g. `'Barcelona'`)
- `category_id` (number) - Filter by category ID
- `country_id` (number) - Filter by country ID
- `owner_id` (number) - Filter by owner ID

### Get Listing by ID

Fetches the complete details for a single property by its identifier (`/api/v1/listings/{listing_id}`):

```typescript
const listing = await client.getListingById(493)

console.log('Property:', listing.name)
console.log('City:', listing.city)
console.log('Bedrooms:', listing.bedrooms)
console.log('Capacity:', listing.person_capacity)
console.log('Description:', listing.description)
```

### Get Photos by Listing

Retrieves the photo gallery and metadata for a specific listing:

```typescript
const photos = await client.getPhotosByListing(493)
console.log(`Photos found: ${photos.length}`)

if (photos.length > 0) {
  console.log('Cover Photo URL:', photos[0].name)
}
```

### Get Availability & Rates

Fetches calendar rates and availability flags for a listing within a date range (`YYYY-MM-DD`):

```typescript
const availability = await client.getAvailability(
  493,
  '2026-06-01',
  '2026-06-30'
)

console.log('Listing ID:', availability.listing_id)
console.log('Rates found:', availability.rates.length)

// Inspect rate calendar
if (availability.rates.length > 0) {
  const firstRate = availability.rates[0]
  console.log('Rate ID:', firstRate.rate_id)
  console.log('Dates:', firstRate.dates)
}
```

### Get Bookings by Date

Retrieves all reservations active or created within a specific date range (`YYYY-MM-DD`):

```typescript
const bookings = await client.getBookingByDate('2026-06-01', '2026-06-30')
console.log(`Total reservations in range: ${bookings.length}`)

if (bookings.length > 0) {
  const firstBooking = bookings[0]
  console.log('Booking #:', firstBooking.booking_number)
  console.log('Guest:', firstBooking.customers.user.name, firstBooking.customers.user.lastname)
  console.log('Arrival:', firstBooking.start_date)
  console.log('Departure:', firstBooking.end_date)
  console.log('Total Price:', firstBooking.total)
}
```

## Advanced Configuration

### Client Configuration

You can customize the client's options when instantiating:

```typescript
const client = new Client({
  user: 'your-api-user',
  password: 'your-api-password',
  url: 'https://api.bedloop.com',
  debug: true
})
```

#### Configuration Options

| Option | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user` | `string` | **Yes** | Bedloop API username or user identifier. |
| `password` | `string` | **Yes** | Bedloop API password. |
| `url` | `string` | **Yes** | Base URL of your Bedloop instance (e.g. `https://api.bedloop.com`). |
| `debug` | `boolean` | No | Enables debug logging to the console. Default: `false`. |

### Automatic Token Refresh & Retry Strategy

The client includes built-in authentication safeguards:

- **Token Caching:** Successful logins store the Bearer token and expiration timestamp in memory.
- **Proactive Refresh:** Automatically refreshes the token when within 60 seconds of expiration.
- **Deduplication:** Merges simultaneous concurrent login requests into a single promise to avoid race conditions and redundant network calls.
- **Retry Mechanism:** Retries failed login attempts up to 3 times with exponential backoff (1s initial delay).

### Working with Pagination

Bedloop uses cursor-based pagination for listings. When `per_page` is specified (default `100`), the API response structure conforms to `PaginatedListings`:

```typescript
const response = await client.getListings({ per_page: 50 })

// 1. Data array
console.log(response.data) // Listing[]

// 2. Navigation links
console.log(response.links.next) // Full URL to next page or null
console.log(response.links.prev) // Full URL to previous page or null

// 3. Metadata
console.log(response.meta.per_page)    // 50
console.log(response.meta.next_cursor) // String cursor token or null
console.log(response.meta.prev_cursor) // String cursor token or null
```

#### Iterating Over All Pages

To iterate through all records across pages:

```typescript
let nextCursor: string | null | undefined = undefined
const allListings: Listing[] = []

do {
  const page = await client.getListings({
    per_page: 500,
    cursor: nextCursor ?? undefined
  })

  allListings.push(...page.data)
  nextCursor = page.meta.next_cursor
} while (nextCursor)

console.log(`Total listings collected: ${allListings.length}`)
```

## TypeScript Types

The package includes complete TypeScript type definitions:

```typescript
// Client
import { Client } from 'bedloop'

// Client & Auth types
import type { ClientOptions, Authorization } from 'bedloop'

// Listings & Pagination types
import type {
  Listing,
  GetListingsParams,
  PaginatedListings,
  PaginationLinks,
  PaginationMeta
} from 'bedloop'

// Photo & Destination types
import type { Photo, Destination } from 'bedloop'

// Availability & Booking types
import type {
  Availability,
  Rate,
  RateDate,
  Booking,
  BookingService
} from 'bedloop'
```

## Features

- ✅ Full TypeScript support with strict models
- ✅ Automatic token caching and refresh with in-flight deduplication
- ✅ Cursor-based pagination with metadata and filters for listings
- ✅ Comprehensive endpoints: listings, photos, destinations, availability, and bookings
- ✅ Dual ESM and CommonJS bundle support
- ✅ Promise-based API (`async`/`await`)
- ✅ Zero external HTTP dependencies other than lightweight `axios`

## License

MIT © [johan12361](https://github.com/johan12361)

## Report Issues

If you find any issues, please report them at: [GitHub Issues](https://github.com/johan12361/bedloop/issues)

## Resources

- [GitHub Repository](https://github.com/johan12361/bedloop)
