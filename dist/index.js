// src/client/auth/getAuthorization.ts
import axios from "axios";
var MAX_RETRIES = 3;
var RETRY_DELAY = 1e3;
async function getAuthorization(client) {
  const url = `${client.options.url}/api/v1/login`;
  const headers = {
    Accept: "application/json",
    Authorization: createUserPass(client.options.user, client.options.password)
  };
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(url, { headers });
      if (response.data?.token && response.data.expires_at) {
        client.log(`Connection successful on attempt ${attempt}`);
        return {
          token: response.data.token,
          expiresAt: new Date(response.data.expires_at)
        };
      } else {
        throw new Error("Invalid authorization data");
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRIES) {
        client.log(`Attempt ${attempt} failed, retrying in ${RETRY_DELAY / 1e3}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        client.log(`All ${MAX_RETRIES} attempts failed`);
      }
    }
  }
  throw lastError || new Error("Authorization failed after retries");
}
function createUserPass(user, password) {
  const token = Buffer.from(`${user}:${password}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

// src/client/request/getDestinations.ts
import axios2 from "axios";
async function getDestinations(client) {
  const url = `${client.options.url}/api/v1/destinations`;
  const auth = await client.getAuthorization();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${auth.token}`
  };
  const response = await axios2.get(url, { headers });
  if (!response.data) {
    throw new Error("No data received from getDestinations");
  }
  if (!Array.isArray(response.data.data)) {
    throw new TypeError("Invalid data format received from getDestinations");
  }
  return response.data.data;
}

// src/client/request/getListings.ts
import axios3 from "axios";
async function getListings(client) {
  const url = `${client.options.url}/api/v1/listings`;
  const auth = await client.getAuthorization();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${auth.token}`
  };
  const response = await axios3.get(url, { headers });
  if (!response.data) {
    throw new Error("No data received from getListings");
  }
  if (!Array.isArray(response.data.data)) {
    throw new TypeError("Invalid data format received from getListings");
  }
  return response.data.data;
}

// src/client/request/getAvailability.ts
import axios4 from "axios";
async function getAvailability(client, listingId, startDate, endDate) {
  const url = `${client.options.url}/api/v1/availability`;
  const auth = await client.getAuthorization();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${auth.token}`
  };
  const params = {
    listing_id: listingId,
    from: startDate,
    to: endDate
  };
  const response = await axios4.get(url, { headers, params });
  if (!response.data) {
    throw new Error("No data received from getAvailability");
  }
  return response.data.data;
}

// src/client/request/getPhotosByListing.ts
import axios5 from "axios";
async function getPhotosByListing(client, listingId) {
  const url = `${client.options.url}/api/v1/photos?listing_id=${listingId}`;
  const auth = await client.getAuthorization();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${auth.token}`
  };
  const response = await axios5.get(url, { headers });
  if (!response.data) {
    throw new Error("No data received from getPhotosByListing");
  }
  if (!Array.isArray(response.data.data)) {
    throw new TypeError("Invalid data format received from getPhotosByListing");
  }
  return response.data.data;
}

// src/client/request/getBookingByDate.ts
import axios6 from "axios";
async function getBookingByDate(client, startDate, endDate) {
  const url = `${client.options.url}/api/v1/bookings?start_date=${startDate}&end_date=${endDate}`;
  const auth = await client.getAuthorization();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${auth.token}`
  };
  const response = await axios6.get(url, { headers });
  if (!response.data) {
    throw new Error("No data received from getBookingByDate");
  }
  if (!Array.isArray(response.data.data)) {
    throw new TypeError("Invalid data format received from getBookingByDate");
  }
  return response.data.data;
}

// src/client/client.ts
var Client = class {
  constructor(options) {
    this.options = options;
    this.log = options.debug === true ? console.log.bind(console, "[Bedloop]") : () => {
    };
  }
  async getAuthorization() {
    const now = Date.now();
    const bufferMs = 60 * 1e3;
    if (this.authorization && this.authorization.expiresAt.getTime() - bufferMs > now) return this.authorization;
    if (this.authPromise) return await this.authPromise;
    this.authPromise = (async () => {
      try {
        const auth = await getAuthorization(this);
        this.authorization = auth;
        this.log(`Token refreshed at ${auth.expiresAt.toISOString()}`);
        return auth;
      } finally {
        this.authPromise = void 0;
      }
    })();
    return await this.authPromise;
  }
  async getDestinations() {
    return await getDestinations(this);
  }
  async getListings() {
    return await getListings(this);
  }
  async getPhotosByListing(listingId) {
    return await getPhotosByListing(this, listingId);
  }
  async getAvailability(listingId, startDate, endDate) {
    return await getAvailability(this, listingId, startDate, endDate);
  }
  async getBookingByDate(startDate, endDate) {
    return await getBookingByDate(this, startDate, endDate);
  }
};
export {
  Client
};
