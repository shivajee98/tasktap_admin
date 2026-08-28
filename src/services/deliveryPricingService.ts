import { apiClient } from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface DistanceSlab {
    minKm: number;
    maxKm: number;
    customerCharge: number;
    riderPayout: number;
}

export const DEFAULT_DISTANCE_SLABS: DistanceSlab[] = [
    { minKm: 0, maxKm: 2, customerCharge: 29, riderPayout: 20 },
    { minKm: 2, maxKm: 5, customerCharge: 39, riderPayout: 27 },
    { minKm: 5, maxKm: 8, customerCharge: 49, riderPayout: 35 },
    { minKm: 8, maxKm: 10, customerCharge: 59, riderPayout: 42 },
];

export interface DeliveryPricingConfig {
    id?: string;
    isActive?: boolean;
    distanceSlabs: DistanceSlab[];
    extraDistanceSurcharge: number;
    extraDistanceRiderPayout: number;
    launchOfferEnabled: boolean;
    launchOfferType: 'FIRST_DELIVERY_19' | 'FIRST_3_DELIVERIES_29' | 'CUSTOM';
    firstDeliveryPrice: number;
    firstThreePrice: number;
    customPromoDiscount: number;
    codFee: number;
    priorityFee: number;
    heavyItemFee: number;
    waitingFreeMinutes: number;
    waitingFeePerMinute: number;
    variableCostPerOrder: number;
    minOrderValue: number;
}

export interface PricingBreakdownResult {
    distance: number;
    distanceSlab: string;
    baseCustomerCharge: number;
    extraDistanceFee: number;
    promoDiscount: number;
    promoApplied: string | null;
    codFee: number;
    priorityFee: number;
    heavyItemFee: number;
    waitingFee: number;
    totalCustomerCharge: number;
    riderPayout: number;
    variableCost: number;
    netContribution: number;
    launchOfferInfo: {
        type: string;
        applied: boolean;
        discount: number;
        label: string;
    } | null;
}

export interface PricingAnalyticsData {
    overview: {
        totalOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        pendingOrders: number;
        cancellationRate: number;
        repeatCustomerPercentage: number;
        totalUniqueCustomers: number;
        repeatCustomers: number;
    };
    unitEconomics: {
        totalRevenue: number;
        totalRiderPayout: number;
        totalVariableCost: number;
        totalNetContribution: number;
        avgOrderValue: number;
        avgDeliveryCharge: number;
        avgRiderPayout: number;
        avgContributionPerOrder: number;
        avgDistance: number;
        totalCustomerAcquisitionCost: number;
    };
    slabPerformance: Array<{
        label: string;
        orders: number;
        revenue: number;
        riderPayout: number;
        netContribution: number;
    }>;
    dailyMetrics: Array<{
        date: string;
        orders: number;
        revenue: number;
        riderPayout: number;
        variableCost: number;
        netContribution: number;
    }>;
}

export const deliveryPricingService = {
    getConfig: async (): Promise<{ data: DeliveryPricingConfig }> => {
        const response = await apiClient.get(API_ENDPOINTS.DELIVERY_PRICING.CONFIG);
        return response.data;
    },

    updateConfig: async (data: Partial<DeliveryPricingConfig>): Promise<{ data: DeliveryPricingConfig; message: string }> => {
        const response = await apiClient.put(API_ENDPOINTS.DELIVERY_PRICING.UPDATE, data);
        return response.data;
    },

    getAnalytics: async (): Promise<{ data: PricingAnalyticsData }> => {
        const response = await apiClient.get(API_ENDPOINTS.DELIVERY_PRICING.ANALYTICS);
        return response.data;
    },

    simulate: async (data: {
        distance: number;
        type?: string;
        isCod?: boolean;
        isPriority?: boolean;
        isHeavyItem?: boolean;
        waitingMinutes?: number;
    }): Promise<{ data: PricingBreakdownResult }> => {
        const response = await apiClient.post(`${API_ENDPOINTS.DELIVERY_PRICING.CONFIG}/simulate`, data);
        return response.data;
    },
};
