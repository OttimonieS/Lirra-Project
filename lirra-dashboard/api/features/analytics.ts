/**
 * Analytics API
 * Provides sales data, top products, busiest hours, and operational costs
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// ==================== Get Sales Data ====================
// GET /api/features/analytics/sales?userId=xxx&storeId=xxx&period=xxx

export async function getSalesData(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, period, startDate, endDate } = req.query;
  // period: 'today', 'week', 'month', 'year', 'custom'

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Calculate date range
    const now = new Date();
    let queryStartDate: Date;

    switch (period) {
      case "today":
        queryStartDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        queryStartDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        queryStartDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        queryStartDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case "custom":
        queryStartDate = startDate
          ? new Date(startDate as string)
          : new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        queryStartDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const queryEndDate =
      period === "custom" && endDate ? new Date(endDate as string) : new Date();

    // Fetch transactions (income only)
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "income")
      .gte("transaction_date", queryStartDate.toISOString())
      .lte("transaction_date", queryEndDate.toISOString());

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get sales data error:", error);
      return res.status(500).json({ error: "Failed to fetch sales data" });
    }

    // Calculate metrics
    const totalSales = data.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, t: any) => sum + parseFloat(t.amount),
      0
    );
    const transactionCount = data.length;
    const averageTransaction =
      transactionCount > 0 ? totalSales / transactionCount : 0;

    // Group by date for chart
    const salesByDate: Record<string, number> = {};
    data.forEach((t) => {
      const date = new Date(t.transaction_date).toISOString().split("T")[0];
      salesByDate[date] = (salesByDate[date] || 0) + parseFloat(t.amount);
    });

    const chartData = Object.entries(salesByDate).map(([date, amount]) => ({
      date,
      amount,
    }));

    return res.status(200).json({
      success: true,
      period: period || "month",
      startDate: queryStartDate.toISOString(),
      endDate: queryEndDate.toISOString(),
      metrics: {
        totalSales,
        transactionCount,
        averageTransaction,
      },
      chartData,
    });
  } catch (err) {
    console.error("Get sales data error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Get Top Products ====================
// GET /api/features/analytics/top-products?userId=xxx&storeId=xxx&limit=10

export async function getTopProducts(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, limit, period } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Calculate date range
    const now = new Date();
    const startDate = new Date(
      now.setMonth(now.getMonth() - (period === "year" ? 12 : 1))
    );

    // Fetch product sales from order_items or product_catalog
    let query = supabase
      .from("order_items")
      .select("product_name, quantity, price, created_at")
      .eq("user_id", userId)
      .gte("created_at", startDate.toISOString());

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get top products error:", error);
      return res.status(500).json({ error: "Failed to fetch top products" });
    }

    // Aggregate by product
    const productStats: Record<string, { quantity: number; revenue: number }> =
      {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((item: any) => {
      const name = item.product_name;
      if (!productStats[name]) {
        productStats[name] = { quantity: 0, revenue: 0 };
      }
      productStats[name].quantity += item.quantity;
      productStats[name].revenue += item.quantity * parseFloat(item.price);
    });

    // Convert to array and sort by quantity
    const topProducts = Object.entries(productStats)
      .map(([name, stats]) => ({
        productName: name,
        quantitySold: stats.quantity,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, parseInt(limit as string) || 10);

    return res.status(200).json({
      success: true,
      topProducts,
    });
  } catch (err) {
    console.error("Get top products error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Get Busiest Hours ====================
// GET /api/features/analytics/busiest-hours?userId=xxx&storeId=xxx

export async function getBusiestHours(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Fetch last 30 days of transactions
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    let query = supabase
      .from("transactions")
      .select("transaction_date, type")
      .eq("user_id", userId)
      .eq("type", "income")
      .gte("transaction_date", startDate.toISOString());

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get busiest hours error:", error);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    // Group by hour
    const hourCounts: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((t: any) => {
      const hour = new Date(t.transaction_date).getHours();
      hourCounts[hour]++;
    });

    // Convert to array
    const hourlyData = Object.entries(hourCounts).map(([hour, count]) => ({
      hour: parseInt(hour),
      hourLabel: `${hour.toString().padStart(2, "0")}:00`,
      transactions: count,
    }));

    // Find peak hours
    const sortedHours = [...hourlyData].sort(
      (a, b) => b.transactions - a.transactions
    );
    const peakHours = sortedHours.slice(0, 3);

    return res.status(200).json({
      success: true,
      hourlyData,
      peakHours,
    });
  } catch (err) {
    console.error("Get busiest hours error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Get Operational Cost Stats ====================
// GET /api/features/analytics/operational-costs?userId=xxx&storeId=xxx&period=month

export async function getOperationalCosts(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, period } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Calculate date range
    const now = new Date();
    const startDate = new Date(
      now.setMonth(now.getMonth() - (period === "year" ? 12 : 1))
    );

    // Fetch expenses
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("transaction_date", startDate.toISOString());

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get operational costs error:", error);
      return res.status(500).json({ error: "Failed to fetch costs" });
    }

    // Calculate total
    const totalCosts = data.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, t: any) => sum + parseFloat(t.amount),
      0
    );

    // Group by category
    const costsByCategory: Record<string, number> = {};
    data.forEach((t) => {
      const category = t.category || "Uncategorized";
      costsByCategory[category] =
        (costsByCategory[category] || 0) + parseFloat(t.amount);
    });

    // Convert to array for chart
    const categoryData = Object.entries(costsByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalCosts) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Group by month
    const monthlyData: Record<string, number> = {};
    data.forEach((t) => {
      const month = new Date(t.transaction_date).toISOString().substring(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + parseFloat(t.amount);
    });

    const monthlyChart = Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount,
    }));

    return res.status(200).json({
      success: true,
      totalCosts,
      categoryBreakdown: categoryData,
      monthlyTrend: monthlyChart,
    });
  } catch (err) {
    console.error("Get operational costs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Get Dashboard Summary ====================
// GET /api/features/analytics/summary?userId=xxx&storeId=xxx

export async function getDashboardSummary(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Get today's data
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get this month's data
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Fetch transactions
    let query = supabase.from("transactions").select("*").eq("user_id", userId);

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get dashboard summary error:", error);
      return res.status(500).json({ error: "Failed to fetch summary" });
    }

    // Calculate metrics
    const todayTransactions = data.filter(
      (t) => new Date(t.transaction_date) >= today
    );
    const monthTransactions = data.filter(
      (t) => new Date(t.transaction_date) >= thisMonth
    );

    const todayIncome = todayTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const monthIncome = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const monthExpenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return res.status(200).json({
      success: true,
      summary: {
        today: {
          income: todayIncome,
          transactionCount: todayTransactions.filter((t) => t.type === "income")
            .length,
        },
        thisMonth: {
          income: monthIncome,
          expenses: monthExpenses,
          profit: monthIncome - monthExpenses,
          transactionCount: monthTransactions.length,
        },
      },
    });
  } catch (err) {
    console.error("Get dashboard summary error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
