"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from "@/lib/apiClient";
import { Plus } from "lucide-react";

export default function Rewards() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [taskerId, setTaskerId] = useState("");

  const { data: rewards, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const res = await api.get("/rewards");
      return res.data.data;
    },
  });

  const { data: taskers } = useQuery({
    queryKey: ["taskers"],
    queryFn: async () => {
      const res = await api.get("/users/taskers");
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post("/rewards", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      amount: Number(amount),
      taskerId,
      earnedAt: new Date().toISOString(),
      isScratched: false,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bazaar Rewards</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Issue Reward
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards?.map((item: any) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-xl">
                ₹
              </div>
              <div>
                <h4 className="font-bold text-lg">₹{item.amount} Reward</h4>
                <p className="text-sm text-gray-500">
                  For {item.tasker?.fullName}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                    item.isScratched
                      ? "bg-gray-100 text-gray-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.isScratched ? "Scratched" : "New"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Issue Reward</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={taskerId}
                onChange={(e) => setTaskerId(e.target.value)}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Tasker</option>
                {taskers?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
