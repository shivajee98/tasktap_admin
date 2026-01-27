"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from "@/lib/apiClient";
import { Plus } from "lucide-react";

export default function Zones() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");

  // Hardcoded Meerut Zone for demo
  const mockCoordinates = [
    { latitude: 28.98, longitude: 77.68 },
    { latitude: 28.96, longitude: 77.72 },
    { latitude: 28.94, longitude: 77.7 },
    { latitude: 28.93, longitude: 77.67 },
    { latitude: 28.95, longitude: 77.65 },
  ];

  const { data: zones, isLoading } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const res = await api.get("/zones");
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post("/zones", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      setIsModalOpen(false);
      setName("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      coordinates: mockCoordinates, // Simulating complex polygon input
      isActive: true,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Work Zones</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Zone
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Zone Name</th>
                <th className="p-4">Coordinates</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {zones?.map((item: any) => (
                <tr key={item.id}>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {item.coordinates?.length} Points Defined
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Create Work Zone</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Zone Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <p className="text-xs text-gray-500">
                * Will use default South Meerut polygon for demo
              </p>

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
