"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks";
import { Loader2, Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const forgotPasswordMutation = useForgotPassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        try {
            await forgotPasswordMutation.mutateAsync(email);
            setSuccess(true);
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        }
    };

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
                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-gray-500 mt-1">We'll send you instructions to reset your password</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
                    {success ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
                                <p className="text-gray-500">
                                    We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="block w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-all"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Alert */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@tasktap.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={forgotPasswordMutation.isPending}
                                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {forgotPasswordMutation.isPending ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Sending link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>

                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-all"
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
