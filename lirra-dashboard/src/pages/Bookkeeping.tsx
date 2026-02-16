import { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  Filter,
  Download,
  Calendar,
  Trash2,
  Search,
  TrendingUp,
  TrendingDown,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  PieChart,
} from "lucide-react";
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

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: transData } = await transactionsAPI.getAll(user.id);
        if (transData) {
          setTransactions(transData as Transaction[]);
        }
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

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Type",
      "Category",
      "Amount",
      "Currency",
      "Description",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) =>
        [
          t.date,
          t.type,
          t.category,
          t.amount,
          t.currency,
          `"${t.description}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bookkeeping-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    showSuccessToast("Exported to CSV successfully!");
  };

  const filteredTransactions = transactions
    .filter((t) => filterType === "all" || t.type === filterType)
    .filter((t) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      );
    })
    .filter((t) => {
      if (!dateRange.start && !dateRange.end) return true;
      const transactionDate = new Date(t.date);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;

      if (start && end) {
        return transactionDate >= start && transactionDate <= end;
      } else if (start) {
        return transactionDate >= start;
      } else if (end) {
        return transactionDate <= end;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === "date") {
        const comparison =
          new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === "asc" ? comparison : -comparison;
      } else {
        const comparison = a.amount - b.amount;
        return sortOrder === "asc" ? comparison : -comparison;
      }
    });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  const categoryBreakdown = transactions.reduce((acc, t) => {
    if (t.type === "expense") {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthIncome = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return (
        t.type === "income" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthIncome = transactions
    .filter((t) => {
      const date = new Date(t.date);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        t.type === "income" &&
        date.getMonth() === lastMonth &&
        date.getFullYear() === lastMonthYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeChange =
    lastMonthIncome > 0
      ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
      : 0;

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
    if (userId) {
      const newTransaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        user_id: userId,
      };

      const { data } = await transactionsAPI.create(userId, newTransaction);
      if (data) {
        setTransactions([...transactions, data as Transaction]);
        setShowAddModal(false);
        showSuccessToast("Transaction added successfully!");
        setFormData({
          date: new Date().toISOString().split("T")[0],
          type: "income",
          amount: "",
          currency: "USD",
          category: "",
          description: "",
        });
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (
      confirm("Are you sure you want to delete this transaction?") &&
      userId
    ) {
      const { data } = await transactionsAPI.delete(id, userId);
      if (data) {
        setTransactions(transactions.filter((t) => t.id !== id));
        showSuccessToast("Transaction deleted successfully!");
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookkeeping</h1>
          <p className="text-gray-600">
            Track your income and expenses automatically
          </p>
        </div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-700">Total Income</p>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-green-900">
              ${totalIncome.toLocaleString()}
            </p>
            {incomeChange !== 0 && (
              <p
                className={`text-sm mt-2 ${
                  incomeChange > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {incomeChange > 0 ? "+" : ""}
                {incomeChange.toFixed(1)}% vs last month
              </p>
            )}
          </div>
          <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-red-700">Total Expenses</p>
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-red-900">
              ${totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-700">Net Profit</p>
              <FileText className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-blue-900">
              ${profit.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-700">
                Profit Margin
              </p>
              <PieChart className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {profitMargin.toFixed(1)}%
            </p>
          </div>
        </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Expense Categories
            </h3>
            <div className="space-y-3">
              {topCategories.length > 0 ? (
                topCategories.map(([category, amount]) => {
                  const percentage = (amount / totalExpense) * 100;
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">
                          {category}
                        </span>
                        <span className="text-gray-900">
                          ${amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No expense data yet</p>
              )}
            </div>
          </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {t.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}$
                      {t.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
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
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center opacity-50 cursor-not-allowed">
                <Upload size={20} className="mr-2" />
                Upload Receipt
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Calendar size={20} className="mr-2" />
                Date Range
              </button>
              <button
                onClick={exportToCSV}
                disabled={filteredTransactions.length === 0}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={20} className="mr-2" />
                Export CSV
              </button>
            </div>
          </div>
{showDateFilter && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={() => setDateRange({ start: "", end: "" })}
                className="text-sm text-primary hover:text-primary-hover mt-3 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
<div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search transactions by description, category, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
<div className="flex items-center gap-2">
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
        </div>
<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || dateRange.start || dateRange.end
                  ? "No transactions found"
                  : "No transactions yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || dateRange.start || dateRange.end
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first transaction"}
              </p>
              {!searchQuery && !dateRange.start && !dateRange.end && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Your First Transaction
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      onClick={() => handleSort("date")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {sortField === "date" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th
                      onClick={() => handleSort("amount")}
                      className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center justify-end gap-2">
                        Amount
                        {sortField === "amount" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                          className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded"
                          title="Delete transaction"
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
{showAddModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Add Transaction
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
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
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="income"
                        checked={formData.type === "income"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "income" | "expense",
                            category: "",
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Income</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="expense"
                        checked={formData.type === "expense"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "income" | "expense",
                            category: "",
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Expense</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
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
                      <option value="">Select a category</option>
                      {(formData.type === "income"
                        ? incomeCategories
                        : expenseCategories
                      ).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      {customCategories[formData.type].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} (Custom)
                        </option>
                      ))}
                      <option value="CREATE_NEW">+ Create New Category</option>
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
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
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
{showToast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookkeeping;