import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function createStore(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeName, address, phoneNumber, storeType, description } =
    req.body;

  if (!userId || !storeName) {
    return res.status(400).json({ error: "userId and storeName are required" });
  }

  try {
    const { data: userData } = await supabase
      .from("dashboard_users")
      .select("plan_type")
      .eq("user_id", userId)
      .single();

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    const { data: existingStores } = await supabase
      .from("stores")
      .select("store_id")
      .eq("user_id", userId);

    const storeCount = existingStores?.length || 0;
    const limits = {
      starter: 1,
      professional: 3,
      enterprise: Infinity,
    };

    const limit = limits[userData.plan_type as keyof typeof limits] || 1;

    if (storeCount >= limit) {
      return res.status(403).json({
        error: "Store limit reached",
        message: `Your ${userData.plan_type} plan allows up to ${limit} store(s)`,
        upgradeRequired: true,
      });
    }
    const { data, error } = await supabase
      .from("stores")
      .insert({
        store_id: crypto.randomUUID(),
        user_id: userId,
        store_name: storeName,
        address: address,
        phone_number: phoneNumber,
        store_type: storeType,
        description: description,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Create store error:", error);
      return res.status(500).json({ error: "Failed to create store" });
    }

    return res.status(201).json({
      success: true,
      store: data,
    });
  } catch (err) {
    console.error("Create store error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function listStores(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("List stores error:", error);
      return res.status(500).json({ error: "Failed to fetch stores" });
    }

    return res.status(200).json({
      success: true,
      stores: data,
      count: data.length,
    });
  } catch (err) {
    console.error("List stores error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateStore(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    storeId,
    userId,
    storeName,
    address,
    phoneNumber,
    description,
    isActive,
  } = req.body;

  if (!storeId || !userId) {
    return res.status(400).json({ error: "storeId and userId are required" });
  }

  try {
    const { data: store } = await supabase
      .from("stores")
      .select("user_id")
      .eq("store_id", storeId)
      .single();

    if (!store || store.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (storeName !== undefined) updateData.store_name = storeName;
    if (address !== undefined) updateData.address = address;
    if (phoneNumber !== undefined) updateData.phone_number = phoneNumber;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.is_active = isActive;

    const { data, error } = await supabase
      .from("stores")
      .update(updateData)
      .eq("store_id", storeId)
      .select()
      .single();

    if (error) {
      console.error("Update store error:", error);
      return res.status(500).json({ error: "Failed to update store" });
    }

    return res.status(200).json({
      success: true,
      store: data,
    });
  } catch (err) {
    console.error("Update store error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteStore(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { storeId, userId } = req.body;

  if (!storeId || !userId) {
    return res.status(400).json({ error: "storeId and userId are required" });
  }

  try {
    const { data: store } = await supabase
      .from("stores")
      .select("user_id")
      .eq("store_id", storeId)
      .single();

    if (!store || store.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { error } = await supabase
      .from("stores")
      .update({ is_active: false, deleted_at: new Date().toISOString() })
      .eq("store_id", storeId);

    if (error) {
      console.error("Delete store error:", error);
      return res.status(500).json({ error: "Failed to delete store" });
    }

    return res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (err) {
    console.error("Delete store error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function assignRole(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { storeId, userId, targetUserEmail, role } = req.body;

  if (!storeId || !userId || !targetUserEmail || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data: userData } = await supabase
      .from("dashboard_users")
      .select("plan_type")
      .eq("user_id", userId)
      .single();

    if (userData?.plan_type !== "enterprise") {
      return res.status(403).json({
        error: "Team roles are only available in Enterprise plan",
        upgradeRequired: true,
      });
    }
    const { data: store } = await supabase
      .from("stores")
      .select("user_id")
      .eq("store_id", storeId)
      .single();

    if (!store || store.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { data, error } = await supabase
      .from("store_roles")
      .upsert(
        {
          store_id: storeId,
          user_email: targetUserEmail,
          role: role,
          assigned_by: userId,
          assigned_at: new Date().toISOString(),
        },
        {
          onConflict: "store_id,user_email",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Assign role error:", error);
      return res.status(500).json({ error: "Failed to assign role" });
    }

    return res.status(201).json({
      success: true,
      roleAssignment: data,
    });
  } catch (err) {
    console.error("Assign role error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function listStoreRoles(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { storeId, userId } = req.query;

  if (!storeId || !userId) {
    return res.status(400).json({ error: "storeId and userId are required" });
  }

  try {
    const { data: store } = await supabase
      .from("stores")
      .select("user_id")
      .eq("store_id", storeId)
      .single();

    if (!store || store.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { data, error } = await supabase
      .from("store_roles")
      .select("*")
      .eq("store_id", storeId)
      .order("assigned_at", { ascending: false });

    if (error) {
      console.error("List store roles error:", error);
      return res.status(500).json({ error: "Failed to fetch roles" });
    }

    return res.status(200).json({
      success: true,
      roles: data,
    });
  } catch (err) {
    console.error("List store roles error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getStoreStats(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { storeId, userId } = req.query;

  if (!storeId || !userId) {
    return res.status(400).json({ error: "storeId and userId are required" });
  }

  try {
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("store_id", storeId);

    const income =
      transactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

    const expenses =
      transactions
        ?.filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
    const { data: products } = await supabase
      .from("product_catalog")
      .select("product_id")
      .eq("store_id", storeId)
      .eq("is_active", true);
    const { data: photoJobs } = await supabase
      .from("photo_jobs")
      .select("job_id")
      .eq("store_id", storeId);

    return res.status(200).json({
      success: true,
      stats: {
        totalIncome: income,
        totalExpenses: expenses,
        profit: income - expenses,
        transactionCount: transactions?.length || 0,
        productCount: products?.length || 0,
        photosProcessed: photoJobs?.length || 0,
      },
    });
  } catch (err) {
    console.error("Get store stats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}