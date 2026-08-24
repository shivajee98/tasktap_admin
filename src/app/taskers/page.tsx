"use client";

import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { useUsers, useVerifyTasker } from "@/hooks";
import type { Tasker } from "@/services";
import { UsersTableSkeleton } from "@/components/Skeleton";

export default function TaskersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Pending">("All");
  const limit = 10;

  const statusFilter =
    activeTab === "All"
      ? undefined
      : activeTab === "Active"
      ? "ACTIVE"
      : "PENDING_VERIFICATION";

  const { data, isLoading, error } = useUsers({
    page,
    limit,
    role: "TASKER",
    status: statusFilter,
    search: search || undefined,
  });

  const verifyTaskerMutation = useVerifyTasker();

  // API returns: { status, data: Tasker[], pagination: { total, page, ... } }
  const taskers = data?.data || [];
  const pagination = data?.pagination;
  const total = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const handleVerify = async (taskerId: string, approve: boolean) => {
    await verifyTaskerMutation.mutateAsync({
      id: taskerId,
      isVerified: approve,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tasker Management
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor tasker performance and handle verification requests.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            Pending Requests
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-orange-500/30">
            Add New Tasker
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs & Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-6 border-b border-gray-100 pb-1">
            {(["All", "Active", "Pending"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as "All" | "Active" | "Pending");
                  setPage(1);
                }}
                className={`text-sm font-medium pb-3 relative transition-colors ${
                  activeTab === tab
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search taskers by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors">
              <Filter size={18} />
              Category
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-8 text-center">
            <p className="text-red-500">
              Failed to load taskers: {(error as Error).message}
            </p>
          </div>
        )}

        {/* Loading State - Skeleton */}
        {isLoading && <UsersTableSkeleton rows={5} />}

        {/* Table */}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tasker</th>
                  <th className="px-6 py-4">Skills</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Performance</th>
                  <th className="px-6 py-4">Availability</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {taskers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No taskers found
                    </td>
                  </tr>
                ) : (
                  taskers.map((tasker: Tasker) => (
                    <tr
                      key={tasker.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm border border-orange-100 overflow-hidden">
                            {tasker.avatar || tasker.profileImage ? (
                              <img
                                src={tasker.avatar || tasker.profileImage}
                                alt={tasker.fullName || tasker.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (tasker.fullName || tasker.name)
                                ?.charAt(0)
                                ?.toUpperCase() || "?"
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-1">
                              {tasker.fullName || tasker.name}
                              {tasker.adminApprovalStatus === "APPROVED" && (
                                <ShieldCheck
                                  size={14}
                                  className="text-blue-500"
                                />
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined: {formatDate(tasker.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {tasker.category && (
                            <span
                              className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                            >
                              {tasker.category}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            tasker.adminApprovalStatus === "APPROVED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : tasker.adminApprovalStatus === "REJECTED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {tasker.adminApprovalStatus === "APPROVED" ? (
                            <>
                              <CheckCircle2 size={12} className="mr-1" />
                              Verified
                            </>
                          ) : tasker.adminApprovalStatus === "REJECTED" ? (
                            <>
                              <XCircle size={12} className="mr-1" />
                              Rejected
                            </>
                          ) : (
                            <>
                              <Clock size={12} className="mr-1" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            <Star
                              size={14}
                              className="text-yellow-400 fill-yellow-400"
                            />
                            {tasker.rating?.toFixed(1) || "0.0"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tasker.totalTasks || 0} Tasks
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            tasker.isOnline
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {tasker.isOnline
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Eye size={18} />
                          </button>
                          {tasker.adminApprovalStatus !== "APPROVED" ? (
                            <>
                              <button
                                onClick={() => handleVerify(tasker.id, true)}
                                disabled={verifyTaskerMutation.isPending}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button
                                onClick={() => handleVerify(tasker.id, false)}
                                disabled={verifyTaskerMutation.isPending}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          ) : (
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && taskers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 bg-gray-50/30">
            <span>
              Showing {(page - 1) * limit + 1}-
              {Math.min(page * limit, total)} of {total} taskers
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => i + 1
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded ${
                    page === p
                      ? "bg-white text-orange-600 border-orange-200 font-medium"
                      : "border-gray-200 hover:bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50"
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
