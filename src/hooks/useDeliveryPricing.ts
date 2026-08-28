import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    deliveryPricingService,
    DeliveryPricingConfig,
} from '../services/deliveryPricingService';

export const deliveryPricingKeys = {
    all: ['delivery-pricing'] as const,
    config: () => [...deliveryPricingKeys.all, 'config'] as const,
    analytics: () => [...deliveryPricingKeys.all, 'analytics'] as const,
};

export function useDeliveryPricingConfig() {
    return useQuery({
        queryKey: deliveryPricingKeys.config(),
        queryFn: () => deliveryPricingService.getConfig(),
    });
}

export function useUpdateDeliveryPricingConfig() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<DeliveryPricingConfig>) => deliveryPricingService.updateConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: deliveryPricingKeys.all });
        },
    });
}

export function useDeliveryPricingAnalytics() {
    return useQuery({
        queryKey: deliveryPricingKeys.analytics(),
        queryFn: () => deliveryPricingService.getAnalytics(),
        refetchInterval: 30000, // Refetch every 30s for live order tracking
    });
}

export function useSimulatePricing() {
    return useMutation({
        mutationFn: (data: {
            distance: number;
            type?: string;
            isCod?: boolean;
            isPriority?: boolean;
            isHeavyItem?: boolean;
            waitingMinutes?: number;
        }) => deliveryPricingService.simulate(data),
    });
}
