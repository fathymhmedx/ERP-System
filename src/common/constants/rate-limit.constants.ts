export const RATE_LIMIT = {
  DEFAULT: {
    limit: 100,
    ttl: 60_000,
  },

  AUTH: {
    LOGIN: {
      limit: 5,
      ttl: 60_000,
    },

    REGISTER: {
      limit: 5,
      ttl: 60_000,
    },

    REFRESH_TOKEN: {
      limit: 20,
      ttl: 60_000,
    },

    CHANGE_PASSWORD: {
      limit: 5,
      ttl: 60_000,
    },
  },

  USERS: {
    RESET_PASSWORD: {
      limit: 5,
      ttl: 60_000,
    },
  },

  PAYMENTS: {
    CREATE: {
      limit: 10,
      ttl: 60_000,
    },
  },

  PAYROLL: {
    GENERATE: {
      limit: 5,
      ttl: 60_000,
    },
  },

  INVOICES: {
    PDF: {
      limit: 20,
      ttl: 60_000,
    },
  },
} as const;
