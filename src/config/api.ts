// API Configuration for Admin Panel
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: 15000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    ME: '/users/me',
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
    // Work Zones
    ZONES: '/zones', // Backend: /api/v1/zones -> workZoneRoutes (admin: POST /, PATCH /:id, DELETE /:id) -> BUT wait, workZoneRoutes has /api/v1/zones. Let's check routes again.
    // Checking server.ts: app.use(`${API_PREFIX}/zones`, workZoneRoutes);
    // workZoneRoutes: router.get('/', protect, workZoneController.getWorkZones); (Public/Tasker)
    // Admin routes in workZoneRoutes: POST /, PATCH /:id, DELETE /:id.
    // So for admin, it's just /zones for list (GET), create (POST), and /zones/:id for update/delete.

    // Gig Incentives
    INCENTIVES: '/incentives', // Backend: /api/v1/incentives
    // Tasker Offers
    OFFERS: '/offers', // Backend: /api/v1/offers
    // Bazaar Rewards
    REWARDS: '/rewards', // Backend: /api/v1/rewards
  },

  // Tasks
  TASKS: {
    LIST: '/tasks/my',
    AVAILABLE: '/tasks/available',
    BY_ID: (id: string) => `/tasks/${id}`,
    STATS: '/tasks/stats',
    ACTIVE: '/tasks/my?status=IN_PROGRESS,ACCEPTED',
  },

  // Public Services
  SERVICES: {
    LIST: '/services',
    BY_ID: (id: string) => `/services/${id}`,
    POPULAR: '/services/popular',
    SEARCH: '/services/search',
  },
} as const;
