"use client";

import { useState } from "react";
import { usePoolBalance, usePoolTransactions, usePoolStats, useCreateOutbound } from "@/hooks";
import { Wallet, ArrowDownLeft, ArrowUpRight, X, Search, TrendingUp, TrendingDown } from "lucide-react";

export default function PoolPage() {
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [outboundModal, setOutboundModal] = useState(false);
    const [outboundForm, setOutboundForm] = useState({ amount: '', description: '' });

    const { data: balanceData, isLoading: balanceLoading } = usePoolBalance();
    const { data: statsData, isLoading: statsLoading } = usePoolStats();
    const { data: txData, isLoading: txLoading } = usePoolTransactions({
        page,
        limit: 20,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
    });
    const { mutate: createOutbound, isPending: isCreatingOutbound } = useCreateOutbound();

    const balance = balanceData?.data;
    const stats = statsData?.data;
    const transactions = txData?.data || [];
    const pagination = txData?.pagination;

    const filteredTransactions = transactions.filter((tx: any) => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                tx.description?.toLowerCase().includes(q) ||
                tx.deliveryRequestId?.toLowerCase().includes(q) ||
                tx.id?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleCreateOutbound = () => {
        if (!outboundForm.amount || !outboundForm.description) return;
        createOutbound({
            amount: parseFloat(outboundForm.amount),
            description: outboundForm.description,
        }, {
            onSuccess: () => {
                setOutboundModal(false);
                setOutboundForm({ amount: '', description: '' });
            },
        });
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
        return `₹${Math.round(amount)}`;
    };

    return (
        <div className="p-4 md:p-6 max-w-full overflow-hidden">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Central Pool</h1>
                <button
                    onClick={() => setOutboundModal(true)}
                    className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-200 flex items-center gap-2 self-start"
                >
                    <ArrowUpRight size={16} />
                    Record Outbound
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Wallet size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Current Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {balanceLoading ? '...' : formatCurrency(balance?.currentBalance || 0)}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <ArrowDownLeft size={20} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Inbound</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                        {balanceLoading ? '...' : formatCurrency(balance?.totalInbound || 0)}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                            <ArrowUpRight size={20} className="text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Outbound</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">
                        {balanceLoading ? '...' : formatCurrency(balance?.totalOutbound || 0)}
                    </p>
                </div>
            </div>

            {/* Period Stats */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Today</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-green-600">
                                <TrendingUp size={14} /> ₹{Math.round(stats.today.inbound)}
                            </span>
                            <span className="flex items-center gap-1 text-red-600">
                                <TrendingDown size={14} /> ₹{Math.round(stats.today.outbound)}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">This Week</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-green-600">
                                <TrendingUp size={14} /> ₹{Math.round(stats.week.inbound)}
                            </span>
                            <span className="flex items-center gap-1 text-red-600">
                                <TrendingDown size={14} /> ₹{Math.round(stats.week.outbound)}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">This Month</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-green-600">
                                <TrendingUp size={14} /> ₹{Math.round(stats.month.inbound)}
                            </span>
                            <span className="flex items-center gap-1 text-red-600">
                                <TrendingDown size={14} /> ₹{Math.round(stats.month.outbound)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex gap-2">
                    {['ALL', 'INBOUND', 'OUTBOUND'].map((type) => (
                        <button
                            key={type}
                            onClick={() => { setTypeFilter(type); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === type
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by description, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                </div>
            </div>

            {/* Transaction History Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {txLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tx.type === 'INBOUND' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900 max-w-[300px] truncate" title={tx.description}>
                                            {tx.description}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {tx.deliveryRequestId ? (
                                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded" title={tx.deliveryRequestId}>
                                                    #{tx.deliveryRequestId.slice(0, 8)}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className={`px-4 py-4 text-sm font-bold text-right whitespace-nowrap ${tx.type === 'INBOUND' ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                            {tx.type === 'INBOUND' ? '+' : '-'}₹{Math.round(tx.amount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= pagination.totalPages}
                                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Outbound Modal */}
            {outboundModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Record Outbound Payment</h3>
                            <button onClick={() => setOutboundModal(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={outboundForm.amount}
                                    onChange={(e) => setOutboundForm(prev => ({ ...prev, amount: e.target.value }))}
                                    placeholder="Enter amount"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={outboundForm.description}
                                    onChange={(e) => setOutboundForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="e.g., Payment to delivery person John for 5 deliveries"
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                                />
                            </div>
                            <button
                                onClick={handleCreateOutbound}
                                disabled={isCreatingOutbound || !outboundForm.amount || !outboundForm.description}
                                className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition disabled:opacity-50"
                            >
                                {isCreatingOutbound ? 'Recording...' : 'Record Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
