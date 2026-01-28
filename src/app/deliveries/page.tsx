"use client";

import { useState } from "react";
import { useDeliveryRequests, useAcceptDelivery } from "@/hooks";
import { Search, Filter, Eye, Truck, Package, MapPin, Phone } from "lucide-react";
import { DeliveryRequestStatus, DeliveryRequestType } from "@/services/deliveryService";

export default function DeliveriesPage() {
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const { mutate: acceptDelivery, isPending: isAccepting } = useAcceptDelivery();
    const { data, isLoading } = useDeliveryRequests({
        page: 1,
        limit: 50,
    });

    const allDeliveries = data?.data || [];

    const filteredDeliveries = allDeliveries.filter((delivery: any) => {
        // Status Filter
        if (statusFilter !== "ALL" && delivery.status !== statusFilter) return false;

        // Search
        if (search) {
            const q = search.toLowerCase();
            return (
                delivery.id.toLowerCase().includes(q) ||
                delivery.pickupLocation?.toLowerCase().includes(q) ||
                delivery.dropLocation?.toLowerCase().includes(q) ||
                delivery.user?.fullName?.toLowerCase().includes(q) ||
                delivery.phoneNumber?.includes(q)
            );
        }
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
            case 'IN_TRANSIT': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeName = (type: string) => {
        return type === 'STANDARD_FAST_DELIVERY' ? 'Standard Delivery' : 'Load Pickup/Drop';
    };

    const getTypeIcon = (type: string) => {
        return type === 'STANDARD_FAST_DELIVERY' ? <Package size={16} /> : <Truck size={16} />;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Total Found: {allDeliveries.length}</span>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                        Export Stats
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['ALL', 'PENDING', 'ACCEPTED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search ID, location, customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Locations</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                // Skeleton
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : filteredDeliveries.length > 0 ? (
                                filteredDeliveries.map((delivery: any) => (
                                    <tr key={delivery.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            #{delivery.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="p-1.5 bg-gray-100 rounded-md text-gray-500">
                                                    {getTypeIcon(delivery.type)}
                                                </span>
                                                <div>
                                                    <div className="font-medium">{getTypeName(delivery.type)}</div>
                                                    {delivery.weightCategory && (
                                                        <div className="text-xs text-gray-400 capitalize">{delivery.weightCategory.replace('WEIGHT_', '').replace('_', '-')} kg</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-start gap-1">
                                                    <MapPin size={12} className="text-green-500 mt-1 flex-shrink-0" />
                                                    <span className="text-xs truncate" title={delivery.pickupLocation}>{delivery.pickupLocation}</span>
                                                </div>
                                                <div className="flex items-start gap-1">
                                                    <MapPin size={12} className="text-red-500 mt-1 flex-shrink-0" />
                                                    <span className="text-xs truncate" title={delivery.dropLocation}>{delivery.dropLocation}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{delivery.user?.fullName}</span>
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Phone size={10} />
                                                    <span>{delivery.phoneNumber}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                                                {delivery.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            ₹{delivery.estimatedPrice || delivery.finalPrice || 0}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(delivery.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {delivery.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => acceptDelivery(delivery.id)}
                                                        disabled={isAccepting && acceptingId === delivery.id}
                                                        className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs font-semibold transition-colors disabled:opacity-50"
                                                    >
                                                        {isAccepting && acceptingId === delivery.id ? '...' : 'Accept'}
                                                    </button>
                                                )}
                                                <button className="text-gray-400 hover:text-orange-500 transition-colors p-1">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        No delivery requests found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
