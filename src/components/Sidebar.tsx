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
} from "lucide-react";
import { tokenStorage } from "@/lib/apiClient";

export default function Sidebar() {
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
    { to: "/tracking", icon: MapPin, label: "Live Tracking" },

    { to: "/finance", icon: CreditCard, label: "Finance" },
    { to: "/incentives", icon: Gift, label: "Incentives" },
    { to: "/offers", icon: Tag, label: "Offers" },
    { to: "/rewards", icon: Award, label: "Rewards" },
    { to: "/zones", icon: Map, label: "Work Zones" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200 flex items-center gap-2">
        <img src="/tasktap-logo.png" alt="TaskTap" className="h-10" />
        <span className="text-2xl font-bold text-orange-500">TaskTap</span>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
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
  );
}
