import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface RecentActivity {
  type: string;
  title: string;
  description: string;
  time: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalTaskers: number;
  totalTasks: number;
  totalRevenue: number;
  pendingTaskers: number;
  activeTasks: number;
  completedTasks: number;
  monthlyRevenue: MonthlyRevenue[];
  recentActivity: RecentActivity[];
}

export interface TransactionStats {
  totalRevenue: number;
  totalPayments: number;
  totalPayouts: number;
  totalRefunds: number;
  pendingPayouts: number;
  completedTransactions: number;
  failedTransactions: number;
}

export interface User {
  id: string;
  fullName: string;
  name?: string; // alias for fullName
  email: string;
  phone?: string;
  role: 'USER' | 'TASKER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  avatar?: string;
  profileImage?: string;
  emailVerified: boolean;
  isOnline?: boolean;
  adminApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  rating?: number;
  totalTasks?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tasker extends User {
  taskerProfile?: {
    id: string;
    bio?: string;
    skills: string[];
    rating: number;
    totalReviews: number;
    totalTasks: number;
    isVerified: boolean;
    isAvailable: boolean;
    hourlyRate?: number;
    documents?: string[];
  };
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  basePrice: number;
  isActive: boolean;
  category?: string;
  packages: ServicePackage[];
  createdAt: string;
  updatedAt: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  features: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  price: number;
  scheduledDate: string;
  scheduledTime?: string;
  user: User;
  tasker?: User;
  service?: Service;
  serviceId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'PAYMENT' | 'REFUND' | 'PAYOUT' | 'COMMISSION';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  method?: string;
  user?: User;
  userId?: string;
  task?: Task;
  taskId?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  user: User;
  responses: TicketResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketResponse {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API response structure from backend
export interface ApiPaginatedResponse<T> {
  status: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  basePrice: number;
  category?: string;
  packages?: Omit<ServicePackage, 'id'>[];
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  isActive?: boolean;
}

export interface WorkZone {
  id: string;
  name: string;
  coordinates: any; // Using any for Json type, could be specific { latitude: number, longitude: number }[]
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GigIncentive {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  totalAmount: number;
  baseAmount: number;
  targetGigs: number;
  targetOrders: number;
  conditions?: any;
  createdAt: string;
  updatedAt: string;
}

export interface TaskerOffer {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  amount: number;
  isMissed: boolean;
  missedReason?: string;
  tasker?: User;
  taskerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BazaarReward {
  id: string;
  amount: number;
  earnedAt: string;
  isScratched: boolean;
  tasker?: User;
  taskerId: string;
  createdAt: string;
  updatedAt: string;
}

// Admin Service
export const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<{ data: DashboardStats }> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },

  // Users
  getUsers: async (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }): Promise<ApiPaginatedResponse<User>> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS, { params });
    return response.data;
  },

