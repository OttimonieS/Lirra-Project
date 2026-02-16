import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CreateCheckoutSessionRequest {
  planName: string;
  userId: string;
  intentId: string;
}

export const createCheckoutSession = async (
  req: CreateCheckoutSessionRequest
) => {
  try {
    const { planName, userId, intentId } = req;
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("name", planName)
      .single();

    if (planError || !plan || !plan.stripe_price_id) {
      throw new Error("Plan not found or not configured for Stripe");
    }
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("User profile not found");
    }
    const session = await stripe.checkout.sessions.create({
      customer_email: profile.email,
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.VITE_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/pricing?canceled=true`,
      metadata: {
        user_id: userId,
        plan_id: plan.id,
        intent_id: intentId,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: plan.id,
        },
        trial_period_days: 14,
      },
    });
    await supabase
      .from("checkout_intents")
      .update({
        stripe_session_id: session.id,
        status: "created",
      })
      .eq("id", intentId);

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};