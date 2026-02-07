import { supabase } from "../lib/supabase";

interface CheckoutParams {
  planName: string;
  priceId?: string;
}

export const createCheckoutSession = async ({ planName }: CheckoutParams) => {
  try {
    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("You must be logged in to subscribe");
    }

    // Get the plan details from the database
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("name", planName)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found");
    }

    // Create a checkout intent record
    const { data: intent, error: intentError } = await supabase
      .from("checkout_intents")
      .insert({
        user_id: user.id,
        plan_id: plan.id,
        status: "pending",
      })
      .select()
      .single();

    if (intentError || !intent) {
      throw new Error("Failed to create checkout session");
    }

    // In a real implementation, you would call your backend API here
    // to create a Stripe Checkout Session and return the session URL
    // For now, we'll return the intent ID which you can use in your backend
    return {
      intentId: intent.id,
      planName: plan.name,
      amount: plan.price,
    };
  } catch (error) {
    console.error("Checkout error:", error);
    throw error;
  }
};
