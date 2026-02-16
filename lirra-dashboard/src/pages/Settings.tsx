import { Download, CreditCard } from "lucide-react";
import {
  settingsNavItems,
  businessProfile,
  businessTypes,
  staffMembers,
  marketplaceIntegrations,
} from "../data/settingsData";

const Settings = () => {
  return (
    <div className="p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your business profile and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
<div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {settingsNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`w-full px-6 py-4 text-left font-medium flex items-center transition-colors ${
                      item.isActive
                        ? "bg-primary text-white"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
<div className="lg:col-span-3 space-y-6">
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Business Profile
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    defaultValue={businessProfile.businessName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    {businessTypes.map((type) => (
                      <option
                        key={type.id}
                        selected={type.label === businessProfile.businessType}
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={businessProfile.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue={businessProfile.phone}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={businessProfile.address}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>
              </div>
              <button className="mt-6 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Save Changes
              </button>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Staff & Permissions
                </h3>
                <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  + Add Staff
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Access
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {staffMembers.map((member, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 ${member.roleColor} text-xs font-medium rounded-full`}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.access}
                        </td>
                        <td className="px-6 py-4">
                          {member.canEdit ? (
                            <button className="text-sm text-primary hover:underline">
                              Edit
                            </button>
                          ) : (
                            <button className="text-sm text-gray-500">-</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Marketplace Integrations
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {marketplaceIntegrations.map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{platform.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {platform.name}
                        </p>
                        <p
                          className={`text-xs ${
                            platform.status === "connected"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {platform.status === "connected"
                            ? "✓ Connected"
                            : "Not Connected"}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        platform.status === "connected"
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-primary text-white hover:bg-primary-hover"
                      }`}
                    >
                      {platform.status === "connected" ? "Manage" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Export Data
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Download your business data in various formats
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-all">
                  <Download className="mx-auto mb-2 text-primary" size={24} />
                  <p className="font-medium text-gray-900">
                    Transactions (CSV)
                  </p>
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-all">
                  <Download className="mx-auto mb-2 text-primary" size={24} />
                  <p className="font-medium text-gray-900">Products (CSV)</p>
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-all">
                  <Download className="mx-auto mb-2 text-primary" size={24} />
                  <p className="font-medium text-gray-900">Full Report (PDF)</p>
                </button>
              </div>
            </div>
<div className="bg-gradient-to-br from-primary to-purple-600 p-6 rounded-xl text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Current Plan: Professional
                  </h3>
                  <p className="text-sm opacity-90">
                    $29/month • Renews on Jan 6, 2026
                  </p>
                </div>
                <CreditCard size={32} className="opacity-75" />
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">Plan Benefits:</p>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>✓ Unlimited transactions</li>
                  <li>✓ All automation features</li>
                  <li>✓ Priority support</li>
                  <li>✓ Advanced analytics</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Upgrade Plan
                </button>
                <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-colors">
                  Manage Billing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;