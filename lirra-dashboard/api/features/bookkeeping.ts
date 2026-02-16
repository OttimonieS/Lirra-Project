import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function insertTransaction(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    userId,
    storeId,
    type,
    amount,
    category,
    description,
    date,
    receiptUrl,
  } = req.body;

  if (!userId || !type || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        store_id: storeId,
        type: type,
        amount: amount,
        category: category,
        description: description,
        transaction_date: date || new Date().toISOString(),
        receipt_url: receiptUrl,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Transaction insert error:", error);
      return res.status(500).json({ error: "Failed to insert transaction" });
    }

    return res.status(201).json({
      success: true,
      transaction: data,
    });
  } catch (err) {
    console.error("Insert transaction error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function listTransactions(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, startDate, endDate, type } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false });

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (startDate) {
      query = query.gte("transaction_date", startDate);
    }

    if (endDate) {
      query = query.lte("transaction_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("List transactions error:", error);
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }

    return res.status(200).json({
      success: true,
      transactions: data,
      count: data.length,
    });
  } catch (err) {
    console.error("List transactions error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function scanReceipt(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageUrl, userId } = req.body;

  if (!imageUrl || !userId) {
    return res.status(400).json({ error: "imageUrl and userId are required" });
  }

  try {

    const mockExtractedData = {
      merchantName: "Toko Sumber Rejeki",
      date: new Date().toISOString(),
      total: 125000,
      items: [
        { name: "Beras 5kg", quantity: 2, price: 50000 },
        { name: "Minyak Goreng 2L", quantity: 1, price: 25000 },
      ],
      category: "Groceries",
      rawText:
        "TOKO SUMBER REJEKI\nJl. Merdeka No. 123\nBeras 5kg x2 = 100000\nMinyak Goreng 2L = 25000\nTotal: 125000",
    };

    return res.status(200).json({
      success: true,
      extractedData: mockExtractedData,
    });
  } catch (err) {
    console.error("Scan receipt error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function generateReports(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, period } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "daily":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "weekly":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "monthly":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "yearly":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .gte("transaction_date", startDate.toISOString());

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Generate reports error:", error);
      return res.status(500).json({ error: "Failed to generate report" });
    }
    const income = data
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenses = data
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const cashFlow = income - expenses;
    const byCategory = data.reduce((acc: any, t: any) => {
      const cat = t.category || "Uncategorized";
      if (!acc[cat]) {
        acc[cat] = { income: 0, expenses: 0 };
      }
      if (t.type === "income") {
        acc[cat].income += parseFloat(t.amount);
      } else {
        acc[cat].expenses += parseFloat(t.amount);
      }
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    return res.status(200).json({
      success: true,
      report: {
        period: period || "monthly",
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        totalIncome: income,
        totalExpenses: expenses,
        cashFlow: cashFlow,
        transactionCount: data.length,
        byCategory: byCategory,
      },
    });
  } catch (err) {
    console.error("Generate reports error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function calculateCashFlow(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, months } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const monthsBack = parseInt(months as string) || 6;

  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .gte("transaction_date", startDate.toISOString())
      .order("transaction_date", { ascending: true });

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Calculate cashflow error:", error);
      return res.status(500).json({ error: "Failed to calculate cash flow" });
    }
    const monthlyData: Record<
      string,
      { income: number; expenses: number; net: number }
    > = {};
    data.forEach((t: any) => {
      const month = new Date(t.transaction_date).toISOString().substring(0, 7);

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0, net: 0 };
      }

      const amount = parseFloat(t.amount);
      if (t.type === "income") {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expenses += amount;
      }
      monthlyData[month].net =
        monthlyData[month].income - monthlyData[month].expenses;
    });
    const cashFlowData = Object.entries(monthlyData).map(([month, values]) => ({
      month,
      ...values,
    }));

    return res.status(200).json({
      success: true,
      cashFlow: cashFlowData,
    });
  } catch (err) {
    console.error("Calculate cashflow error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}