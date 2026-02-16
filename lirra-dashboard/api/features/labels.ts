import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function generateLabel(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    userId,
    storeId,
    templateId,
    labelData,
    format,
  } = req.body;

  if (!userId || !labelData) {
    return res.status(400).json({ error: "userId and labelData are required" });
  }

  try {
    const mockLabel = {
      labelId: crypto.randomUUID(),
      format: format || "pdf",
      downloadUrl: `https://storage.lirra.app/labels/${userId}/${crypto.randomUUID()}.${
        format || "pdf"
      }`,
      previewUrl: `https://storage.lirra.app/labels/${userId}/${crypto.randomUUID()}_preview.png`,
      createdAt: new Date().toISOString(),
      labelData: labelData,
    };
    const { error } = await supabase
      .from("generated_labels")
      .insert({
        label_id: mockLabel.labelId,
        user_id: userId,
        store_id: storeId,
        template_id: templateId,
        label_data: labelData,
        format: mockLabel.format,
        download_url: mockLabel.downloadUrl,
        created_at: mockLabel.createdAt,
      })
      .select()
      .single();

    if (error) {
      console.error("Save label error:", error);
    }

    return res.status(201).json({
      success: true,
      label: mockLabel,
    });
  } catch (err) {
    console.error("Generate label error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTemplates(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data, error } = await supabase
      .from("label_templates")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

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

export async function savePreset(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, presetName, templateId, labelData } = req.body;

  if (!userId || !presetName || !labelData) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from("label_presets")
      .insert({
        preset_id: crypto.randomUUID(),
        user_id: userId,
        preset_name: presetName,
        template_id: templateId,
        label_data: labelData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Save preset error:", error);
      return res.status(500).json({ error: "Failed to save preset" });
    }

    return res.status(201).json({
      success: true,
      preset: data,
    });
  } catch (err) {
    console.error("Save preset error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function listPresets(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const { data, error } = await supabase
      .from("label_presets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("List presets error:", error);
      return res.status(500).json({ error: "Failed to fetch presets" });
    }

    return res.status(200).json({
      success: true,
      presets: data,
    });
  } catch (err) {
    console.error("List presets error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function exportLabel(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { labelId } = req.body;

  if (!labelId) {
    return res.status(400).json({ error: "labelId is required" });
  }

  try {
    const { data: label, error } = await supabase
      .from("generated_labels")
      .select("*")
      .eq("label_id", labelId)
      .single();

    if (error || !label) {
      return res.status(404).json({ error: "Label not found" });
    }

    return res.status(200).json({
      success: true,
      downloadUrl: label.download_url,
      format: label.format,
    });
  } catch (err) {
    console.error("Export label error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}