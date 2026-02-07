import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

interface CreateCheckoutRequest {
  email: string;
  planId: string;
  billingCycle: "monthly" | "yearly";
}

export const createCheckout = async (req: CreateCheckoutRequest) => {
  try {
    const { email, planId, billingCycle } = req;

    // Initialize Stripe and Supabase inside function
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-11-17.clover",
    });

    const supabaseUrl = process.env.VITE_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found");
    }

    // Get the correct Stripe price ID based on billing cycle
    const stripePriceId =
      billingCycle === "monthly"
        ? plan.stripe_price_id_monthly
        : plan.stripe_price_id_yearly;

    if (!stripePriceId) {
      throw new Error(
        "Stripe price ID not configured for this plan and billing cycle"
      );
    }

    // Create checkout session record in database
    const { data: checkoutSession, error: sessionError } = await supabase
      .from("checkout_sessions")
      .insert({
        email,
        plan_id: planId,
        billing_cycle: billingCycle,
        status: "pending",
      })
      .select()
      .single();

    if (sessionError || !checkoutSession) {
      throw new Error("Failed to create checkout session");
    }

    // Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment for credential key
      success_url: `${process.env.VITE_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/#pricing`,
      metadata: {
        checkout_session_id: checkoutSession.id,
        email,
        plan_id: planId,
        billing_cycle: billingCycle,
      },
    });

    // Update checkout session with Stripe session ID
    await supabase
      .from("checkout_sessions")
      .update({
        stripe_session_id: stripeSession.id,
      })
      .eq("id", checkoutSession.id);

    return {
      sessionId: stripeSession.id,
      url: stripeSession.url,
    };
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};
