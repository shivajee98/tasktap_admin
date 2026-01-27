import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={style} />
);

// Card Skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-7 w-12" />
      </div>
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
  <tr className="border-b border-gray-100">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full max-w-30" />
      </td>
    ))}
  </tr>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5
}) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-6 py-4">
              <Skeleton className="h-3 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// Service Card Skeleton
export const ServiceCardSkeleton: React.FC = () => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
    <div className="flex items-start gap-3 mb-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
    <Skeleton className="h-4 w-24 mb-4" />
    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
      <Skeleton className="flex-1 h-9 rounded-lg" />
      <Skeleton className="w-9 h-9 rounded-lg" />
      <Skeleton className="w-9 h-9 rounded-lg" />
    </div>
  </div>
);

// Services Grid Skeleton
export const ServicesGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {Array.from({ length: count }).map((_, i) => (
      <ServiceCardSkeleton key={i} />
    ))}
  </div>
);

// Task Card Skeleton (for tracking)
export const TaskCardSkeleton: React.FC = () => (
  <div className="p-3 rounded-xl border border-gray-200 bg-gray-50">
    <div className="flex items-start gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <div className="mt-3 flex items-center gap-2">
      <Skeleton className="w-4 h-4 rounded" />
      <Skeleton className="h-3 w-40" />
    </div>
  </div>
);

// Task List Skeleton
export const TaskListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-2 p-2">
    {Array.from({ length: count }).map((_, i) => (
      <TaskCardSkeleton key={i} />
    ))}
  </div>
);

// Chart Skeleton
export const ChartSkeleton: React.FC = () => (
  <div className="h-64 flex items-end justify-between gap-2 p-4">
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-2">
        <Skeleton
          className="w-full rounded-t"
          style={{ height: `${Math.random() * 60 + 40}%` }}
        />
        <Skeleton className="h-3 w-8" />
      </div>
    ))}
  </div>
);

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <StatsCardSkeleton key={i} />
    ))}
  </div>
);

// Activity Feed Skeleton
export const ActivityFeedSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-48 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

// Finance Card Skeleton
export const FinanceCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="w-10 h-10 rounded-xl" />
    </div>
    <Skeleton className="h-8 w-28 mb-2" />
    <Skeleton className="h-3 w-20" />
  </div>
);

// User Row Skeleton
export const UserRowSkeleton: React.FC = () => (
  <tr className="border-b border-gray-100">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-28 mb-1" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
    <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
    <td className="px-6 py-4"><Skeleton className="h-8 w-8 rounded-lg" /></td>
  </tr>
);

// Users Table Skeleton
export const UsersTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
        <tr>
          <th className="px-6 py-4 text-left"><Skeleton className="h-3 w-16" /></th>
          <th className="px-6 py-4 text-left"><Skeleton className="h-3 w-12" /></th>
          <th className="px-6 py-4 text-left"><Skeleton className="h-3 w-12" /></th>
          <th className="px-6 py-4 text-left"><Skeleton className="h-3 w-16" /></th>
          <th className="px-6 py-4 text-right"><Skeleton className="h-3 w-16 ml-auto" /></th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <UserRowSkeleton key={i} />
        ))}
      </tbody>
    </table>
  </div>
);

export default Skeleton;
