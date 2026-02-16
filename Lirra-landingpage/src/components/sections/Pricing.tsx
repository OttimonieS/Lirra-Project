import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
}

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("price_monthly", { ascending: true });

    if (!error && data) {
      setPlans(data);
    }
  };

  const handleGetStarted = (plan: Plan) => {
    if (plan.name === "Enterprise") {
      window.location.href = "/support";
      return;
    }
    setSelectedPlan(plan);
    setShowEmailModal(true);
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !email) return;

    try {
      setLoading(selectedPlan.name);
      const response = await fetch(
        "http://localhost:3002/api/create-checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            planId: selectedPlan.id,
            billingCycle,
          }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start checkout";
      alert(message);
    } finally {
      setLoading(null);
    }
  };

  const getPrice = (plan: Plan) => {
    return billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly;
  };

  const getSavings = (plan: Plan) => {
    const monthly = plan.price_monthly * 12;
    const yearly = plan.price_yearly;
    return Math.round(((monthly - yearly) / monthly) * 100);
  };

  return (
    <>
      <section id="pricing" className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-dark-gray">
              Choose the plan that's right for you. No credit card required to
              start.
            </p>
          </div>
<div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-1 inline-flex shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-8 py-3 rounded-full font-medium transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-primary text-white"
                    : "text-dark-gray hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-8 py-3 rounded-full font-medium transition-colors relative ${
                  billingCycle === "yearly"
                    ? "bg-primary text-white"
                    : "text-dark-gray hover:text-gray-900"
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow ${
                  index === 1 ? "border-2 border-primary relative" : ""
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-dark-gray mb-6">{plan.description}</p>

                <div className="mb-6">
                  {plan.name === "Enterprise" ? (
                    <span className="text-4xl font-bold text-gray-900">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        ${getPrice(plan)}
                      </span>
                      <span className="text-dark-gray">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                      {billingCycle === "yearly" && (
                        <div className="text-sm text-secondary mt-1">
                          Save {getSavings(plan)}% with yearly billing
                        </div>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-dark-gray">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleGetStarted(plan)}
                  disabled={loading === plan.name}
                  className={`w-full text-center px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    index === 1
                      ? "bg-primary text-white hover:bg-primary-hover"
                      : "bg-primary-light text-primary hover:bg-opacity-80"
                  }`}
                >
                  {loading === plan.name
                    ? "Loading..."
                    : plan.name === "Enterprise"
                    ? "Contact Sales"
                    : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
{showEmailModal && selectedPlan && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Your Purchase
            </h3>
            <p className="text-dark-gray mb-6">
              Enter your email to proceed to checkout. You'll receive your
              credential key immediately after payment.
            </p>

            <div className="mb-6">
              <div className="bg-light-gray rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">
                    {selectedPlan.name} Plan
                  </span>
                  <span className="font-bold text-gray-900">
                    ${getPrice(selectedPlan)}
                  </span>
                </div>
                <div className="text-sm text-dark-gray">
                  Billed {billingCycle}
                  {billingCycle === "yearly" &&
                    ` (Save ${getSavings(selectedPlan)}%)`}
                </div>
              </div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmail("");
                  setSelectedPlan(null);
                }}
                className="flex-1 px-4 py-3 border border-gray rounded-lg font-medium text-dark-gray hover:bg-light-gray transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={!email || loading === selectedPlan.name}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === selectedPlan.name
                  ? "Loading..."
                  : "Continue to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Pricing;
