// API Configuration for Admin Panel
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: 30000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    ME: '/users/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Admin specific
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    // Users
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    UPDATE_USER_STATUS: (id: string) => `/admin/users/${id}/status`,
    DELETE_USER: (id: string) => `/admin/users/${id}`,
    // Taskers
    PENDING_TASKERS: '/admin/taskers/pending',
    VERIFY_TASKER: (id: string) => `/admin/taskers/${id}/verify`,
    // Transactions
    TRANSACTIONS: '/admin/transactions',
    TRANSACTION_STATS: '/admin/transactions/stats',
    // Services
    CREATE_SERVICE: '/admin/services',
    UPDATE_SERVICE: (id: string) => `/admin/services/${id}`,
    DELETE_SERVICE: (id: string) => `/admin/services/${id}`,
    // Support
    SUPPORT_TICKETS: '/admin/support',
    RESPOND_TO_TICKET: (id: string) => `/admin/support/${id}/respond`,
    // Notifications
    SEND_NOTIFICATION: '/admin/notifications/send',
    // Work Zones
    ZONES: '/zones',
    // Gig Incentives
    INCENTIVES: '/incentives',
    // Tasker Offers
    OFFERS: '/offers',
    // Bazaar Rewards
    REWARDS: '/rewards',
  },

  // Tasks
  TASKS: {
    LIST: '/tasks/my',
    AVAILABLE: '/tasks/available',
    ALL: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    STATS: '/tasks/stats',
    ACTIVE: '/tasks/my?status=IN_PROGRESS,ACCEPTED',
  },

  // Delivery Requests
  DELIVERY_REQUESTS: {
    LIST: '/delivery-requests',
    BY_ID: (id: string) => `/delivery-requests/${id}`,
    STATS: '/delivery-requests/admin/stats',
    AVAILABLE: '/delivery-requests/available',
  },

  // Delivery Pricing & Unit Economics
  DELIVERY_PRICING: {
    CONFIG: '/admin/delivery-pricing',
    UPDATE: '/admin/delivery-pricing',
    ANALYTICS: '/admin/delivery-pricing/analytics',
  },

  // Pool
  POOL: {
    BALANCE: '/pool/balance',
    TRANSACTIONS: '/pool/transactions',
    STATS: '/pool/stats',
    OUTBOUND: '/pool/outbound',
  },

  // Public Services
  SERVICES: {
    LIST: '/services',
    BY_ID: (id: string) => `/services/${id}`,
    POPULAR: '/services/popular',
    SEARCH: '/services/search',
  },
} as const;
