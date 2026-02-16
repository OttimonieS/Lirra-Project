import { useState } from "react";
import type { JSX } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Clock,
  Calendar,
  Download,
  Filter,
  ShoppingCart,
  Percent,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: "dollar" | "cart" | "package" | "users";
}

interface ProductPerformance {
  name: string;
  category: string;
  revenue: number;
  units: number;
  growth: number;
  margin: number;
}

interface CategorySales {
  category: string;
  revenue: number;
  percentage: number;
  color: string;
}

interface CustomerInsight {
  metric: string;
  value: string;
  change: number;
  description: string;
}

const Analytics = () => {
  const [dateRange, setDateRange] = useState("7days");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

 
  const metrics: MetricCard[] = [
    {
      label: "Total Revenue",
      value: "$48,350",
      change: "+18.2%",
      trend: "up",
      icon: "dollar",
    },
    {
      label: "Total Orders",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: "cart",
    },
    {
      label: "Products Sold",
      value: "3,842",
      change: "+23.1%",
      trend: "up",
      icon: "package",
    },
    {
      label: "Active Customers",
      value: "892",
      change: "+8.4%",
      trend: "up",
      icon: "users",
    },
  ];

  const categorySales: CategorySales[] = [
    {
      category: "Baked Goods",
      revenue: 18500,
      percentage: 38,
      color: "#3b82f6",
    },
    { category: "Beverages", revenue: 14200, percentage: 29, color: "#8b5cf6" },
    { category: "Desserts", revenue: 9850, percentage: 21, color: "#ec4899" },
    { category: "Snacks", revenue: 5800, percentage: 12, color: "#f59e0b" },
  ];

 
  const topProducts: ProductPerformance[] = [
    {
      name: "Artisan Croissant",
      category: "Baked Goods",
      revenue: 4850,
      units: 485,
      growth: 24.5,
      margin: 62,
    },
    {
      name: "Signature Latte",
      category: "Beverages",
      revenue: 3920,
      units: 784,
      growth: 18.2,
      margin: 78,
    },
    {
      name: "Chocolate Cake",
      category: "Desserts",
      revenue: 3250,
      units: 217,
      growth: 15.8,
      margin: 58,
    },
    {
      name: "Blueberry Muffin",
      category: "Baked Goods",
      revenue: 2890,
      units: 578,
      growth: 21.3,
      margin: 65,
    },
    {
      name: "Cheesecake Slice",
      category: "Desserts",
      revenue: 2450,
      units: 175,
      growth: 12.1,
      margin: 54,
    },
  ];

 
  const customerInsights: CustomerInsight[] = [
    {
      metric: "Avg Order Value",
      value: "$38.75",
      change: 15.2,
      description: "Per customer transaction",
    },
    {
      metric: "Customer Retention",
      value: "87%",
      change: 5.3,
      description: "Returning customers",
    },
    {
      metric: "New Customers",
      value: "124",
      change: 22.8,
      description: "This period",
    },
    {
      metric: "Satisfaction Score",
      value: "4.8/5",
      change: 3.2,
      description: "Based on reviews",
    },
  ];

 
  const weeklyData = [
    { day: "Mon", sales: 5200, orders: 156, avgOrder: 33 },
    { day: "Tue", sales: 6100, orders: 178, avgOrder: 34 },
    { day: "Wed", sales: 5800, orders: 165, avgOrder: 35 },
    { day: "Thu", sales: 7200, orders: 198, avgOrder: 36 },
    { day: "Fri", sales: 8900, orders: 245, avgOrder: 36 },
    { day: "Sat", sales: 9500, orders: 267, avgOrder: 36 },
    { day: "Sun", sales: 5650, orders: 178, avgOrder: 32 },
  ];

  const maxSales = Math.max(...weeklyData.map((d) => d.sales));

 
  const peakHours = [
    { time: "6-8 AM", orders: 45, revenue: 1580 },
    { time: "9-11 AM", orders: 78, revenue: 2940 },
    { time: "12-2 PM", orders: 124, revenue: 4960 },
    { time: "3-5 PM", orders: 92, revenue: 3680 },
    { time: "6-8 PM", orders: 156, revenue: 6240 },
    { time: "9-11 PM", orders: 34, revenue: 1360 },
  ];

  const handleExport = () => {
    const data = {
      metrics,
      categorySales,
      topProducts,
      customerInsights,
      weeklyData,
      peakHours,
      dateRange,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-report-${dateRange}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case "dollar":
        return DollarSign;
      case "cart":
        return ShoppingCart;
      case "package":
        return Package;
      case "users":
        return Users;
      default:
        return Activity;
    }
  };

  return (
    <div className="p-6 ml-0 md:ml-64 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
<div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Business Analytics
            </h1>
            <p className="text-gray-600">
              Comprehensive insights into your business performance
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              <span className="text-sm font-medium">Filters</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
{showFilters && (
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package size={16} className="inline mr-2" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="baked">Baked Goods</option>
                  <option value="beverages">Beverages</option>
                  <option value="desserts">Desserts</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <RefreshCw size={16} />
                  <span className="text-sm font-medium">Refresh Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = getIcon(metric.icon);
            const TrendIcon =
              metric.trend === "up" ? ArrowUpRight : ArrowDownRight;
            const trendColor =
              metric.trend === "up" ? "text-green-600" : "text-red-600";
            const trendBg = metric.trend === "up" ? "bg-green-50" : "bg-red-50";

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 ${trendBg} rounded-full`}
                  >
                    <TrendIcon className={trendColor} size={16} />
                    <span className={`text-xs font-semibold ${trendColor}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
<div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                <BarChart3 className="inline mr-2" size={20} />
                Weekly Sales Performance
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Orders</span>
                </div>
              </div>
            </div>

            <div className="h-80 flex items-end justify-between gap-2">
              {weeklyData.map((data, index) => {
                const salesHeight = (data.sales / maxSales) * 100;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full flex justify-center items-end gap-1 mb-2"
                      style={{ height: "300px" }}
                    >
<div className="relative group flex flex-col justify-end w-full">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                          style={{ height: `${salesHeight}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${data.sales.toLocaleString()}
                            <br />
                            {data.orders} orders
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium mt-2">
                      {data.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {(
                    weeklyData.reduce((sum, d) => sum + d.sales, 0) / 1000
                  ).toFixed(1)}
                  K
                </p>
                <p className="text-xs text-gray-600 mt-1">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {weeklyData.reduce((sum, d) => sum + d.orders, 0)}
                </p>
                <p className="text-xs text-gray-600 mt-1">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {Math.round(
                    weeklyData.reduce((sum, d) => sum + d.avgOrder, 0) /
                      weeklyData.length
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-1">Avg Order Value</p>
              </div>
            </div>
          </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              <PieChart className="inline mr-2" size={20} />
              Sales by Category
            </h3>

            <div className="mb-6">
<div className="relative w-48 h-48 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {categorySales.reduce((acc, cat, index) => {
                    const prevPercentage = categorySales
                      .slice(0, index)
                      .reduce((sum, c) => sum + c.percentage, 0);
                    const radius = 40;
                    const circumference = 2 * Math.PI * radius;
                    const offset =
                      circumference - (cat.percentage / 100) * circumference;
                    const rotation = (prevPercentage / 100) * 360;

                    acc.push(
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="20"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          transformOrigin: "50% 50%",
                        }}
                      />
                    );
                    return acc;
                  }, [] as JSX.Element[])}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      $
                      {(
                        categorySales.reduce((sum, c) => sum + c.revenue, 0) /
                        1000
                      ).toFixed(1)}
                      K
                    </p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {categorySales.map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {cat.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ${(cat.revenue / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-gray-500">{cat.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
<div className="grid lg:grid-cols-2 gap-6 mb-8">
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              <TrendingUp className="inline mr-2" size={20} />
              Top Performing Products
            </h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-blue-600">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${product.revenue.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        {product.units} sold
                      </span>
                      <div className="flex items-center gap-1">
                        <Percent size={12} className="text-green-600" />
                        <span className="text-xs font-semibold text-green-600">
                          {product.margin}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              <Users className="inline mr-2" size={20} />
              Customer Insights
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {customerInsights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {insight.value}
                    </p>
                    <div
                      className={`flex items-center gap-1 ${
                        insight.change > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {insight.change > 0 ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span className="text-xs font-semibold">
                        {Math.abs(insight.change)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {insight.metric}
                  </p>
                  <p className="text-xs text-gray-500">{insight.description}</p>
                </div>
              ))}
            </div>
<div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">
                  Overall Satisfaction
                </p>
                <p className="text-2xl font-bold text-green-600">4.8/5</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                  style={{ width: "96%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Based on 1,247 customer reviews
              </p>
            </div>
          </div>
        </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            <Clock className="inline mr-2" size={20} />
            Peak Business Hours
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {peakHours.map((hour, index) => {
              const maxOrders = Math.max(...peakHours.map((h) => h.orders));
              const intensity = (hour.orders / maxOrders) * 100;
              const isHighPeak = intensity > 70;
              const isMediumPeak = intensity > 40 && intensity <= 70;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isHighPeak
                      ? "border-green-500 bg-green-50"
                      : isMediumPeak
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      {hour.time}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {hour.orders}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">orders</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isHighPeak
                            ? "bg-green-500"
                            : isMediumPeak
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                        style={{ width: `${intensity}%` }}
                      ></div>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 mt-2">
                      ${hour.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;