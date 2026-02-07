/**
 * Photo Enhancer API
 * Handles background removal, lighting enhancement, and batch processing
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// ==================== Enhance Photo ====================
// POST /api/features/photos/enhance

export async function enhancePhoto(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    userId,
    imageUrl,
    enhancements, // array: ['remove-background', 'enhance-lighting', 'upscale']
    storeId,
  } = req.body;

  if (!userId || !imageUrl) {
    return res.status(400).json({ error: "userId and imageUrl are required" });
  }

  try {
    // Check user's plan limits
    const { data: userData } = await supabase
      .from("dashboard_users")
      .select("plan_type")
      .eq("user_id", userId)
      .single();

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create photo job
    const jobId = crypto.randomUUID();

    const { error: jobError } = await supabase
      .from("photo_jobs")
      .insert({
        job_id: jobId,
        user_id: userId,
        store_id: storeId,
        original_url: imageUrl,
        status: "processing",
        enhancements: enhancements || ["enhance-lighting"],
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) {
      console.error("Create photo job error:", jobError);
      return res
        .status(500)
        .json({ error: "Failed to create enhancement job" });
    }

    // In production, integrate with image processing service:
    // - Remove.bg for background removal
    // - Cloudinary for general enhancements
    // - Custom ML model for product-specific enhancements

    // Simulate processing delay
    setTimeout(async () => {
      const enhancedUrl = `https://storage.lirra.app/enhanced/${userId}/${jobId}.jpg`;

      await supabase
        .from("photo_jobs")
        .update({
          status: "completed",
          enhanced_url: enhancedUrl,
          completed_at: new Date().toISOString(),
        })
        .eq("job_id", jobId);
    }, 2000);

    return res.status(202).json({
      success: true,
      jobId: jobId,
      status: "processing",
      message: "Photo enhancement started",
    });
  } catch (err) {
    console.error("Enhance photo error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Get Job Status ====================
// GET /api/features/photos/status?jobId=xxx

export async function getJobStatus(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).json({ error: "jobId is required" });
  }

  try {
    const { data: job, error } = await supabase
      .from("photo_jobs")
      .select("*")
      .eq("job_id", jobId)
      .single();

    if (error || !job) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.status(200).json({
      success: true,
      job: {
        jobId: job.job_id,
        status: job.status,
        originalUrl: job.original_url,
        enhancedUrl: job.enhanced_url,
        enhancements: job.enhancements,
        createdAt: job.created_at,
        completedAt: job.completed_at,
      },
    });
  } catch (err) {
    console.error("Get job status error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Batch Process ====================
// POST /api/features/photos/batch

export async function batchProcess(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, images, enhancements, storeId } = req.body;
  // images: array of { url, name }

  if (!userId || !images || !Array.isArray(images)) {
    return res
      .status(400)
      .json({ error: "userId and images array are required" });
  }

  // Check plan limits for batch processing
  const { data: userData } = await supabase
    .from("dashboard_users")
    .select("plan_type")
    .eq("user_id", userId)
    .single();

  if (userData?.plan_type === "starter") {
    return res.status(403).json({
      error: "Batch processing not available in Starter plan",
      upgradeRequired: true,
    });
  }

  try {
    const batchId = crypto.randomUUID();
    const jobIds: string[] = [];

    // Create jobs for each image
    for (const image of images) {
      const jobId = crypto.randomUUID();

      await supabase.from("photo_jobs").insert({
        job_id: jobId,
        user_id: userId,
        store_id: storeId,
        batch_id: batchId,
        original_url: image.url,
        status: "queued",
        enhancements: enhancements || ["enhance-lighting"],
        created_at: new Date().toISOString(),
      });

      jobIds.push(jobId);
    }

    // Create batch record
    await supabase.from("batch_jobs").insert({
      batch_id: batchId,
      user_id: userId,
      total_images: images.length,
      completed_images: 0,
      status: "processing",
      created_at: new Date().toISOString(),
    });

    return res.status(202).json({
      success: true,
      batchId: batchId,
      jobIds: jobIds,
      totalImages: images.length,
      status: "processing",
    });
  } catch (err) {
    console.error("Batch process error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== List Photo Jobs ====================
// GET /api/features/photos/jobs?userId=xxx&storeId=xxx&status=xxx

export async function listPhotoJobs(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, storeId, status, limit } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    let query = supabase
      .from("photo_jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (storeId) {
      query = query.eq("store_id", storeId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error("List photo jobs error:", error);
      return res.status(500).json({ error: "Failed to fetch photo jobs" });
    }

    return res.status(200).json({
      success: true,
      jobs: data,
      count: data.length,
    });
  } catch (err) {
    console.error("List photo jobs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== Remove Background ====================
// POST /api/features/photos/remove-background

export async function removeBackground(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, imageUrl } = req.body;

  if (!userId || !imageUrl) {
    return res.status(400).json({ error: "userId and imageUrl are required" });
  }

  try {
    // In production, integrate with Remove.bg API or similar service
    // Example with Remove.bg:
    // const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    //   method: 'POST',
    //   headers: {
    //     'X-Api-Key': process.env.REMOVEBG_API_KEY,
    //   },
    //   body: formData
    // });

    const jobId = crypto.randomUUID();
    const resultUrl = `https://storage.lirra.app/nobg/${userId}/${jobId}.png`;

    return res.status(200).json({
      success: true,
      jobId: jobId,
      resultUrl: resultUrl,
      message: "Background removed successfully",
    });
  } catch (err) {
    console.error("Remove background error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
