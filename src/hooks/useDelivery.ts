import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryService } from '../services/deliveryService';

export const deliveryKeys = {
    all: ['deliveries'] as const,
    lists: () => [...deliveryKeys.all, 'list'] as const,
    list: (filters: any) => [...deliveryKeys.lists(), filters] as const,
    details: () => [...deliveryKeys.all, 'detail'] as const,
    detail: (id: string) => [...deliveryKeys.details(), id] as const,
    stats: () => [...deliveryKeys.all, 'stats'] as const,
};

export const useDeliveryRequests = (filters?: { page?: number; limit?: number; status?: string; type?: string }) => {
    return useQuery({
        queryKey: deliveryKeys.list(filters || {}),
        queryFn: () => deliveryService.getAll(filters),
    });
};

export const useDeliveryDetail = (id: string) => {
    return useQuery({
        queryKey: deliveryKeys.detail(id),
        queryFn: () => deliveryService.getById(id),
        enabled: !!id,
    });
};

export const useDeliveryStats = () => {
    return useQuery({
        queryKey: deliveryKeys.stats(),
        queryFn: () => deliveryService.getStats(),
    });
};

export const useAcceptDelivery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deliveryService.acceptDelivery(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
        },
    });
};
