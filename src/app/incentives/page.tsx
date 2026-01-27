"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from "@/lib/apiClient";
import { Plus } from "lucide-react";

export default function Incentives() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [baseAmount, setBaseAmount] = useState("");
  const [targetGigs, setTargetGigs] = useState("");
  const [targetOrders, setTargetOrders] = useState("");

  const { data: incentives, isLoading } = useQuery({
    queryKey: ["incentives"],
    queryFn: async () => {
      const res = await api.get("/incentives");
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post("/incentives", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incentives"] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setTotalAmount("");
    setBaseAmount("");
    setTargetGigs("");
    setTargetOrders("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      date: new Date(date).toISOString(),
      startTime,
      endTime,
      totalAmount: Number(totalAmount),
      baseAmount: Number(baseAmount),
      targetGigs: Number(targetGigs),
      targetOrders: Number(targetOrders),
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gig Incentives</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Create Incentive
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incentives?.map((item: any) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(item.date).toLocaleDateString()} •{" "}
                    {item.startTime} - {item.endTime}
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-bold">
                  ₹{item.totalAmount}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Target Gigs:</span>
                  <span className="font-medium">{item.targetGigs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Orders:</span>
                  <span className="font-medium">{item.targetOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span className="font-medium">₹{item.baseAmount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create Incentive</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Total Amount"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Base Amount"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Target Gigs"
                  value={targetGigs}
                  onChange={(e) => setTargetGigs(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Target Orders"
                  value={targetOrders}
                  onChange={(e) => setTargetOrders(e.target.value)}
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
