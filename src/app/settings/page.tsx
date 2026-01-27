"use client";

import { User, Bell, Lock, Shield, CreditCard, LogOut } from "lucide-react";

export default function Settings() {
  const sections = [
    {
      title: "Profile Settings",
      items: [
        {
          icon: User,
          label: "Edit Profile",
          desc: "Update your personal information",
        },
        { icon: Lock, label: "Change Password", desc: "Secure your account" },
      ],
    },
    {
      title: "Platform Settings",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          desc: "Manage email and push notifications",
        },
        {
          icon: Shield,
          label: "Admin Roles",
          desc: "Manage access and permissions",
        },
        {
          icon: CreditCard,
          label: "Payment Gateway",
          desc: "Configure payment methods",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage preferences and platform configuration.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, j) => (
                <button
                  key={j}
                  className="w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    Settings &rarr;
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-colors">
            <LogOut size={20} />
            Logout from Admin
          </button>
        </div>
      </div>
    </div>
  );
}
