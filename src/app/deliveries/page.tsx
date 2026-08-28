"use client";

import { useState } from "react";
import { useDeliveryRequests, useAcceptDelivery, useUpdatePaymentStatus } from "@/hooks";
import { Search, Eye, Truck, Package, MapPin, Phone, X, Image as ImageIcon, Star, IndianRupee, CheckCircle, ExternalLink } from "lucide-react";
import { DeliveryRequestStatus, DeliveryRequestType } from "@/services/deliveryService";

export default function DeliveriesPage() {
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
    const [paymentModal, setPaymentModal] = useState<any>(null);
    const [paymentForm, setPaymentForm] = useState({ paymentStatus: '', paidAmount: '', paymentNotes: '' });

    const { mutate: acceptDelivery, isPending: isAccepting, variables: acceptingId } = useAcceptDelivery();
    const { mutate: updatePayment, isPending: isUpdatingPayment } = useUpdatePaymentStatus();
    const { data, isLoading } = useDeliveryRequests({
        page: 1,
        limit: 50,
    });

    const allDeliveries = data?.data || [];

    const filteredDeliveries = allDeliveries.filter((delivery: any) => {
        if (statusFilter !== "ALL" && delivery.status !== statusFilter) return false;
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
            case 'REACHED_PICKUP': return 'bg-indigo-100 text-indigo-800';
            case 'IN_TRANSIT': return 'bg-purple-100 text-purple-800';
            case 'REACHED_DROP': return 'bg-pink-100 text-pink-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-700';
            case 'PARTIALLY_PAID': return 'bg-amber-100 text-amber-700';
            case 'UNPAID': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPaymentStatusLabel = (status: string) => {
        switch (status) {
            case 'PAID': return 'Paid';
            case 'PARTIALLY_PAID': return 'Partial';
            case 'UNPAID': return 'Unpaid';
            default: return 'Unpaid';
        }
    };

    const getTypeName = (type: string) => {
        return type === 'STANDARD_FAST_DELIVERY' ? 'Standard Delivery' : 'Load Pickup/Drop';
    };

    const getTypeIcon = (type: string) => {
        return type === 'STANDARD_FAST_DELIVERY' ? <Package size={16} /> : <Truck size={16} />;
    };

    const handleOpenPaymentModal = (delivery: any) => {
        setPaymentModal(delivery);
        setPaymentForm({
            paymentStatus: delivery.paymentStatus || 'UNPAID',
            paidAmount: delivery.paidAmount?.toString() || '',
            paymentNotes: delivery.paymentNotes || '',
        });
    };

    const handleSubmitPayment = () => {
        if (!paymentModal) return;
        updatePayment({
            id: paymentModal.id,
            data: {
                paymentStatus: paymentForm.paymentStatus,
                paidAmount: paymentForm.paidAmount ? parseFloat(paymentForm.paidAmount) : undefined,
                paymentNotes: paymentForm.paymentNotes || undefined,
            },
        }, {
            onSuccess: () => {
                setPaymentModal(null);
                if (selectedDelivery?.id === paymentModal.id) {
                    setSelectedDelivery((prev: any) => prev ? { ...prev, paymentStatus: paymentForm.paymentStatus, paidAmount: paymentForm.paidAmount ? parseFloat(paymentForm.paidAmount) : prev.paidAmount } : null);
                }
            },
        });
    };

    return (
        <div className="p-4 md:p-6 max-w-full overflow-hidden">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-sm text-gray-500 font-medium">Total: {allDeliveries.length}</span>
                    <button className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-200 flex items-center gap-2">
                        Export Stats
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {['ALL', 'PENDING', 'ACCEPTED', 'REACHED_PICKUP', 'IN_TRANSIT', 'REACHED_DROP', 'DELIVERED', 'CANCELLED'].map((status) => (
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                    <table className="w-full text-left min-w-[1200px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[170px]">Type</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[260px]">Locations</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[170px]">Contact</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[130px]">Platform</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[110px]">Status</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Payment</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[90px]">Price</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Created</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-4 py-4"></td>
                                    </tr>
                                ))
                            ) : filteredDeliveries.length > 0 ? (
                                filteredDeliveries.map((delivery: any) => (
                                    <tr key={delivery.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-gray-600">
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
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col gap-1 w-full overflow-hidden">
                                                <div className="flex items-start gap-1 w-full">
                                                    <MapPin size={12} className="text-green-500 mt-1 flex-shrink-0" />
                                                    <span className="text-xs truncate max-w-[220px] inline-block" title={delivery.pickupLocation}>{delivery.pickupLocation}</span>
                                                </div>
                                                <div className="flex items-start gap-1 w-full">
                                                    <MapPin size={12} className="text-red-500 mt-1 flex-shrink-0" />
                                                    <span className="text-xs truncate max-w-[220px] inline-block" title={delivery.dropLocation}>{delivery.dropLocation}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-medium truncate max-w-[150px]" title={delivery.user?.fullName}>{delivery.user?.fullName}</span>
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Phone size={10} className="flex-shrink-0" />
                                                    <span className="truncate">{delivery.phoneNumber}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{delivery.deliveryService || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                                                {delivery.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(delivery.paymentStatus || 'UNPAID')}`}>
                                                {getPaymentStatusLabel(delivery.paymentStatus || 'UNPAID')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                                            <div className="font-bold text-gray-900">
                                                ₹{Math.round(delivery.customerCharge || delivery.paidAmount || delivery.estimatedPrice || delivery.finalPrice || 0)}
                                            </div>
                                            {delivery.riderPayout !== undefined && delivery.riderPayout > 0 && (
                                                <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <span>Rider: ₹{Math.round(delivery.riderPayout)}</span>
                                                    {delivery.netContribution !== undefined && (
                                                        <span className={`font-bold ${delivery.netContribution >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                            ({delivery.netContribution >= 0 ? `+₹${Math.round(delivery.netContribution)}` : `-₹${Math.abs(Math.round(delivery.netContribution))}`})
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(delivery.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-right">
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
                                                {delivery.paymentStatus !== 'PAID' && (
                                                    <button
                                                        onClick={() => handleOpenPaymentModal(delivery)}
                                                        className="text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded text-xs font-semibold transition-colors"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedDelivery(delivery)}
                                                    className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                                        No delivery requests found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Modal */}
            {paymentModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Update Payment</h3>
                            <button onClick={() => setPaymentModal(null)} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                                <span className="font-medium text-gray-900">Delivery #{paymentModal.id.slice(0, 8)}</span>
                                <br />
                                Estimated: ₹{Math.round(paymentModal.estimatedPrice || 0)}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                <select
                                    value={paymentForm.paymentStatus}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentStatus: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                >
                                    <option value="UNPAID">Unpaid</option>
                                    <option value="PARTIALLY_PAID">Partially Paid</option>
                                    <option value="PAID">Fully Paid</option>
                                </select>
                            </div>

                            {(paymentForm.paymentStatus === 'PAID' || paymentForm.paymentStatus === 'PARTIALLY_PAID') && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Collected (₹)</label>
                                    <input
                                        type="number"
                                        value={paymentForm.paidAmount}
                                        onChange={(e) => setPaymentForm(prev => ({ ...prev, paidAmount: e.target.value }))}
                                        placeholder={`${Math.round(paymentModal.estimatedPrice || 0)}`}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                                <textarea
                                    value={paymentForm.paymentNotes}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentNotes: e.target.value }))}
                                    placeholder="Payment notes..."
                                    rows={2}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                                />
                            </div>

                            <button
                                onClick={handleSubmitPayment}
                                disabled={isUpdatingPayment}
                                className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition disabled:opacity-50"
                            >
                                {isUpdatingPayment ? 'Updating...' : 'Update Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delivery Details Modal */}
            {selectedDelivery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Delivery Details</h3>
                                <p className="text-sm text-gray-500">#{selectedDelivery.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedDelivery(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status & Type */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Status & Type</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedDelivery.status)}`}>
                                                {selectedDelivery.status.replace('_', ' ')}
                                            </span>
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                {getTypeName(selectedDelivery.type)}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Delivery Platform</h4>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center gap-2">
                                                <Truck size={16} className="text-orange-500" />
                                                <span className="text-sm font-medium text-gray-900">{selectedDelivery.deliveryService || 'Auto Selection'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Pricing</h4>
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Estimated Price:</span>
                                                <span className="font-semibold text-gray-900">₹{Math.round(selectedDelivery.estimatedPrice || 0)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Final Price:</span>
                                                <span className="font-semibold text-gray-900">₹{selectedDelivery.finalPrice ? Math.round(selectedDelivery.finalPrice) : 'Pending'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Status */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Payment</h4>
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Status:</span>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(selectedDelivery.paymentStatus || 'UNPAID')}`}>
                                                    {getPaymentStatusLabel(selectedDelivery.paymentStatus || 'UNPAID')}
                                                </span>
                                            </div>
                                            {selectedDelivery.paidAmount != null && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">Amount Paid:</span>
                                                    <span className="font-semibold text-green-700">₹{Math.round(selectedDelivery.paidAmount)}</span>
                                                </div>
                                            )}
                                            {selectedDelivery.paidAt && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">Paid At:</span>
                                                    <span className="text-gray-900">{new Date(selectedDelivery.paidAt).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {selectedDelivery.paymentNotes && (
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Notes:</span>
                                                    <p className="text-gray-900 mt-0.5">{selectedDelivery.paymentNotes}</p>
                                                </div>
                                            )}
                                            {selectedDelivery.paymentStatus !== 'PAID' && (
                                                <button
                                                    onClick={() => handleOpenPaymentModal(selectedDelivery)}
                                                    className="w-full mt-1 bg-orange-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition flex items-center justify-center gap-1"
                                                >
                                                    <IndianRupee size={12} />
                                                    Mark as Paid
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Customer + Delivery Person */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Customer Details</h4>
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase">
                                                    {selectedDelivery.user?.fullName?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-medium text-gray-900">{selectedDelivery.user?.fullName || 'Unknown User'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone size={14} />
                                                <span>{selectedDelivery.phoneNumber}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Person */}
                                    {selectedDelivery.deliveryPerson && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Delivery Person</h4>
                                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                                        {selectedDelivery.deliveryPerson.fullName?.charAt(0) || '?'}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{selectedDelivery.deliveryPerson.fullName}</span>
                                                </div>
                                                {selectedDelivery.deliveryPerson.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone size={14} />
                                                        <span>{selectedDelivery.deliveryPerson.phone}</span>
                                                    </div>
                                                )}
                                                {selectedDelivery.deliveryPerson.rating != null && selectedDelivery.deliveryPerson.rating > 0 && (
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                        <span>{selectedDelivery.deliveryPerson.rating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Locations */}
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Route Details</h4>
                                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-4">
                                        <div className="flex gap-3">
                                            <div className="mt-1 flex flex-col items-center">
                                                <MapPin size={16} className="text-green-500" />
                                                <div className="w-0.5 h-6 bg-gray-200 my-1"></div>
                                                <MapPin size={16} className="text-red-500" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                                <div className="pb-4">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase">Pickup Location</p>
                                                        {selectedDelivery.pickupLatitude && selectedDelivery.pickupLongitude && (
                                                            <a
                                                                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDelivery.pickupLatitude},${selectedDelivery.pickupLongitude}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5"
                                                            >
                                                                <ExternalLink size={10} />
                                                                Get Directions
                                                            </a>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-900 mt-0.5">{selectedDelivery.pickupLocation}</p>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase">Drop Location</p>
                                                        {selectedDelivery.dropLatitude && selectedDelivery.dropLongitude && (
                                                            <a
                                                                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDelivery.dropLatitude},${selectedDelivery.dropLongitude}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5"
                                                            >
                                                                <ExternalLink size={10} />
                                                                Get Directions
                                                            </a>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-900 mt-0.5">{selectedDelivery.dropLocation}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500 border-t border-gray-200 pt-3">
                                            Total Distance: <span className="font-semibold text-gray-900">{selectedDelivery.distance?.toFixed(1) || 'N/A'} km</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Timeline</h4>
                                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-gray-500 uppercase font-semibold">Created</span>
                                            <span className="text-sm text-gray-900">{new Date(selectedDelivery.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {selectedDelivery.acceptedAt && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-blue-500 uppercase font-semibold">Accepted</span>
                                                <span className="text-sm text-gray-900">{new Date(selectedDelivery.acceptedAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {selectedDelivery.inTransitAt && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-purple-500 uppercase font-semibold">In Transit</span>
                                                <span className="text-sm text-gray-900">{new Date(selectedDelivery.inTransitAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {selectedDelivery.deliveredAt && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-green-500 uppercase font-semibold">Delivered</span>
                                                <span className="text-sm text-gray-900">{new Date(selectedDelivery.deliveredAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Images attached */}
                                {(selectedDelivery.documentImage || (selectedDelivery.objectImages && selectedDelivery.objectImages.length > 0)) && (
                                    <div className="md:col-span-2">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <ImageIcon size={16} className="text-gray-500" />
                                            Attached Images
                                        </h4>
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                            {selectedDelivery.documentImage && (
                                                <div className="relative group rounded-xl overflow-hidden flex-shrink-0 w-24 h-24 border border-gray-200">
                                                    <img src={selectedDelivery.documentImage} alt="Document" className="object-cover w-full h-full" />
                                                </div>
                                            )}
                                            {selectedDelivery.objectImages?.map((img: string, i: number) => (
                                                <div key={i} className="relative group rounded-xl overflow-hidden flex-shrink-0 w-24 h-24 border border-gray-200">
                                                    <img src={img} alt={`Object ${i}`} className="object-cover w-full h-full" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
