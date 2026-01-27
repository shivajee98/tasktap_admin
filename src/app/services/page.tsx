"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Package,
  IndianRupee,
  X,
  Upload,
  Save,
  AlertCircle,
  Hammer,
  Zap,
  Droplets,
  Sparkles,
  Car,
  Home,
  Paintbrush,
  User,
  Lightbulb,
  Truck,
  Wind,
  Bug,
  Plug,
  Flower2,
  Wrench,
  Construction,
  SprayCan,
} from "lucide-react";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks";
import apiClient from "@/lib/apiClient";
import type { Service, CreateServiceInput } from "@/services";
import { StatsCardSkeleton, ServicesGridSkeleton } from "@/components/Skeleton";

interface ServiceFormData {
  name: string;
  description: string;
  icon: string;
  image: string;
  basePrice: number;
  isActive: boolean;
  sortOrder: number;
  features: string[];
}

const initialFormData: ServiceFormData = {
  name: "",
  description: "",
  icon: "build",
  image: "",
  basePrice: 0,
  isActive: true,
  sortOrder: 0,
  features: [],
};

// Map backend icon names (Material usually) to Lucide icons
const iconMapping: Record<string, React.ElementType> = {
  "build": Construction,
  "flash-on": Zap,
  "plumbing": Droplets,
  "cleaning-services": Sparkles,
  "directions-car": Car,
  "inventory": Package,
  "home": Home,
  "handyman": Hammer,
  "brush": Paintbrush,
  "yard": Flower2,
  "person": User,
  "lightbulb": Lightbulb,
  "local-shipping": Truck,
  "ac-unit": Wind,
  "bug-report": Bug,
  "power": Plug,
  "wrench": Wrench,
  "spray": SprayCan,
};

const serviceIcons = Object.keys(iconMapping);

const DynamicIcon = ({ name, className = "", size = 24 }: { name: string; className?: string; size?: number }) => {
  const IconComponent = iconMapping[name] || Wrench; // Default to Wrench
  return <IconComponent className={className} size={size} />;
};

export default function ServicesManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [newFeature, setNewFeature] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageInputType, setImageInputType] = useState<"url" | "file">("file");
  const [uploading, setUploading] = useState(false);
  const limit = 10;

  const { data, isLoading, error } = useServices({
    page,
    limit,
    // Admin sees all services (includeInactive is true by default in adminService)
  });

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // API returns: { status, data: Service[], pagination: { total, page, limit, totalPages, hasNext, hasPrev } }
  const services = data?.data || [];
  const pagination = data?.pagination;
  const total = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const filteredServices = search
    ? services.filter(
        (s: Service) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.description?.toLowerCase().includes(search.toLowerCase())
      )
    : services;

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      icon: service.icon || "🔧",
      image: service.image || "",
      basePrice: service.basePrice,
      isActive: service.isActive,
      sortOrder: 0,
      features: [],
    });
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const response = await apiClient.post("/upload/image", {
          image: base64String,
          folder: "tasktap/services",
        });
        setFormData((prev) => ({ ...prev, image: response.data.data.url }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData: CreateServiceInput = {
      name: formData.name,
      description: formData.description || undefined,
      icon: formData.icon || undefined,
      image: formData.image || undefined,
      basePrice: formData.basePrice,
    };

    try {
      if (editingService) {
        await updateMutation.mutateAsync({
          id: editingService.id,
          data: {
            ...serviceData,
            isActive: formData.isActive,
          },
        });
      } else {
        await createMutation.mutateAsync(serviceData);
      }
      setShowModal(false);
      setFormData(initialFormData);
      setEditingService(null);
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await updateMutation.mutateAsync({
        id: service.id,
        data: { isActive: !service.isActive },
      });
    } catch (error) {
      console.error("Failed to toggle service:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Service Categories
          </h1>
          <p className="text-gray-500 text-sm">
            Manage service categories that taskers can offer.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-orange-500/30"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Package className="text-orange-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <ToggleRight className="text-green-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.filter((s: Service) => s.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <ToggleLeft className="text-gray-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Inactive Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.filter((s: Service) => !s.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
            <p className="text-red-500">
              Failed to load services: {(error as Error).message}
            </p>
          </div>
        )}

        {/* Loading State - Skeleton */}
        {isLoading && <ServicesGridSkeleton count={6} />}

        {/* Services Grid */}
        {!isLoading && !error && (
          <div className="p-4">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 mb-2">No services found</p>
                <button
                  onClick={handleOpenCreate}
                  className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  Create your first service
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service: Service) => (
                  <div
                    key={service.id}
                    className={`relative bg-gray-50 rounded-xl p-4 border transition-all hover:shadow-md ${
                      service.isActive
                        ? "border-gray-200"
                        : "border-dashed border-gray-300 opacity-60"
                    }`}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          service.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Service Info */}
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-700 border border-gray-200">
                          <DynamicIcon name={service.icon || "build"} size={24} />
                        </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate pr-16">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {service.description || "No description"}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                      <IndianRupee size={14} />
                      <span>Base Price: </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(service.basePrice)}
                      </span>
                    </div>

                    {/* Packages Count */}
                    {service.packages && service.packages.length > 0 && (
                      <div className="text-xs text-gray-500 mb-4">
                        {service.packages.length} package
                        {service.packages.length > 1 ? "s" : ""} available
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          service.isActive
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                        disabled={updateMutation.isPending}
                      >
                        {service.isActive ? (
                          <>
                            <ToggleLeft size={16} />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ToggleRight size={16} />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(service)}
                        className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(service.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} services
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingService ? "Edit Service" : "Create New Service"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {serviceIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, icon }))
                      }
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="flex items-center justify-center w-full h-full">
                        <DynamicIcon name={icon} size={20} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Plumber, Electrician, Cleaner"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the service..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              {/* Base Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (₹) *
                </label>
                <div className="relative">
                  <IndianRupee
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        basePrice: Number(e.target.value),
                      }))
                    }
                    placeholder="0"
                    min="0"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Starting price for this service category
                </p>
              </div>

              {/* Image Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image
                </label>

                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={imageInputType === "file"}
                      onChange={() => setImageInputType("file")}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Upload Image</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={imageInputType === "url"}
                      onChange={() => setImageInputType("url")}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Image URL</span>
                  </label>
                </div>

                {imageInputType === "file" ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                    {formData.image && !formData.image.startsWith("http") ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, image: "" }))
                          }
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        {formData.image && (
                          <div className="relative inline-block mb-2">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="h-32 w-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, image: "" }))
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          {uploading ? (
                            <Loader2
                              className="animate-spin text-orange-500"
                              size={24}
                            />
                          ) : (
                            <Upload className="text-gray-400" size={24} />
                          )}
                          <span className="text-sm text-gray-500">
                            {uploading
                              ? "Uploading..."
                              : "Click to upload image"}
                          </span>
                        </label>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <Upload
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                )}
                {formData.image && imageInputType === "url" && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle (only for editing) */}
              {editingService && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Service Status</p>
                    <p className="text-sm text-gray-500">
                      {formData.isActive
                        ? "Service is visible to taskers"
                        : "Service is hidden from taskers"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }))
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData.isActive ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {editingService ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Service?
              </h3>
              <p className="text-gray-500 mb-6">
                This action cannot be undone. Taskers with this service will
                need to update their profile.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
