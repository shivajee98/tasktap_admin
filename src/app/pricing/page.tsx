"use client";

import { useState, useEffect } from "react";
import {
  useDeliveryPricingConfig,
  useUpdateDeliveryPricingConfig,
  useDeliveryPricingAnalytics,
  useSimulatePricing,
} from "@/hooks";
import {
  Calculator,
  TrendingUp,
  Sliders,
  DollarSign,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Package,
  Zap,
  Tag,
  ArrowRight,
  Info,
  HelpCircle,
  Truck,
  Layers,
  Coins,
  Percent,
} from "lucide-react";
import {
  DistanceSlab,
  DEFAULT_DISTANCE_SLABS,
} from "@/services/deliveryPricingService";

export default function DeliveryPricingPage() {
  const [activeTab, setActiveTab] = useState<"config" | "analytics">("config");

  // React Query hooks
  const { data: configData, isLoading: isConfigLoading, refetch: refetchConfig } = useDeliveryPricingConfig();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useDeliveryPricingAnalytics();
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateDeliveryPricingConfig();
  const { mutate: runSimulation, data: simData, isPending: isSimulating } = useSimulatePricing();

  // Local config form state
  const [slabs, setSlabs] = useState<DistanceSlab[]>(DEFAULT_DISTANCE_SLABS);
  const [extraDistanceSurcharge, setExtraDistanceSurcharge] = useState(10);
  const [extraDistanceRiderPayout, setExtraDistanceRiderPayout] = useState(7);
  const [launchOfferEnabled, setLaunchOfferEnabled] = useState(true);
  const [launchOfferType, setLaunchOfferType] = useState<"FIRST_DELIVERY_19" | "FIRST_3_DELIVERIES_29" | "CUSTOM">("FIRST_DELIVERY_19");
  const [firstDeliveryPrice, setFirstDeliveryPrice] = useState(19);
  const [firstThreePrice, setFirstThreePrice] = useState(29);
  const [customPromoDiscount, setCustomPromoDiscount] = useState(0);
  const [codFee, setCodFee] = useState(15);
  const [priorityFee, setPriorityFee] = useState(20);
  const [heavyItemFee, setHeavyItemFee] = useState(25);
  const [waitingFreeMinutes, setWaitingFreeMinutes] = useState(10);
  const [waitingFeePerMinute, setWaitingFeePerMinute] = useState(2);
  const [variableCostPerOrder, setVariableCostPerOrder] = useState(2);
  const [minOrderValue, setMinOrderValue] = useState(19);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Simulator state
  const [simDistance, setSimDistance] = useState<number>(3.5);
  const [simIsCod, setSimIsCod] = useState<boolean>(false);
  const [simIsPriority, setSimIsPriority] = useState<boolean>(false);
  const [simIsHeavy, setSimIsHeavy] = useState<boolean>(false);
  const [simWaitingMinutes, setSimWaitingMinutes] = useState<number>(0);

  // Populate form from API
  useEffect(() => {
    if (configData?.data) {
      const cfg = configData.data;
      if (cfg.distanceSlabs && cfg.distanceSlabs.length > 0) {
        setSlabs(cfg.distanceSlabs);
      }
      setExtraDistanceSurcharge(cfg.extraDistanceSurcharge ?? 10);
      setExtraDistanceRiderPayout(cfg.extraDistanceRiderPayout ?? 7);
      setLaunchOfferEnabled(cfg.launchOfferEnabled ?? true);
      setLaunchOfferType(cfg.launchOfferType ?? "FIRST_DELIVERY_19");
      setFirstDeliveryPrice(cfg.firstDeliveryPrice ?? 19);
      setFirstThreePrice(cfg.firstThreePrice ?? 29);
      setCustomPromoDiscount(cfg.customPromoDiscount ?? 0);
      setCodFee(cfg.codFee ?? 15);
      setPriorityFee(cfg.priorityFee ?? 20);
      setHeavyItemFee(cfg.heavyItemFee ?? 25);
      setWaitingFreeMinutes(cfg.waitingFreeMinutes ?? 10);
      setWaitingFeePerMinute(cfg.waitingFeePerMinute ?? 2);
      setVariableCostPerOrder(cfg.variableCostPerOrder ?? 2);
      setMinOrderValue(cfg.minOrderValue ?? 19);
    }
  }, [configData]);

  // Run simulator on change
  useEffect(() => {
    runSimulation({
      distance: simDistance,
      isCod: simIsCod,
      isPriority: simIsPriority,
      isHeavyItem: simIsHeavy,
      waitingMinutes: simWaitingMinutes,
    });
  }, [simDistance, simIsCod, simIsPriority, simIsHeavy, simWaitingMinutes]);

  const handleAddSlab = () => {
    const lastSlab = slabs[slabs.length - 1];
    const newMin = lastSlab ? lastSlab.maxKm : 0;
    const newMax = newMin + 3;
    setSlabs([
      ...slabs,
      { minKm: newMin, maxKm: newMax, customerCharge: (lastSlab?.customerCharge || 29) + 10, riderPayout: (lastSlab?.riderPayout || 20) + 7 },
    ]);
  };

  const handleRemoveSlab = (index: number) => {
    if (slabs.length <= 1) return;
    setSlabs(slabs.filter((_, i) => i !== index));
  };

  const handleSlabChange = (index: number, field: keyof DistanceSlab, val: number) => {
    const updated = [...slabs];
    updated[index] = { ...updated[index], [field]: val };
    setSlabs(updated);
  };

  const handleResetDefaults = () => {
    setSlabs(DEFAULT_DISTANCE_SLABS);
    setExtraDistanceSurcharge(10);
    setExtraDistanceRiderPayout(7);
    setLaunchOfferEnabled(true);
    setLaunchOfferType("FIRST_DELIVERY_19");
    setFirstDeliveryPrice(19);
    setFirstThreePrice(29);
    setCodFee(15);
    setPriorityFee(20);
    setHeavyItemFee(25);
    setWaitingFreeMinutes(10);
    setWaitingFeePerMinute(2);
    setVariableCostPerOrder(2);
    setMinOrderValue(19);
  };

  const handleSaveConfig = () => {
    updateConfig(
      {
        distanceSlabs: slabs,
        extraDistanceSurcharge,
        extraDistanceRiderPayout,
        launchOfferEnabled,
        launchOfferType,
        firstDeliveryPrice,
        firstThreePrice,
        customPromoDiscount,
        codFee,
        priorityFee,
        heavyItemFee,
        waitingFreeMinutes,
        waitingFeePerMinute,
        variableCostPerOrder,
        minOrderValue,
      },
      {
        onSuccess: () => {
          setSaveSuccessMessage("Pricing configuration updated and applied platform-wide!");
          setTimeout(() => setSaveSuccessMessage(null), 4000);
          refetchConfig();
        },
      }
    );
  };

  const analytics = analyticsData?.data;
  const sim = simData?.data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
              Bootstrap Launch Plan
            </span>
            <span className="text-xs text-gray-500">• Pilot Phase (100–200 Orders)</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Delivery Pricing & Unit Economics</h1>
          <p className="text-sm text-gray-500">
            Control dynamic distance slabs, rider payouts, launch discounts, and track real-time contribution per order.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "config" ? "bg-white text-orange-600 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Sliders size={16} />
            Pricing Slabs & Rules
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "analytics" ? "bg-white text-orange-600 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TrendingUp size={16} />
            Unit Economics Analytics
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <span className="text-sm font-medium">{saveSuccessMessage}</span>
          </div>
          <button onClick={() => setSaveSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {activeTab === "config" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Pricing Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Distance Slabs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Truck className="text-orange-500" size={20} />
                    Base Distance Pricing Slabs
                  </h2>
                  <p className="text-xs text-gray-500">
                    Core pricing formula: Customer Charge – Rider Payout – Variable Cost (₹{variableCostPerOrder}) = TaskTap Contribution
                  </p>
                </div>
                <button
                  onClick={handleAddSlab}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Plus size={14} /> Add Slab
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 px-2">Distance Range</th>
                      <th className="pb-3 px-2">Customer Charge</th>
                      <th className="pb-3 px-2">Target Rider Payout</th>
                      <th className="pb-3 px-2">TaskTap Net Margin</th>
                      <th className="pb-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {slabs.map((slab, index) => {
                      const netContribution = slab.customerCharge - slab.riderPayout - variableCostPerOrder;
                      return (
                        <tr key={index} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3 px-2 font-medium">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                step={0.5}
                                value={slab.minKm}
                                onChange={(e) => handleSlabChange(index, "minKm", parseFloat(e.target.value) || 0)}
                                className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-800"
                              />
                              <span className="text-gray-400 font-normal">to</span>
                              <input
                                type="number"
                                min={slab.minKm}
                                step={0.5}
                                value={slab.maxKm}
                                onChange={(e) => handleSlabChange(index, "maxKm", parseFloat(e.target.value) || 0)}
                                className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-800"
                              />
                              <span className="text-xs text-gray-400">km</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-1">₹</span>
                              <input
                                type="number"
                                min={0}
                                value={slab.customerCharge}
                                onChange={(e) => handleSlabChange(index, "customerCharge", parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm font-bold text-gray-900"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-1">₹</span>
                              <input
                                type="number"
                                min={0}
                                value={slab.riderPayout}
                                onChange={(e) => handleSlabChange(index, "riderPayout", parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm font-bold text-blue-700"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                netContribution >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {netContribution >= 0 ? `+₹${netContribution.toFixed(0)}` : `-₹${Math.abs(netContribution).toFixed(0)}`} / order
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            {slabs.length > 1 && (
                              <button
                                onClick={() => handleRemoveSlab(index)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Extra km surcharge */}
              <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 p-3 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
                <span className="font-semibold text-gray-700">
                  Beyond {slabs[slabs.length - 1]?.maxKm || 10} km Surcharge:
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Customer Surcharge:</span>
                    <span className="font-bold text-gray-800">₹</span>
                    <input
                      type="number"
                      value={extraDistanceSurcharge}
                      onChange={(e) => setExtraDistanceSurcharge(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-md font-bold text-gray-900"
                    />
                    <span className="text-gray-400">/ km</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Rider Payout Surcharge:</span>
                    <span className="font-bold text-gray-800">₹</span>
                    <input
                      type="number"
                      value={extraDistanceRiderPayout}
                      onChange={(e) => setExtraDistanceRiderPayout(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-md font-bold text-blue-700"
                    />
                    <span className="text-gray-400">/ km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Launch Offer Configuration */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="text-orange-500" size={20} />
                    Launch Promotional Offers (Acquisition Engine)
                  </h2>
                  <p className="text-xs text-gray-500">
                    Apply dynamic customer discounts automatically for initial pilot user acquisition.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={launchOfferEnabled}
                    onChange={(e) => setLaunchOfferEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  <span className="ml-2 text-xs font-semibold text-gray-700">
                    {launchOfferEnabled ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </div>

              {launchOfferEnabled && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Option 1: First Delivery ₹19 */}
                    <div
                      onClick={() => setLaunchOfferType("FIRST_DELIVERY_19")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        launchOfferType === "FIRST_DELIVERY_19"
                          ? "border-orange-500 bg-orange-50/40 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                          P0 Launch
                        </span>
                        <input
                          type="radio"
                          name="launchType"
                          checked={launchOfferType === "FIRST_DELIVERY_19"}
                          onChange={() => setLaunchOfferType("FIRST_DELIVERY_19")}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">First Delivery @ ₹{firstDeliveryPrice}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        First completed order for any new customer is capped at ₹{firstDeliveryPrice}.
                      </p>
                      <div className="mt-3 flex items-center gap-1">
                        <span className="text-xs text-gray-600">Price: ₹</span>
                        <input
                          type="number"
                          value={firstDeliveryPrice}
                          onChange={(e) => setFirstDeliveryPrice(parseFloat(e.target.value) || 19)}
                          className="w-16 px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-bold"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Option 2: First 3 Deliveries ₹29 */}
                    <div
                      onClick={() => setLaunchOfferType("FIRST_3_DELIVERIES_29")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        launchOfferType === "FIRST_3_DELIVERIES_29"
                          ? "border-orange-500 bg-orange-50/40 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          Retention
                        </span>
                        <input
                          type="radio"
                          name="launchType"
                          checked={launchOfferType === "FIRST_3_DELIVERIES_29"}
                          onChange={() => setLaunchOfferType("FIRST_3_DELIVERIES_29")}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">First 3 Deliveries @ ₹{firstThreePrice}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        New customers get flat ₹{firstThreePrice} on their first 3 orders.
                      </p>
                      <div className="mt-3 flex items-center gap-1">
                        <span className="text-xs text-gray-600">Price: ₹</span>
                        <input
                          type="number"
                          value={firstThreePrice}
                          onChange={(e) => setFirstThreePrice(parseFloat(e.target.value) || 29)}
                          className="w-16 px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-bold"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Option 3: Custom Promo */}
                    <div
                      onClick={() => setLaunchOfferType("CUSTOM")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        launchOfferType === "CUSTOM"
                          ? "border-orange-500 bg-orange-50/40 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                          Custom
                        </span>
                        <input
                          type="radio"
                          name="launchType"
                          checked={launchOfferType === "CUSTOM"}
                          onChange={() => setLaunchOfferType("CUSTOM")}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">Custom Flat Discount</h3>
                      <p className="text-xs text-gray-500 mt-1">Flat promo discount applied directly at checkout.</p>
                      <div className="mt-3 flex items-center gap-1">
                        <span className="text-xs text-gray-600">Discount: ₹</span>
                        <input
                          type="number"
                          value={customPromoDiscount}
                          onChange={(e) => setCustomPromoDiscount(parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-bold"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Additional Configurable Surcharges */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Coins className="text-orange-500" size={20} />
                Configurable Additional Charges & Surcharges
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* COD Fee */}
                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/70 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Cash on Delivery (COD) Fee</h4>
                    <p className="text-xs text-gray-500">Collected when customer pays with cash at drop</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      value={codFee}
                      onChange={(e) => setCodFee(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900"
                    />
                  </div>
                </div>

                {/* Priority Fee */}
                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/70 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Priority Delivery Fee</h4>
                    <p className="text-xs text-gray-500">Express direct pickup & priority dispatch</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      value={priorityFee}
                      onChange={(e) => setPriorityFee(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900"
                    />
                  </div>
                </div>

                {/* Heavy / Bulky Item */}
                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/70 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Heavy / Bulky Item Surcharge</h4>
                    <p className="text-xs text-gray-500">For packages above 5 kg or bulky dimensions</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      value={heavyItemFee}
                      onChange={(e) => setHeavyItemFee(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900"
                    />
                  </div>
                </div>

                {/* Variable Ops Cost */}
                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/70 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Variable Ops & Payment Cost</h4>
                    <p className="text-xs text-gray-500">Fixed deduction per order for unit economics</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      value={variableCostPerOrder}
                      onChange={(e) => setVariableCostPerOrder(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900"
                    />
                  </div>
                </div>

                {/* Waiting Charge */}
                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/70 col-span-1 md:col-span-2 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h4 className="font-bold text-gray-800">Rider Waiting Time Charge</h4>
                    <p className="text-xs text-gray-500">Chargeable when rider waits at pickup/drop location</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Free Minutes:</span>
                      <input
                        type="number"
                        value={waitingFreeMinutes}
                        onChange={(e) => setWaitingFreeMinutes(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-xs font-bold"
                      />
                      <span className="text-gray-400">mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">After Free:</span>
                      <span className="font-bold text-gray-500">₹</span>
                      <input
                        type="number"
                        value={waitingFeePerMinute}
                        onChange={(e) => setWaitingFeePerMinute(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-900"
                      />
                      <span className="text-gray-400">/ min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
              >
                <RotateCcw size={16} /> Reset to Plan Defaults
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
              >
                <Save size={16} />
                {isUpdating ? "Saving Changes..." : "Save & Apply Pricing"}
              </button>
            </div>
          </div>

          {/* Right Sidebar: Real-Time Pricing Simulator (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-linear-to-b from-gray-900 to-gray-950 text-white rounded-2xl p-6 shadow-xl sticky top-6">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Calculator size={16} /> Live Delivery Simulator
              </div>
              <h3 className="text-xl font-extrabold text-white">Interactive Rate Calculator</h3>
              <p className="text-xs text-gray-400 mt-1">
                Simulate customer billing and rider economics under current settings.
              </p>

              <div className="space-y-4 mt-6">
                {/* Distance Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-300">Distance:</span>
                    <span className="text-orange-400 text-sm font-bold">{simDistance.toFixed(1)} km</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={simDistance}
                    onChange={(e) => setSimDistance(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                    <span>0.5 km</span>
                    <span>5 km</span>
                    <span>10 km</span>
                    <span>20 km</span>
                  </div>
                </div>

                {/* Surcharges Toggles */}
                <div className="pt-2 space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2.5 bg-gray-800/80 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors">
                    <span className="flex items-center gap-2">
                      <Coins size={14} className="text-amber-400" /> Cash on Delivery (COD)
                    </span>
                    <input
                      type="checkbox"
                      checked={simIsCod}
                      onChange={(e) => setSimIsCod(e.target.checked)}
                      className="accent-orange-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-gray-800/80 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors">
                    <span className="flex items-center gap-2">
                      <Zap size={14} className="text-yellow-400" /> Priority Express Delivery
                    </span>
                    <input
                      type="checkbox"
                      checked={simIsPriority}
                      onChange={(e) => setSimIsPriority(e.target.checked)}
                      className="accent-orange-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-gray-800/80 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors">
                    <span className="flex items-center gap-2">
                      <Package size={14} className="text-purple-400" /> Heavy / Bulky Package
                    </span>
                    <input
                      type="checkbox"
                      checked={simIsHeavy}
                      onChange={(e) => setSimIsHeavy(e.target.checked)}
                      className="accent-orange-500 rounded"
                    />
                  </label>
                </div>

                {/* Simulation Breakdown Result */}
                {sim && (
                  <div className="mt-6 pt-4 border-t border-gray-800 space-y-3">
                    <div className="bg-gray-800/90 p-3.5 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Distance Slab:</span>
                        <span className="font-semibold text-gray-200">{sim.distanceSlab}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Base Delivery Fee:</span>
                        <span className="font-semibold text-gray-200">₹{sim.baseCustomerCharge}</span>
                      </div>
                      {sim.promoDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Launch Promo Applied:</span>
                          <span className="font-bold">-₹{sim.promoDiscount}</span>
                        </div>
                      )}
                      {sim.codFee > 0 && (
                        <div className="flex justify-between text-gray-400">
                          <span>COD Fee:</span>
                          <span className="font-semibold text-gray-200">+₹{sim.codFee}</span>
                        </div>
                      )}
                      {sim.priorityFee > 0 && (
                        <div className="flex justify-between text-gray-400">
                          <span>Priority Fee:</span>
                          <span className="font-semibold text-gray-200">+₹{sim.priorityFee}</span>
                        </div>
                      )}
                      {sim.heavyItemFee > 0 && (
                        <div className="flex justify-between text-gray-400">
                          <span>Heavy Item Fee:</span>
                          <span className="font-semibold text-gray-200">+₹{sim.heavyItemFee}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 pt-2 flex justify-between text-sm font-extrabold text-white">
                        <span>Customer Total:</span>
                        <span className="text-orange-400 text-base">₹{sim.totalCustomerCharge}</span>
                      </div>
                    </div>

                    {/* Rider and TaskTap Split */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-950/40 border border-blue-800/40 p-3 rounded-xl">
                        <span className="text-blue-300 text-[10px] uppercase font-bold tracking-wider">Rider Payout</span>
                        <div className="text-lg font-black text-blue-200 mt-0.5">₹{sim.riderPayout}</div>
                      </div>
                      <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-xl">
                        <span className="text-emerald-300 text-[10px] uppercase font-bold tracking-wider">TaskTap Margin</span>
                        <div className={`text-lg font-black mt-0.5 ${sim.netContribution >= 0 ? "text-emerald-300" : "text-rose-400"}`}>
                          {sim.netContribution >= 0 ? `+₹${sim.netContribution}` : `-₹${Math.abs(sim.netContribution)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Analytics Tab */
        <div className="space-y-6">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Delivered Orders</span>
              <div className="text-2xl font-black text-gray-900 mt-1">
                {analytics?.overview?.completedOrders || 0}
                <span className="text-xs font-normal text-gray-400 ml-1.5">/ {analytics?.overview?.totalOrders || 0} total</span>
              </div>
              <div className="mt-2 text-xs text-emerald-600 font-medium">
                Cancellation Rate: {analytics?.overview?.cancellationRate || 0}%
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Customer Charge</span>
              <div className="text-2xl font-black text-gray-900 mt-1">
                ₹{analytics?.unitEconomics?.avgDeliveryCharge || 0}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Avg Distance: {analytics?.unitEconomics?.avgDistance || 0} km
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Rider Payout</span>
              <div className="text-2xl font-black text-blue-700 mt-1">
                ₹{analytics?.unitEconomics?.avgRiderPayout || 0}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Fair driver remuneration
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Net Contribution / Order</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                +₹{analytics?.unitEconomics?.avgContributionPerOrder || 0}
              </div>
              <div className="mt-2 text-xs text-emerald-700 font-medium">
                Total Net: ₹{analytics?.unitEconomics?.totalNetContribution?.toLocaleString("en-IN") || 0}
              </div>
            </div>
          </div>

          {/* Slab Performance Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Layers size={18} className="text-orange-500" />
              Distance Slab Performance (Bootstrap Pilot Phase)
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Identify your best-performing distance segments and monitor unit economics health.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="pb-3 px-3">Distance Slab</th>
                    <th className="pb-3 px-3">Orders Completed</th>
                    <th className="pb-3 px-3">Gross Revenue</th>
                    <th className="pb-3 px-3">Rider Cost</th>
                    <th className="pb-3 px-3">Net Contribution</th>
                    <th className="pb-3 px-3 text-right">Avg Margin / Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {analytics?.slabPerformance?.map((slab, i) => {
                    const avgMargin = slab.orders > 0 ? (slab.netContribution / slab.orders).toFixed(1) : "0.0";
                    return (
                      <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-gray-900">{slab.label}</td>
                        <td className="py-3.5 px-3 text-gray-700">{slab.orders} orders</td>
                        <td className="py-3.5 px-3 font-semibold text-gray-800">₹{slab.revenue.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-3 text-blue-700 font-semibold">₹{slab.riderPayout.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-600">₹{slab.netContribution.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700">
                            +₹{avgMargin}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Retention & Customer Acquisition Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Percent size={18} className="text-orange-500" /> Customer Retention & Repeat Rate
              </h4>
              <p className="text-xs text-gray-500 mb-4">Percentage of unique customers with multiple bookings</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">
                  {analytics?.overview?.repeatCustomerPercentage || 0}%
                </span>
                <span className="text-xs text-gray-500">
                  ({analytics?.overview?.repeatCustomers || 0} repeat of {analytics?.overview?.totalUniqueCustomers || 0} users)
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Tag size={18} className="text-orange-500" /> Promotional Discount Investment
              </h4>
              <p className="text-xs text-gray-500 mb-4">Total launch subsidy granted for customer acquisition</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-orange-600">
                  ₹{analytics?.unitEconomics?.totalCustomerAcquisitionCost?.toLocaleString("en-IN") || 0}
                </span>
                <span className="text-xs text-gray-500">in launch discounts</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
