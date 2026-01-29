"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks";
import { Loader2, Lock, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const resetPasswordMutation = useResetPassword();

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Missing reset token");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            await resetPasswordMutation.mutateAsync({ token, password });
            setSuccess(true);
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to reset password. Link may be expired."
            );
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-green-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">Password reset successful</h2>
                    <p className="text-gray-500">
                        Your password has been updated. You can now log in with your new password.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Password Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                </label>
                <div className="relative">
                    <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Confirm Password Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={resetPasswordMutation.isPending || !token}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {resetPasswordMutation.isPending ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Resetting...
                    </>
                ) : (
                    "Reset Password"
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/tasktap-logo.png"
                        alt="TaskTap"
                        className="h-20 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-900">New Password</h1>
                    <p className="text-gray-500 mt-1">Please enter your new password below</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
                    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-500" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
