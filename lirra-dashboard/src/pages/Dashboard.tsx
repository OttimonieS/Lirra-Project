import { AlertCircle } from "lucide-react";
import SubscriptionStatus from "../components/SubscriptionStatus";
import {
  stats,
  bestSellers,
  notifications,
  quickActions,
  salesChartData,
  weekDays,
} from "../data/dashboardData";

const Dashboard = () => {
  return (
    <div className="p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Subscription Status */}
        <div className="mb-6">
          <SubscriptionStatus />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </span>
                  <Icon className="text-primary" size={20} />
                </div>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sales Overview
            </h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {salesChartData.map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary-hover"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {weekDays[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Sellers */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Best Sellers
            </h3>
            <div className="space-y-4">
              {bestSellers.map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sold} sold</p>
                  </div>
                  <span className="font-semibold text-primary">
                    {product.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Notifications
          </h3>
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-4 rounded-lg ${
                  notif.type === "warning"
                    ? "bg-yellow-50"
                    : notif.type === "success"
                    ? "bg-green-50"
                    : "bg-blue-50"
                }`}
              >
                <AlertCircle
                  className={
                    notif.type === "warning"
                      ? "text-yellow-600"
                      : notif.type === "success"
                      ? "text-green-600"
                      : "text-blue-600"
                  }
                  size={20}
                />
                <p className="text-sm text-gray-700">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-all"
              >
                <p className="font-medium text-gray-900">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
