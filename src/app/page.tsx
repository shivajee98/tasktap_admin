"use client";

import {
  Users,
  Hammer,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useDashboardStats } from "@/hooks";
import { ChartSkeleton, ActivityFeedSkeleton } from "@/components/Skeleton";

function StatCard({ title, value, change, icon: Icon, color, isLoading }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-green-500 text-sm font-semibold flex items-center">
          <TrendingUp size={14} className="mr-1" /> {change}
        </span>
        <span className="text-gray-400 text-xs">vs last month</span>
      </div>
    </div>
  );
}

function RecentActivityItem({ title, desc, time, type }: any) {
  const icons = {
    success: <CheckCircle2 className="text-green-500" size={18} />,
    warning: <AlertCircle className="text-yellow-500" size={18} />,
    info: <Clock className="text-blue-500" size={18} />,
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="mt-1">
        {icons[type as keyof typeof icons] || icons.info}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  );
}

function formatCurrency(amount: number): string {
  const num = Number(amount);
  if (isNaN(num)) return "₹0";
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num}`;
}

function formatNumber(num: number): string {
  const n = Number(num);
  if (isNaN(n)) return "0";
  if (n >= 1000) {
    return n.toLocaleString("en-IN");
  }
  return n.toString();
}

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useDashboardStats();

  const stats = dashboardData?.data
    ? [
        {
          title: "Total Users",
          value: formatNumber(dashboardData.data.totalUsers),
          change: "+12%",
          icon: Users,
          color: "bg-blue-500",
        },
        {
          title: "Total Taskers",
          value: formatNumber(dashboardData.data.totalTaskers),
          change: "+8%",
          icon: Hammer,
          color: "bg-orange-500",
        },
        {
          title: "Total Revenue",
          value: formatCurrency(dashboardData.data.totalRevenue),
          change: "+24%",
          icon: Wallet,
          color: "bg-green-500",
        },
        {
          title: "Pending Taskers",
          value: formatNumber(dashboardData.data.pendingTaskers || 0),
          change: "+5%",
          icon: AlertCircle,
          color: "bg-yellow-500",
        },
      ]
    : [
        {
          title: "Total Users",
          value: "0",
          change: "+0%",
          icon: Users,
          color: "bg-blue-500",
        },
        {
          title: "Total Taskers",
          value: "0",
          change: "+0%",
          icon: Hammer,
          color: "bg-orange-500",
        },
        {
          title: "Total Revenue",
          value: "₹0",
          change: "+0%",
          icon: Wallet,
          color: "bg-green-500",
        },
        {
          title: "Pending Taskers",
          value: "0",
          change: "+0%",
          icon: AlertCircle,
          color: "bg-yellow-500",
        },
      ];

  const recentActivity = dashboardData?.data?.recentActivity || [];
  const monthlyRevenue = dashboardData?.data?.monthlyRevenue || [];

  // Prepare chart data - get last 12 months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const maxRevenue = Math.max(
    ...monthlyRevenue.map((m: any) => m.revenue || 0),
    1
  );
  const chartData = months.map((month, i) => {
    const monthData = monthlyRevenue.find((m: any) => {
      const d = new Date(m.month);
      return d.getMonth() === i;
    });
    const revenue = monthData?.revenue || 0;
    const height =
      maxRevenue > 0 ? Math.max((revenue / maxRevenue) * 100, 5) : 5;
    return { month, revenue, height };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-orange-500/30">
          Download Report
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="font-medium">Failed to load dashboard data</p>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} isLoading={isLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Revenue Analytics</h3>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <>
              <div className="h-64 flex items-end justify-between gap-2 px-2">
                {chartData.map((data, i) => (
                  <div
                    key={i}
                    className="w-full bg-orange-100 rounded-t-lg relative group transition-all duration-300 hover:bg-orange-200"
                    style={{ height: `${data.height}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(data.revenue)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium px-2">
                {chartData.map((data) => (
                  <span key={data.month}>{data.month}</span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
          {isLoading ? (
            <ActivityFeedSkeleton count={5} />
          ) : (
            <div className="flex flex-col">
              {recentActivity.length > 0 ? (
                recentActivity
                  .slice(0, 5)
                  .map((activity: any, i: number) => (
                    <RecentActivityItem
                      key={i}
                      type={
                        activity.type === "task"
                          ? activity.description?.includes("COMPLETED")
                            ? "success"
                            : activity.description?.includes("CANCELLED")
                            ? "warning"
                            : "info"
                          : "info"
                      }
                      title={activity.title || "Activity"}
                      desc={activity.description || ""}
                      time={new Date(activity.time).toLocaleDateString(
                        "en-IN",
                        { day: "2-digit", month: "short" }
                      )}
                    />
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
