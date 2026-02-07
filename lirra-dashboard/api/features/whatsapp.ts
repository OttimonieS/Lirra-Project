/**
 * WhatsApp AI Reply API
 * Handles WhatsApp integration, product catalog, AI replies, and chat logs
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// ==================== Connect WhatsApp ====================
// POST /api/features/whatsapp/connect

export async function connectWhatsApp(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, phoneNumber, apiKey, storeId } = req.body;

  if (!userId || !phoneNumber) {
    return res
      .status(400)
      .json({ error: "userId and phoneNumber are required" });
  }

  try {
    // In production, integrate with WhatsApp Business API
    // Services: Twilio, MessageBird, or official WhatsApp Cloud API

    const { data, error } = await supabase
      .from("whatsapp_connections")
      .insert({
        connection_id: crypto.randomUUID(),
        user_id: userId,
        store_id: storeId,
        phone_number: phoneNumber,
        api_key: apiKey,
        status: "active",
        connected_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Connect WhatsApp error:", error);
      return res.status(500).json({ error: "Failed to connect WhatsApp" });
    }

    return res.status(201).json({
      success: true,
      connection: data,
      message: "WhatsApp connected successfully",
    });
  } catch (err) {
    console.error("Connect WhatsApp error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Store Product Catalog ====================
// POST /api/features/whatsapp/catalog

export async function updateCatalog(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, products } = req.body;
  // products: array of { name, price, description, imageUrl, stock, sku }

  if (!userId || !products || !Array.isArray(products)) {
    return res
      .status(400)
      .json({ error: "userId and products array are required" });
  }

  try {
    // Delete existing catalog for this store (or update)
    await supabase
      .from("product_catalog")
      .delete()
      .eq("user_id", userId)
      .eq("store_id", storeId);

    // Insert new products
    const catalogItems = products.map((product) => ({
      product_id: crypto.randomUUID(),
      user_id: userId,
      store_id: storeId,
      name: product.name,
      price: product.price,
      description: product.description,
      image_url: product.imageUrl,
      stock: product.stock || 0,
      sku: product.sku,
      is_active: true,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("product_catalog")
      .insert(catalogItems)
      .select();

    if (error) {
      console.error("Update catalog error:", error);
      return res.status(500).json({ error: "Failed to update catalog" });
    }

    return res.status(201).json({
      success: true,
      products: data,
      count: data.length,
    });
  } catch (err) {
    console.error("Update catalog error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Generate AI Reply ====================
// POST /api/features/whatsapp/generate-reply

export async function generateReply(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, customerMessage, context } = req.body;

  if (!userId || !customerMessage) {
    return res
      .status(400)
      .json({ error: "userId and customerMessage are required" });
  }

  try {
    // Fetch product catalog for context
    const { data: products } = await supabase
      .from("product_catalog")
      .select("*")
      .eq("user_id", userId)
      .eq("store_id", storeId)
      .eq("is_active", true);

    // In production, integrate with AI service (OpenAI, Anthropic, or local LLM)
    // Example prompt:
    // "You are a helpful store assistant. Customer asked: {customerMessage}
    //  Available products: {products}
    //  Generate a friendly, professional reply in Indonesian."

    // Mock AI reply
    const mockReply = generateMockReply(customerMessage, products || []);

    // Log the interaction
    await supabase.from("chat_logs").insert({
      log_id: crypto.randomUUID(),
      user_id: userId,
      store_id: storeId,
      customer_message: customerMessage,
      ai_reply: mockReply,
      context: context,
      created_at: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      reply: mockReply,
    });
  } catch (err) {
    console.error("Generate reply error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function generateMockReply(
  message: string,
  products: Array<{ name: string; price: string }>
): string {
  const lowerMessage = message.toLowerCase();

  // Check for product inquiries
  if (lowerMessage.includes("harga") || lowerMessage.includes("berapa")) {
    if (products.length > 0) {
      const product = products[0];
      return `Halo! Untuk ${product.name}, harganya Rp ${parseInt(
        product.price
      ).toLocaleString()}. Stok masih tersedia. Mau pesan berapa?`;
    }
    return "Halo! Untuk info harga, bisa sebutkan produk yang mau ditanya?";
  }

  // Check for availability
  if (lowerMessage.includes("ada") || lowerMessage.includes("stok")) {
    return "Alhamdulillah stok masih ada kak. Mau pesan berapa?";
  }

  // Check for ordering
  if (lowerMessage.includes("pesan") || lowerMessage.includes("beli")) {
    return "Siap kak! Untuk pemesanan, bisa langsung chat dengan format:\n\nNama produk: \nJumlah: \nAlamat pengiriman: \n\nNanti saya bantu proses ya!";
  }

  // Default greeting
  return "Halo! Selamat datang di toko kami. Ada yang bisa saya bantu?";
}

// ==================== Get Chat Logs ====================
// GET /api/features/whatsapp/logs?userId=xxx&storeId=xxx&limit=50

export async function getChatLogs(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, limit, startDate, endDate } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    let query = supabase
      .from("chat_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    if (limit) {
      query = query.limit(parseInt(limit as string));
    } else {
      query = query.limit(50);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get chat logs error:", error);
      return res.status(500).json({ error: "Failed to fetch chat logs" });
    }

    return res.status(200).json({
      success: true,
      logs: data,
      count: data.length,
    });
  } catch (err) {
    console.error("Get chat logs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Save Reply Template ====================
// POST /api/features/whatsapp/templates

export async function saveTemplate(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, templateName, templateText, category } = req.body;

  if (!userId || !templateName || !templateText) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from("reply_templates")
      .insert({
        template_id: crypto.randomUUID(),
        user_id: userId,
        template_name: templateName,
        template_text: templateText,
        category: category,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Save template error:", error);
      return res.status(500).json({ error: "Failed to save template" });
    }

    return res.status(201).json({
      success: true,
      template: data,
    });
  } catch (err) {
    console.error("Save template error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Get Templates ====================
// GET /api/features/whatsapp/templates?userId=xxx

export async function getTemplates(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const { data, error } = await supabase
      .from("reply_templates")
      .select("*")
      .eq("user_id", userId)
      .order("template_name", { ascending: true });

    if (error) {
      console.error("Get templates error:", error);
      return res.status(500).json({ error: "Failed to fetch templates" });
    }

    return res.status(200).json({
      success: true,
      templates: data,
    });
  } catch (err) {
    console.error("Get templates error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
