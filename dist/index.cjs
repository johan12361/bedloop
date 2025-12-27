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
  Client: () => Client,
  EventType: () => EventType
});
module.exports = __toCommonJS(index_exports);

// src/client/auth/getAuthorization.ts
var import_axios = __toESM(require("axios"), 1);
var MAX_RETRIES = 3;
var RETRY_DELAY = 1e3;
async function getAuthorization(options) {
  const url = `${options.url}/api/v1/login`;
  const headers = {
    Accept: "application/json",
    Authorization: createUserPass(options.user, options.password)
  };
  const debug = options.debug ?? false;
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await import_axios.default.get(url, { headers });
      if (response.data && response.data.token && response.data.expires_at) {
        if (attempt > 1 && debug) {
          console.log(`Connection successful on attempt ${attempt}`);
        }
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
        if (debug) {
          console.log(`Attempt ${attempt} failed, retrying in ${RETRY_DELAY / 1e3}s...`);
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        if (debug) {
          console.warn(`All ${MAX_RETRIES} attempts failed`);
        }
      }
    }
  }
  throw lastError || new Error("Authorization failed after retries");
}
function createUserPass(user, password) {
  const token = Buffer.from(`${user}:${password}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

// src/client/request/getBookingByDate.ts
var import_axios2 = __toESM(require("axios"), 1);
async function getBookingByDate(baseUrl, token, startDate, endDate) {
  const url = `${baseUrl}/api/v1/bookings?start_date=${startDate}&end_date=${endDate}`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`
  };
  const response = await import_axios2.default.get(url, { headers });
  if (!response.data) {
    throw new Error("No data received from getBookingByDate");
  }
  if (!Array.isArray(response.data.data)) {
    throw new Error("Invalid data format received from getBookingByDate");
  }
  return response.data.data;
}

