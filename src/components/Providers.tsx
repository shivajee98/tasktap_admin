"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/authService";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoginPage && !authService.isAuthenticated()) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router, isLoginPage]);

  if (isChecking && !isLoginPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {isLoginPage ? (
        children
      ) : (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="flex-1 flex flex-col min-w-0">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 p-4 md:p-6 mt-16 overflow-auto">{children}</main>
          </div>
        </div>
      )}
    </QueryClientProvider>
  );
}
