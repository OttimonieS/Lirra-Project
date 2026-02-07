import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const getCredentialKey = async (sessionId: string) => {
  try {
    // Get checkout session from database using Stripe session ID
    const { data: checkoutSession, error: sessionError } = await supabase
      .from("checkout_sessions")
      .select("*, credential_keys(*), plans(*)")
      .eq("stripe_session_id", sessionId)
      .single();

    if (sessionError || !checkoutSession) {
      throw new Error("Checkout session not found");
    }

    if (checkoutSession.status !== "completed") {
      throw new Error("Payment not completed yet");
    }

    // Get the credential key
    const { data: credentialKey, error: keyError } = await supabase
      .from("credential_keys")
      .select("*, plans(*)")
      .eq("id", checkoutSession.credential_key_id)
      .single();

    if (keyError || !credentialKey) {
      throw new Error("Credential key not found");
    }

    return {
      credential_key: credentialKey.credential_key,
      plan_name: credentialKey.plans.name,
      billing_cycle: credentialKey.billing_cycle,
      expires_at: credentialKey.expires_at,
      email: credentialKey.email,
    };
  } catch (error) {
    console.error("Error fetching credential key:", error);
    throw error;
  }
};
