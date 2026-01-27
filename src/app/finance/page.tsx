"use client";

import { ArrowUpRight, ArrowDownLeft, Download, Search } from "lucide-react";
import { useState } from "react";
import { useTransactions, useTransactionStats } from "@/hooks";
import type { Transaction } from "@/services";
import { StatsCardSkeleton, TableRowSkeleton } from "@/components/Skeleton";

function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount?.toLocaleString("en-IN") || 0}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (diffDays === 1) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Finance() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const limit = 10;

  const {
    data: transactionData,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useTransactions({
    page,
    limit,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useTransactionStats();

  // API returns: { status, data: Transaction[], pagination: { total, page, ... } }
  const transactions = transactionData?.data || [];
  const pagination = transactionData?.pagination;
  const total = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;
  const stats = statsData?.data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Finance & Transactions
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor revenue flow and handle payouts.
          </p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-orange-500/30 flex items-center gap-2">
          <Download size={18} />
          Export Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Revenue
            </p>
            {statsLoading ? (
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded" />
            ) : (
              <h3 className="text-3xl font-bold text-gray-900">
                {formatCurrency(stats?.totalRevenue || 0)}
              </h3>
            )}
          </div>
          <div className="p-4 bg-green-50 rounded-2xl text-green-600">
            <ArrowUpRight size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Pending Payouts
            </p>
            {statsLoading ? (
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded" />
            ) : (
              <h3 className="text-3xl font-bold text-gray-900">
                {formatCurrency(stats?.pendingPayouts || 0)}
              </h3>
            )}
          </div>
          <div className="p-4 bg-orange-50 rounded-2xl text-orange-600">
            <ArrowDownLeft size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Completed Transactions
            </p>
            {statsLoading ? (
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded" />
            ) : (
              <h3 className="text-3xl font-bold text-gray-900">
                {stats?.completedTransactions?.toLocaleString("en-IN") || 0}
              </h3>
            )}
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <ArrowUpRight size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">All Types</option>
            <option value="PAYMENT">Payment</option>
            <option value="PAYOUT">Payout</option>
            <option value="REFUND">Refund</option>
            <option value="COMMISSION">Commission</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {/* Error State */}
        {transactionsError && (
          <div className="p-8 text-center">
            <p className="text-red-500">
              Failed to load transactions:{" "}
              {(transactionsError as Error).message}
            </p>
          </div>
        )}

        {/* Loading State */}
        {transactionsLoading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">User/Tasker</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table */}
        {!transactionsLoading && !transactionsError && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">User/Tasker</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn: Transaction) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">
                        {txn.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {txn.user?.fullName || txn.user?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm ${
                            txn.type === "PAYOUT"
                              ? "text-orange-600"
                              : txn.type === "REFUND"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {txn.type === "PAYOUT" || txn.type === "REFUND" ? (
                            <ArrowDownLeft size={16} />
                          ) : (
                            <ArrowUpRight size={16} />
                          )}
                          {txn.type}
                        </span>
                        {txn.method && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {txn.method}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(txn.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₹{txn.amount?.toLocaleString("en-IN") || 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            txn.status === "COMPLETED"
                              ? "bg-green-50 text-green-700"
                              : txn.status === "FAILED"
                              ? "bg-red-50 text-red-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!transactionsLoading && !transactionsError && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} transactions
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
