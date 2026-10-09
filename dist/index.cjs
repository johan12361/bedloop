"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Client: () => Client
});
module.exports = __toCommonJS(index_exports);

// src/client/auth/getAuthorization.ts
var import_axios = __toESM(require("axios"), 1);
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
      const response = await import_axios.default.get(url, { headers });
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
var import_axios2 = __toESM(require("axios"), 1);
async function getDestinations(client) {
  const url = `${client.options.url}/api/v1/destinations`;
  const auth = await client.getAuthorization();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${auth.token}`
  };
  const response = await import_axios2.default.get(url, { headers });
  if (!response.data) {
    throw new Error("No data received from getDestinations");
  }
  if (!Array.isArray(response.data.data)) {
    throw new TypeError("Invalid data format received from getDestinations");
  }
  return response.data.data;
}

// src/client/request/getListings.ts
var import_axios3 = __toESM(require("axios"), 1);
async function getListings(client) {
  const url = `${client.options.url}/api/v1/listings`;
  const auth = await client.getAuthorization();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${auth.token}`
  };
  const response = await import_axios3.default.get(url, { headers });
  if (!response.data) {
    throw new Error("No data received from getListings");
  }
  if (!Array.isArray(response.data.data)) {
    throw new TypeError("Invalid data format received from getListings");
  }
  return response.data.data;
}

// src/client/request/getAvailability.ts
var import_axios4 = __toESM(require("axios"), 1);
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
  const response = await import_axios4.default.get(url, { headers, params });
  if (!response.data) {
    throw new Error("No data received from getAvailability");
  }
  return response.data.data;
}

// src/client/request/getPhotosByListing.ts
var import_axios5 = __toESM(require("axios"), 1);
async function getPhotosByListing(client, listingId) {
  const url = `${client.options.url}/api/v1/photos?listing_id=${listingId}`;
  const auth = await client.getAuthorization();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${auth.token}`
  };
  const response = await import_axios5.default.get(url, { headers });
  if (!response.data) {
    throw new Error("No data received from getPhotosByListing");
  }
  if (!Array.isArray(response.data.data)) {
    throw new TypeError("Invalid data format received from getPhotosByListing");
  }
  return response.data.data;
}

// src/client/request/getBookingByDate.ts
var import_axios6 = __toESM(require("axios"), 1);
async function getBookingByDate(client, startDate, endDate) {
  const url = `${client.options.url}/api/v1/bookings?start_date=${startDate}&end_date=${endDate}`;
  const auth = await client.getAuthorization();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${auth.token}`
  };
  const response = await import_axios6.default.get(url, { headers });
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client
});
