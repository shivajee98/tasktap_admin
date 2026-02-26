import { apiClient } from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface PoolBalance {
    id: string;
    currentBalance: number;
    totalInbound: number;
    totalOutbound: number;
    lastUpdatedAt: string;
}

export interface PoolTransaction {
    id: string;
    type: 'INBOUND' | 'OUTBOUND';
    amount: number;
    description: string;
    deliveryRequestId?: string;
    deliveryRequest?: {
        id: string;
        type: string;
        status: string;
        pickupLocation: string;
        dropLocation: string;
    };
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

export interface PoolStats {
    currentBalance: number;
    totalInbound: number;
    totalOutbound: number;
    today: { inbound: number; outbound: number; inboundCount: number; outboundCount: number };
    week: { inbound: number; outbound: number; inboundCount: number; outboundCount: number };
    month: { inbound: number; outbound: number; inboundCount: number; outboundCount: number };
}

export const poolService = {
    getBalance: async (): Promise<{ data: PoolBalance }> => {
        const response = await apiClient.get(API_ENDPOINTS.POOL.BALANCE);
        return response.data;
    },

    getTransactions: async (params?: {
        page?: number;
        limit?: number;
        type?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{ data: PoolTransaction[]; pagination: any }> => {
        const response = await apiClient.get(API_ENDPOINTS.POOL.TRANSACTIONS, { params });
        return response.data;
    },

    getStats: async (): Promise<{ data: PoolStats }> => {
        const response = await apiClient.get(API_ENDPOINTS.POOL.STATS);
        return response.data;
    },

    createOutbound: async (data: { amount: number; description: string; metadata?: any }): Promise<{ data: PoolTransaction }> => {
        const response = await apiClient.post(API_ENDPOINTS.POOL.OUTBOUND, data);
        return response.data;
    },
};
