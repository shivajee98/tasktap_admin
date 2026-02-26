import { apiClient } from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { ApiPaginatedResponse, Task } from './adminService'; // Task interface is reused for now where similar

export enum DeliveryRequestType {
    STANDARD_FAST_DELIVERY = 'STANDARD_FAST_DELIVERY',
    LOAD_PICKUP_DROP = 'LOAD_PICKUP_DROP',
}

export enum DeliveryRequestStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    PAID = 'PAID',
}

export interface DeliveryRequest {
    id: string;
    type: DeliveryRequestType;
    status: DeliveryRequestStatus;
    phoneNumber: string;
    pickupLocation: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropLocation: string;
    dropLatitude: number;
    dropLongitude: number;
    documentImage?: string;
    objectImages?: string[];
    weightCategory?: string;
    distance?: number;
    cityName?: string;
    estimatedPrice?: number;
    finalPrice?: number;
    paymentStatus?: PaymentStatus;
    paidAmount?: number;
    paymentNotes?: string;
    paidAt?: string;
    acceptedAt?: string;
    inTransitAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    userId: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        profileImage?: string;
        phone?: string;
    };
    deliveryPersonId?: string;
    deliveryPerson?: {
        id: string;
        fullName: string;
        profileImage?: string;
        phone?: string;
        rating?: number;
    };
    createdAt: string;
    updatedAt: string;
}

export const deliveryService = {
    getAll: async (params?: { page?: number; limit?: number; status?: string; type?: string }): Promise<ApiPaginatedResponse<DeliveryRequest>> => {
        const response = await apiClient.get(API_ENDPOINTS.DELIVERY_REQUESTS.LIST, { params });
        return response.data;
    },

    getById: async (id: string): Promise<DeliveryRequest> => {
        const response = await apiClient.get(API_ENDPOINTS.DELIVERY_REQUESTS.BY_ID(id));
        return response.data;
    },

    getStats: async (): Promise<any> => {
        const response = await apiClient.get(API_ENDPOINTS.DELIVERY_REQUESTS.STATS);
        return response.data;
    },

    acceptDelivery: async (id: string): Promise<{ data: DeliveryRequest }> => {
        const response = await apiClient.post(`${API_ENDPOINTS.DELIVERY_REQUESTS.BY_ID(id)}/accept`);
        return response.data;
    },

    updatePaymentStatus: async (id: string, data: { paymentStatus: string; paidAmount?: number; paymentNotes?: string }): Promise<{ data: DeliveryRequest }> => {
        const response = await apiClient.patch(`${API_ENDPOINTS.DELIVERY_REQUESTS.BY_ID(id)}/payment`, data);
        return response.data;
    },
};