  getUserById: async (id: string): Promise<{ data: User }> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
    return response.data;
  },

  updateUserStatus: async (id: string, status: string): Promise<{ data: User }> => {
    const response = await apiClient.patch(API_ENDPOINTS.ADMIN.UPDATE_USER_STATUS(id), { status });
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.DELETE_USER(id));
  },

  // Taskers
  getPendingTaskers: async (params?: { page?: number; limit?: number }): Promise<ApiPaginatedResponse<Tasker>> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.PENDING_TASKERS, { params });
    return response.data;
  },

  verifyTasker: async (id: string, isVerified: boolean): Promise<{ data: Tasker }> => {
    const response = await apiClient.patch(API_ENDPOINTS.ADMIN.VERIFY_TASKER(id), {
      status: isVerified ? 'APPROVED' : 'REJECTED',
    });
    return response.data;
  },

  // Services
  getServices: async (params?: { page?: number; limit?: number; includeInactive?: boolean }): Promise<ApiPaginatedResponse<Service>> => {
    const queryParams: any = { ...params };
    // Admin should see all services by default
    if (params?.includeInactive !== false) {
      queryParams.includeInactive = 'true';
    }
    const response = await apiClient.get(API_ENDPOINTS.SERVICES.LIST, { params: queryParams });
    return response.data;
  },

  getServiceById: async (id: string): Promise<{ data: Service }> => {
    const response = await apiClient.get(API_ENDPOINTS.SERVICES.BY_ID(id));
    return response.data;
  },

  createService: async (data: CreateServiceInput): Promise<{ data: Service }> => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.CREATE_SERVICE, data);
    return response.data;
  },

  updateService: async (id: string, data: UpdateServiceInput): Promise<{ data: Service }> => {
    const response = await apiClient.patch(API_ENDPOINTS.ADMIN.UPDATE_SERVICE(id), data);
    return response.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.DELETE_SERVICE(id));
  },

  // Transactions
  getTransactions: async (params?: { page?: number; limit?: number; type?: string; status?: string }): Promise<ApiPaginatedResponse<Transaction>> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.TRANSACTIONS, { params });
    return response.data;
  },

  getTransactionStats: async (startDate?: string, endDate?: string): Promise<{ data: TransactionStats }> => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.TRANSACTION_STATS, { params });
    return response.data;
  },

  // Tasks (for tracking active tasks)
  getActiveTasks: async (params?: { page?: number; limit?: number; status?: string }): Promise<ApiPaginatedResponse<Task>> => {
    const response = await apiClient.get(API_ENDPOINTS.TASKS.ALL, { params });
    return response.data;
  },

  getTaskById: async (id: string): Promise<{ data: Task }> => {
    const response = await apiClient.get(API_ENDPOINTS.TASKS.BY_ID(id));
    return response.data;
  },

  acceptTask: async (id: string): Promise<{ data: Task }> => {
    const response = await apiClient.post(`/tasks/${id}/accept`);
    return response.data;
  },

  // Support Tickets
  getSupportTickets: async (params?: { page?: number; limit?: number; status?: string; priority?: string }): Promise<ApiPaginatedResponse<SupportTicket>> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.SUPPORT_TICKETS, { params });
    return response.data;
  },

  respondToTicket: async (id: string, message: string): Promise<{ data: SupportTicket }> => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.RESPOND_TO_TICKET(id), { message });
    return response.data;
  },

  // Work Zones
  getWorkZones: async (): Promise<{ data: WorkZone[] }> => {
    // Note: Admin gets all zones via the public/tasker endpoint which returns all valid zones,
    // but the controller might have logic.
    // Backend router: router.get('/', protect, workZoneController.getWorkZones);
    // Controller: const isAdmin = req.user?.role === 'ADMIN'; const zones = await workZoneService.getWorkZones(isAdmin);
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ZONES);
    return response.data;
  },

  createWorkZone: async (data: Partial<WorkZone>): Promise<{ data: WorkZone }> => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.ZONES, data);
    return response.data;
  },

  updateWorkZone: async (id: string, data: Partial<WorkZone>): Promise<{ data: WorkZone }> => {
    const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.ZONES}/${id}`, data);
    return response.data;
  },

  deleteWorkZone: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.ADMIN.ZONES}/${id}`);
  },

  // Gig Incentives
  getIncentives: async (): Promise<{ data: GigIncentive[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.INCENTIVES);
    return response.data;
  },

  createIncentive: async (data: Partial<GigIncentive>): Promise<{ data: GigIncentive }> => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.INCENTIVES, data);
    return response.data;
  },

  updateIncentive: async (id: string, data: Partial<GigIncentive>): Promise<{ data: GigIncentive }> => {
    const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.INCENTIVES}/${id}`, data);
    return response.data;
  },

  deleteIncentive: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.ADMIN.INCENTIVES}/${id}`);
  },

  // Tasker Offers
  getOffers: async (): Promise<{ data: TaskerOffer[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.OFFERS);
    return response.data;
  },

  createOffer: async (data: Partial<TaskerOffer>): Promise<{ data: TaskerOffer }> => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.OFFERS, data);
    return response.data;
  },

  updateOffer: async (id: string, data: Partial<TaskerOffer>): Promise<{ data: TaskerOffer }> => {
    const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.OFFERS}/${id}`, data);
    return response.data;
  },

  deleteOffer: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.ADMIN.OFFERS}/${id}`);
  },

  // Bazaar Rewards
  getRewards: async (): Promise<{ data: BazaarReward[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.REWARDS);
    return response.data;
  },

  createReward: async (data: Partial<BazaarReward>): Promise<{ data: BazaarReward }> => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.REWARDS, data);
    return response.data;
  },

  updateReward: async (id: string, data: Partial<BazaarReward>): Promise<{ data: BazaarReward }> => {
    const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN.REWARDS}/${id}`, data);
    return response.data;
  },

  deleteReward: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.ADMIN.REWARDS}/${id}`);
  },

  // Notifications
  sendNotification: async (data: { title: string; message: string; target: string; userIds?: string[] }): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.SEND_NOTIFICATION, data);
    return response.data;
  },
};