// src/client/request/getMessages.ts
var import_axios3 = __toESM(require("axios"), 1);
async function getMessages(baseUrl, token, bookingId) {
  const url = `${baseUrl}/api/v1/threads/${bookingId}`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`
  };
  const response = await import_axios3.default.get(url, { headers });
  if (!response.data) {
    throw new Error("No data received from getBookingByDate");
  }
  if (!Array.isArray(response.data.data)) {
    throw new Error("Invalid data format received from getBookingByDate");
  }
  return response.data.data;
}

// src/utils/cache.ts
var LimitedCache = class {
  constructor(maxSize = 1e3, maxAgeMinutes = 60) {
    this.cache = /* @__PURE__ */ new Map();
    this.maxSize = maxSize;
    this.maxAge = maxAgeMinutes * 60 * 1e3;
  }
  // Agrega un elemento al cache
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }
  // Verifica si un elemento existe en el cache
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  // Limpia elementos expirados
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
  // Obtiene el tamaño actual del cache
  get size() {
    return this.cache.size;
  }
};

// src/utils/date.ts
function addDays(date, days) {
  const result = new Date(date.getTime() + days * 24 * 60 * 60 * 1e3);
  return result.toISOString().split("T")[0];
}
function getMinutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1e3);
}

// src/utils/tokenValidation.ts
function isTokenExpired(authorization) {
  return /* @__PURE__ */ new Date() >= authorization.expiresAt;
}

// src/enums/messageDirection.ts
var MESSAGE_DIRECTION = {
  OUTGOING: 0,
  INCOMING: 1
};

// src/types/messages.ts
var DEFAULT_RECENT_MINUTES = 5;
var DEFAULT_CACHE_SIZE = 1e3;
var DEFAULT_CACHE_AGE_MINUTES = 60;

// src/client/pollingMessages/filterMessages.ts
function filterNewMessages(conversations, bookingId, cache, recentMinutes = DEFAULT_RECENT_MINUTES) {
  const newMessages = [];
  const cutoffTime = getMinutesAgo(recentMinutes);
  for (const conversation of conversations) {
    if (!conversation.messages || conversation.messages.length === 0) {
      continue;
    }
    for (const message of conversation.messages) {
      if (message.in_out !== MESSAGE_DIRECTION.INCOMING) {
        continue;
      }
      if (cache.has(message.id)) {
        continue;
      }
      const receivedAt = new Date(message.created_at);
      if (receivedAt < cutoffTime) {
        continue;
      }
      cache.set(message.id, message);
      newMessages.push({
        bookingId,
        conversationId: conversation.id,
        message
      });
    }
  }
  return newMessages;
}

// src/types/events.ts
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2["NEW_MESSAGE"] = "new_message";
  return EventType2;
})(EventType || {});

// src/client/pollingMessages/pollingMessages.ts
var messagesCache = new LimitedCache(DEFAULT_CACHE_SIZE, DEFAULT_CACHE_AGE_MINUTES);
async function pollingMessages(clientConfig, getAuthorization2, pollingOptions, callback) {
  const baseUrl = clientConfig.url;
  const debug = clientConfig.debug ?? false;
  const cleanupInterval = setInterval(
    () => {
      messagesCache.cleanup();
    },
    10 * 60 * 1e3
  );
  const pollingInterval = setInterval(() => {
    void (async () => {
      try {
        const authorization = getAuthorization2();
        if (isTokenExpired(authorization)) {
          if (debug) {
            console.warn("Authorization token has expired");
          }
          clearInterval(pollingInterval);
          clearInterval(cleanupInterval);
          return;
        }
        const token = authorization.token;
        const now = /* @__PURE__ */ new Date();
        const startDate = addDays(now, -pollingOptions.beforeDays);
        const endDate = addDays(now, pollingOptions.afterDays);
        if (debug) {
          console.log(`Polling bookings from ${startDate} to ${endDate}`);
        }
        const bookings = await getBookingByDate(baseUrl, token, startDate, endDate);
        const messagesPromises = bookings.map(async (booking) => {
          try {
            const conversations = await getMessages(baseUrl, token, String(booking.booking_number));
            if (conversations.length === 0) return [];
            return filterNewMessages(conversations, booking.booking_number, messagesCache, pollingOptions.recentMinutes);
          } catch (error) {
            if (debug) {
              console.error(`Error getting messages for booking ${booking.booking_number}:`, error);
            }
            return [];
          }
        });
        const results = await Promise.all(messagesPromises);
        const allNewMessages = results.flat();
        if (allNewMessages.length > 0) {
          if (debug) {
            console.log(`Found ${allNewMessages.length} new message(s)`);
          }
          const events = allNewMessages.map((msg) => ({
            event: "new_message" /* NEW_MESSAGE */,
            timestamp: /* @__PURE__ */ new Date(),
            newMessage: {
              bookingId: msg.bookingId,
              conversationId: msg.conversationId,
              messageId: msg.message.id,
              message: msg.message
            }
          }));
          callback(events);
        }
      } catch (error) {
        if (debug) {
          console.error("Error polling messages:", error);
        }
      }
    })();
  }, pollingOptions.interval);
}

// src/client/client.ts
var defaultPollingOptions = {
  interval: 5e3,
  // 5 segundos
  beforeDays: 7,
  afterDays: 30,
  recentMinutes: 15
};
var Client = class {
  constructor(options, pollingOptions = {}) {
    this.options = options;
    this.pollingOptions = {
      ...defaultPollingOptions,
      ...pollingOptions
    };
    if (this.options.debug) {
      console.log("Client initialized");
    }
  }
  async refreshToken() {
    try {
      this.authorization = await getAuthorization(this.options);
      if (this.options.debug) {
        console.log("Token refreshed:", this.authorization);
      }
    } catch (error) {
      if (this.options.debug) {
        console.error("Error refreshing token:", error);
      }
    }
  }
  async getAuthorization() {
    const now = /* @__PURE__ */ new Date();
    if (!this.authorization || this.authorization.expiresAt <= now) {
      this.authorization = await getAuthorization(this.options);
    }
    return this.authorization;
  }
  async connect(callback) {
    await this.getAuthorization();
    if (this.options.debug) {
      console.log("Connected:", this.authorization);
    }
    this.tokenRefreshInterval = setInterval(
      () => {
        void this.refreshToken();
      },
      12 * 60 * 60 * 1e3
    );
    pollingMessages(this.options, () => this.authorization, this.pollingOptions, callback);
  }
  disconnect() {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = void 0;
    }
    if (this.options.debug) {
      console.log("Client disconnected");
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client,
  EventType
});
