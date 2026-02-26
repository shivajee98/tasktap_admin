import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { poolService } from '../services/poolService';

export const poolKeys = {
    all: ['pool'] as const,
    balance: () => [...poolKeys.all, 'balance'] as const,
    transactions: () => [...poolKeys.all, 'transactions'] as const,
    transactionList: (filters: any) => [...poolKeys.transactions(), filters] as const,
    stats: () => [...poolKeys.all, 'stats'] as const,
};

export const usePoolBalance = () => {
    return useQuery({
        queryKey: poolKeys.balance(),
        queryFn: () => poolService.getBalance(),
    });
};

export const usePoolTransactions = (filters?: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
}) => {
    return useQuery({
        queryKey: poolKeys.transactionList(filters || {}),
        queryFn: () => poolService.getTransactions(filters),
    });
};

export const usePoolStats = () => {
    return useQuery({
        queryKey: poolKeys.stats(),
        queryFn: () => poolService.getStats(),
    });
};

export const useCreateOutbound = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { amount: number; description: string; metadata?: any }) =>
            poolService.createOutbound(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: poolKeys.all });
        },
    });
};
