"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Hammer,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Briefcase,
  Gift,
  Tag,
  Award,
  Map,
  Truck,
  X,
  Wallet,
  Bell,
} from "lucide-react";

import { tokenStorage } from "@/lib/apiClient";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    tokenStorage.clearTokens();
    router.push("/login");
  };

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/users", icon: Users, label: "User Management" },
    { to: "/taskers", icon: Hammer, label: "Tasker Management" },
    { to: "/services", icon: Briefcase, label: "Service Categories" },
    { to: "/tasks", icon: LayoutDashboard, label: "Task Management" },
    { to: "/deliveries", icon: Truck, label: "Delivery Management" },
    { to: "/pool", icon: Wallet, label: "Central Pool" },
    { to: "/tracking", icon: MapPin, label: "Live Tracking" },

    { to: "/finance", icon: CreditCard, label: "Finance" },
    { to: "/incentives", icon: Gift, label: "Incentives" },
    { to: "/offers", icon: Tag, label: "Offers" },
    { to: "/rewards", icon: Award, label: "Rewards" },
    { to: "/zones", icon: Map, label: "Work Zones" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/settings", icon: Settings, label: "Settings" },

  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`
        w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/tasktap-logo.png" alt="TaskTap" className="h-10" />
            <span className="text-2xl font-bold text-orange-500">TaskTap</span>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive =
              pathname === link.to ||
              (link.to !== "/" && pathname?.startsWith(link.to));

            return (
              <Link
                key={link.to}
                href={link.to}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                  ? "bg-orange-50 text-orange-600 font-medium"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 w-full hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
