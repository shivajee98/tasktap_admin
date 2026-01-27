"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from "@/lib/apiClient";
import { Plus } from "lucide-react";

export default function Offers() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [taskerId, setTaskerId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [amount, setAmount] = useState("");

  const { data: offers, isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await api.get("/offers");
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
    mutationFn: async (data: any) => api.post("/offers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      taskerId,
      date: new Date(date).toISOString(),
      startTime,
      endTime,
      amount: Number(amount),
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasker Offers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Create Offer
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Tasker</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {offers?.map((item: any) => (
                <tr key={item.id}>
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4">{item.tasker?.fullName}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold">₹{item.amount}</td>
                  <td className="p-4">
                    {item.isMissed ? (
                      <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs">
                        Missed
                      </span>
                    ) : (
                      <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create Offer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

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

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Start Time (e.g. 18:00)"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  placeholder="End Time (e.g. 02:00)"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
              </div>

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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
