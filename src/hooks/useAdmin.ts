import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminService,
  CreateServiceInput,
  UpdateServiceInput,
} from '../services/adminService';

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,

  users: () => [...adminKeys.all, 'users'] as const,
  userList: (filters?: any) => [...adminKeys.users(), 'list', filters] as const,
  userDetail: (id: string) => [...adminKeys.users(), 'detail', id] as const,

  taskers: () => [...adminKeys.all, 'taskers'] as const,
  taskerList: (filters?: any) => [...adminKeys.taskers(), 'list', filters] as const,
  taskerDetail: (id: string) => [...adminKeys.taskers(), 'detail', id] as const,

  services: () => [...adminKeys.all, 'services'] as const,
  serviceList: (filters?: any) => [...adminKeys.services(), 'list', filters] as const,
  serviceDetail: (id: string) => [...adminKeys.services(), 'detail', id] as const,

  tasks: () => [...adminKeys.all, 'tasks'] as const,
  taskList: (filters?: any) => [...adminKeys.tasks(), 'list', filters] as const,
  taskDetail: (id: string) => [...adminKeys.tasks(), 'detail', id] as const,

  transactions: () => [...adminKeys.all, 'transactions'] as const,
  transactionList: (filters?: any) => [...adminKeys.transactions(), 'list', filters] as const,

  tickets: () => [...adminKeys.all, 'tickets'] as const,
  ticketList: (filters?: any) => [...adminKeys.tickets(), 'list', filters] as const,
  ticketDetail: (id: string) => [...adminKeys.tickets(), 'detail', id] as const,
};

// Dashboard
export const useDashboardStats = () => {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminService.getDashboardStats(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Users
export const useUsers = (filters?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) => {
  return useQuery({
    queryKey: adminKeys.userList(filters),
    queryFn: () => adminService.getUsers(filters),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: adminKeys.userDetail(id),
    queryFn: () => adminService.getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminService.updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.userDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

// Taskers
export const usePendingTaskers = (filters?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: adminKeys.taskerList(filters),
    queryFn: () => adminService.getPendingTaskers(filters),
  });
};

export const useVerifyTasker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) => adminService.verifyTasker(id, isVerified),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.taskerDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.taskers() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
};

// Services
export const useServices = (filters?: { page?: number; limit?: number; includeInactive?: boolean }) => {
  return useQuery({
    queryKey: adminKeys.serviceList(filters),
    queryFn: () => adminService.getServices(filters),
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: adminKeys.serviceDetail(id),
    queryFn: () => adminService.getServiceById(id),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceInput) => adminService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.services() });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceInput }) => adminService.updateService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.serviceDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.services() });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.services() });
    },
  });
};

// Transactions
export const useTransactions = (filters?: { page?: number; limit?: number; type?: string; status?: string }) => {
  return useQuery({
    queryKey: adminKeys.transactionList(filters),
    queryFn: () => adminService.getTransactions(filters),
  });
};

export const useTransactionStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...adminKeys.transactions(), 'stats', startDate, endDate] as const,
    queryFn: () => adminService.getTransactionStats(startDate, endDate),
  });
};

// Active Tasks (for tracking)
export const useActiveTasks = (filters?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: adminKeys.taskList(filters),
    queryFn: () => adminService.getActiveTasks(filters),
    refetchInterval: 30000, // Refetch every 30 seconds for tracking
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: adminKeys.taskDetail(id),
    queryFn: () => adminService.getTaskById(id),
    enabled: !!id,
  });
};

export const useAcceptTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.acceptTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
};

// Support Tickets
export const useSupportTickets = (filters?: { page?: number; limit?: number; status?: string; priority?: string }) => {
  return useQuery({
    queryKey: adminKeys.ticketList(filters),
    queryFn: () => adminService.getSupportTickets(filters),
  });
};

export const useRespondToTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => adminService.respondToTicket(id, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.ticketDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.tickets() });
    },
  });
};

// Notifications
export const useSendNotification = () => {
  return useMutation({
    mutationFn: (data: { title: string; message: string; target: string; userIds?: string[] }) =>
      adminService.sendNotification(data),
  });
};
