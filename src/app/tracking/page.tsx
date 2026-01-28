"use client";

import {
  MapPin,
  Navigation,
  User,
  Phone,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useActiveTasks } from "@/hooks";
import type { Task } from "@/services";
import { TaskListSkeleton } from "@/components/Skeleton";

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status: string): string {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-green-100 text-green-700";
    case "ACCEPTED":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";
    case "ACCEPTED":
      return "On the way";
    case "PENDING":
      return "Pending";
    default:
      return status;
  }
}

export default function Tracking() {
  const { data, isLoading, error, refetch } = useActiveTasks({
    // Fetch all to avoid server 500 on comma-separated status
    // filter is applied client-side below
  });

  // API returns: { status, data: Task[], pagination: { ... } }
  const activeTasks = (data?.data || []).filter(
    (task: Task) =>
      task.status === "IN_PROGRESS" || task.status === "ACCEPTED"
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Set first task as selected when data loads
  if (!selectedTask && activeTasks.length > 0) {
    setSelectedTask(activeTasks[0]);
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Task List */}
      <div className="w-96 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">
            Active Tasks ({activeTasks.length})
          </h2>
          <button
            onClick={() => refetch()}
            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Loading State - Skeleton */}
        {isLoading && <TaskListSkeleton count={5} />}

        {/* Error State */}
        {error && (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-red-500 text-center">Failed to load tasks</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && activeTasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <Navigation size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No active tasks at the moment</p>
            </div>
          </div>
        )}

        {/* Task List */}
        {!isLoading && !error && activeTasks.length > 0 && (
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {activeTasks.map((task: Task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedTask?.id === task.id
                    ? "bg-orange-50 border-orange-200 shadow-sm"
                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-gray-500">
                    {task.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(
                      task.status
                    )}`}
                  >
                    {getStatusLabel(task.status)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {task.title || task.service?.name || "Service Task"}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <User size={12} />
                  {task.tasker?.fullName || task.tasker?.name || "Assigning..."}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin size={12} />
                  {task.address || "Address not set"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map View Placeholder */}
      <div className="flex-1 bg-gray-200 rounded-2xl border border-gray-300 relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-green-100 opacity-50"></div>

        {selectedTask ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center max-w-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <Navigation size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Live Tracking
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Tracking{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedTask.tasker?.fullName ||
                      selectedTask.tasker?.name ||
                      "Tasker"}
                  </span>{" "}
                  for task #{selectedTask.id.slice(0, 8).toUpperCase()}
                </p>
                <div className="flex justify-center gap-4 text-left">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex-1">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="font-bold text-gray-900">
                      {getStatusLabel(selectedTask.status)}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex-1">
                    <p className="text-xs text-gray-500">Scheduled</p>
                    <p className="font-bold text-gray-900">
                      {selectedTask.scheduledTime ||
                        formatTime(selectedTask.scheduledDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Details Overlay */}
            <div className="absolute top-4 right-4 bg-white p-4 rounded-xl shadow-lg w-72 border border-gray-100">
              <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                Customer Details
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold overflow-hidden">
                    {selectedTask.user?.profileImage ||
                      selectedTask.user?.avatar ? (
                      <img
                        src={
                          selectedTask.user.profileImage ||
                          selectedTask.user.avatar
                        }
                        alt={
                          selectedTask.user.fullName || selectedTask.user.name
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (
                        selectedTask.user?.fullName ||
                        selectedTask.user?.name ||
                        "C"
                      ).charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {selectedTask.user?.fullName ||
                        selectedTask.user?.name ||
                        "Customer"}
                    </div>
                    <div className="text-xs text-gray-500">Customer</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <MapPin size={14} className="inline mr-1" />
                  {selectedTask.address || "Address not available"}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 text-sm border border-gray-200 transition-colors">
                    <Phone size={14} /> Call
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 text-sm border border-gray-200 transition-colors">
                    <MessageSquare size={14} /> Chat
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
              <Navigation size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No Task Selected
              </h3>
              <p className="text-gray-500 text-sm">
                Select a task from the list to view tracking
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
