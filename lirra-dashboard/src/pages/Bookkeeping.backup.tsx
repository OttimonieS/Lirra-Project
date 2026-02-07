import { useState, useEffect } from "react";
import { Plus, Upload, Filter, Download, Calendar, Trash2, Search, TrendingUp, TrendingDown, X, ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { Transaction } from "../types";
import {
  transactions as transactionsAPI,
  customCategories as customCategoriesAPI,
  auth,
} from "../utils/supabase";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "KRW", symbol: "₩", name: "Korean Won" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
];

const incomeCategories = [
  "Sales",
  "Services",
  "Product Sales",
  "Consulting",
  "Freelance",
  "Commission",
  "Investment",
  "Dividend",
  "Interest",
  "Rental Income",
  "Royalties",
  "Refunds",
  "Grants",
  "Donations Received",
  "Other Income",
];

const expenseCategories = [
  "Cost of Goods Sold",
  "Supplies",
  "Inventory",
  "Raw Materials",
  "Utilities",
  "Rent",
  "Lease",
  "Salaries",
  "Wages",
  "Benefits",
  "Payroll Tax",
  "Marketing",
  "Advertising",
  "Social Media",
  "Office Expenses",
  "Equipment",
  "Software Subscriptions",
  "Insurance",
  "Legal Fees",
  "Accounting Fees",
  "Bank Fees",
  "Interest Expense",
  "Taxes",
  "Travel",
  "Meals & Entertainment",
  "Shipping",
  "Packaging",
  "Maintenance",
  "Repairs",
  "Training",
  "Professional Development",
  "Telecommunications",
  "Internet",
  "Depreciation",
  "Other Expenses",
];

const Bookkeeping = () => {
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customCategories, setCustomCategories] = useState<{
    income: string[];
    expense: string[];
  }>({ income: [], expense: [] });
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "income" as "income" | "expense",
    amount: "",
    currency: "USD",
    category: "",
    description: "",
  });

  // Load user and data on mount
  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await auth.getUser();
      if (user) {
        setUserId(user.id);

        // Load transactions
        const { data: transData } = await transactionsAPI.getAll(user.id);
        if (transData) {
          setTransactions(transData as Transaction[]);
        }

        // Load custom categories
        const { data: categoriesData } = await customCategoriesAPI.get(user.id);
        if (categoriesData) {
          setCustomCategories({
            income: categoriesData.income_categories || [],
            expense: categoriesData.expense_categories || [],
          });
        }
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const filteredTransactions = transactions.filter(
    (t) => filterType === "all" || t.type === filterType
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const profit = totalIncome - totalExpense;

  const handleAddCustomCategory = async () => {
    if (newCategoryName.trim() && userId) {
      const updatedCategories = {
        ...customCategories,
        [formData.type]: [
          ...customCategories[formData.type],
          newCategoryName.trim(),
        ],
      };
      setCustomCategories(updatedCategories);
      setFormData({ ...formData, category: newCategoryName.trim() });
      setNewCategoryName("");
      setShowNewCategoryInput(false);

      // Save to database
      await customCategoriesAPI.upsert(userId, updatedCategories);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "CREATE_NEW") {
      setShowNewCategoryInput(true);
      setFormData({ ...formData, category: "" });
    } else {
      setFormData({ ...formData, category: value });
      setShowNewCategoryInput(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const transactionData = {
      date: formData.date,
      type: formData.type,
      currency: formData.currency,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
    };

    const { data } = await transactionsAPI.create(userId, transactionData);
    if (data) {
      setTransactions([data as Transaction, ...transactions]);
    }

    setShowAddModal(false);
    setShowNewCategoryInput(false);
    setNewCategoryName("");
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type: "income",
      amount: "",
      currency: "USD",
      category: "",
      description: "",
    });
  };

  const handleDeleteTransaction = async (id: string) => {
    if (
      confirm("Are you sure you want to delete this transaction?") &&
      userId
    ) {
      const { data } = await transactionsAPI.delete(id, userId);
      if (data) {
        setTransactions(transactions.filter((t) => t.id !== id));
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookkeeping</h1>
          <p className="text-gray-600">
            Track your income and expenses automatically
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
            <p className="text-sm font-medium text-green-700 mb-1">
              Total Income
            </p>
            <p className="text-3xl font-bold text-green-900">
              ${totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
            <p className="text-sm font-medium text-red-700 mb-1">
              Total Expenses
            </p>
            <p className="text-3xl font-bold text-red-900">
              ${totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
            <p className="text-sm font-medium text-blue-700 mb-1">Net Profit</p>
            <p className="text-3xl font-bold text-blue-900">
              ${profit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Transaction
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <Upload size={20} className="mr-2" />
                Upload Receipt
              </button>
            </div>

            <div className="flex gap-3">
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <Calendar size={20} className="mr-2" />
                Date Range
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <Download size={20} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-600" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("income")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === "income"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType("expense")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === "expense"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Expenses
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No transactions yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first transaction
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Transaction
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                        <span
                          className={
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {
                            currencies.find(
                              (c) => c.code === transaction.currency
                            )?.symbol
                          }
                          {transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Transaction Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Add Transaction
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="income"
                        checked={formData.type === "income"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "income" | "expense",
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Income</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="expense"
                        checked={formData.type === "expense"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "income" | "expense",
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Expense</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {currencies.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  {!showNewCategoryInput ? (
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      {formData.type === "income"
                        ? [...incomeCategories, ...customCategories.income].map(
                            (cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            )
                          )
                        : [
                            ...expenseCategories,
                            ...customCategories.expense,
                          ].map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      <option
                        value="CREATE_NEW"
                        className="font-semibold text-primary"
                      >
                        + Create New Category
                      </option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter new category name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomCategory}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryInput(false);
                          setNewCategoryName("");
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                  >
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookkeeping;
