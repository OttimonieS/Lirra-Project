import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const handleStripeWebhook = async (event: Stripe.Event) => {
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const checkoutSessionId = session.metadata?.checkout_session_id;
        const email = session.metadata?.email;
        const planId = session.metadata?.plan_id;
        const billingCycle = session.metadata?.billing_cycle as
          | "monthly"
          | "yearly";

        if (!checkoutSessionId || !email || !planId || !billingCycle) {
          console.error("Missing metadata in checkout session");
          return;
        }

        // Call the database function to create credential key
        const { data: keyData, error: keyError } = await supabase.rpc(
          "create_credential_key",
          {
            p_email: email,
            p_plan_id: planId,
            p_billing_cycle: billingCycle,
            p_stripe_payment_intent_id: session.payment_intent as string,
            p_stripe_customer_id: session.customer as string,
          }
        );

        if (keyError) {
          console.error("Error creating credential key:", keyError);
          throw keyError;
        }

        // Update checkout session with credential key ID and mark as completed
        await supabase
          .from("checkout_sessions")
          .update({
            status: "completed",
            credential_key_id: keyData.credential_key_id,
          })
          .eq("id", checkoutSessionId);

        console.log("✅ Credential key created:", keyData.credential_key);
        console.log("📧 For email:", email);
        console.log("📦 Plan:", keyData.plan_name);
        console.log("💳 Billing cycle:", billingCycle);

        // TODO: Send email with credential key
        // This should be implemented to send the key to the customer
        // await sendCredentialKeyEmail(email, keyData.credential_key, keyData.plan_name);

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const checkoutSessionId = session.metadata?.checkout_session_id;

        if (checkoutSessionId) {
          await supabase
            .from("checkout_sessions")
            .update({ status: "expired" })
            .eq("id", checkoutSessionId);

          console.log("⏰ Checkout session expired:", session.id);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("❌ Payment failed:", paymentIntent.id);

        // TODO: Send notification about failed payment
        // You might want to update checkout session status or send an email
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("✅ Payment succeeded:", paymentIntent.id);
        break;
      }

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("💥 Webhook handler error:", error);
    throw error;
  }
};
