import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// API Routes
app.post("/api/create-checkout", async (req, res) => {
  try {
    console.log("Received checkout request:", req.body);

    // Dynamic import to avoid module-level initialization issues
    const { createCheckout } = await import("./api/create-checkout.js");
    const result = await createCheckout(req.body);
    res.json(result);
  } catch (error: any) {
    console.error("Error in create-checkout:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/get-plans", async (req, res) => {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error("Error in get-plans:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/get-credential-key", async (req, res) => {
  try {
    const { session_id } = req.query;
    console.log(`📥 Get credential key request for session: ${session_id}`);

    if (!session_id) {
      console.log("❌ Missing session_id");
      return res.status(400).json({ error: "Missing session_id" });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: session, error: sessionError } = await supabase
      .from("checkout_sessions")
      .select("*, credential_key_id, plan_id, email, billing_cycle")
      .eq("stripe_session_id", session_id)
      .single();

    if (sessionError || !session) {
      console.log("❌ Session not found in database");
      return res.status(404).json({ error: "Session not found" });
    }

    console.log(`📊 Session status: ${session.status}`);

    // If payment not completed yet, check Stripe and auto-generate key
    if (session.status !== "completed") {
      console.log("🔄 Payment not completed in DB, checking Stripe...");

      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-11-17.clover",
      });

      const stripeSession = await stripe.checkout.sessions.retrieve(
        session_id as string
      );

      console.log(`💳 Stripe payment status: ${stripeSession.payment_status}`);

      if (stripeSession.payment_status === "paid") {
        console.log("✅ Payment confirmed! Auto-generating credential key...");

        // Generate credential key automatically
        const { data: keyData, error: keyError } = await supabase.rpc(
          "create_credential_key",
          {
            p_email: session.email,
            p_plan_id: session.plan_id,
            p_billing_cycle: session.billing_cycle,
            p_stripe_payment_intent_id: stripeSession.payment_intent as string,
            p_stripe_customer_id: (stripeSession.customer as string) || null,
          }
        );

        if (keyError) {
          console.error("❌ Error creating key:", keyError);
          return res.status(500).json({ error: keyError.message });
        }

        // Update session status
        await supabase
          .from("checkout_sessions")
          .update({
            credential_key_id: keyData.credential_key_id,
            status: "completed",
          })
          .eq("stripe_session_id", session_id);

        console.log("🎉 Key created:", keyData.credential_key);

        // Return the newly created key
        const { data: newKey } = await supabase
          .from("credential_keys")
          .select("*, plans(name)")
          .eq("id", keyData.credential_key_id)
          .single();

        if (newKey) {
          return res.json({
            credential_key: newKey.credential_key,
            plan_name: newKey.plans.name,
            billing_cycle: newKey.billing_cycle,
            expires_at: newKey.expires_at,
            email: newKey.email,
          });
        }
      } else {
        console.log(
          `⏳ Payment status is '${stripeSession.payment_status}', not 'paid'`
        );
        return res.status(400).json({ error: "Payment not completed" });
      }
    }

    const { data: key, error: keyError } = await supabase
      .from("credential_keys")
      .select("*, plans(name)")
      .eq("id", session.credential_key_id)
      .single();

    if (keyError || !key) {
      return res.status(404).json({ error: "Credential key not found" });
    }

    res.json({
      credential_key: key.credential_key,
      plan_name: key.plans.name,
      billing_cycle: key.billing_cycle,
      expires_at: key.expires_at,
      email: key.email,
    });
  } catch (error: any) {
    console.error("Error in get-credential-key:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/stripe-webhook-v2", async (req, res) => {
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-11-17.clover",
    });

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.log(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const { data, error } = await supabase.rpc("create_credential_key", {
        p_email: session.customer_email,
        p_plan_id: session.metadata.plan_id,
        p_billing_cycle: session.metadata.billing_cycle,
        p_stripe_payment_intent_id: session.payment_intent,
        p_stripe_customer_id: session.customer,
      });

      if (error) {
        console.error("Error creating credential key:", error);
        return res.status(500).json({ error: error.message });
      }

      await supabase
        .from("checkout_sessions")
        .update({
          credential_key_id: data.credential_key_id,
          status: "completed",
        })
        .eq("stripe_session_id", session.id);

      console.log("Credential key created:", data.credential_key);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Error in stripe-webhook:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Landing Page API running on http://localhost:${PORT}`);
  console.log("📍 Available endpoints:");
  console.log("  POST /api/create-checkout");
  console.log("  GET  /api/get-credential-key");
  console.log("  GET  /api/get-plans");
  console.log("  POST /api/stripe-webhook-v2");
});

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
