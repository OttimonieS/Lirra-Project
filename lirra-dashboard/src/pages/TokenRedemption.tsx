import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Key, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { auth } from "../utils/supabase";

const TokenRedemption = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    credentialKey: "",
    email: emailFromUrl,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    auth.getUser().then(({ data }) => {
      if (data.user && emailFromUrl) {
        setFormData((prev) => ({
          ...prev,
          email: data.user.email || emailFromUrl,
        }));
      }
    });
  }, [emailFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get current user
      const { data: userData } = await auth.getUser();

      // Call redeem API
      const response = await fetch("/api/auth/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential_key: formData.credentialKey,
          email: formData.email,
          user_id: userData?.user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to redeem credential key");
        setLoading(false);
        return;
      }

      // Success!
      setSuccess(true);

      // Store plan details and key data in session
      sessionStorage.setItem("lirra_plan", JSON.stringify(data.planDetails));
      sessionStorage.setItem("lirra_keyData", JSON.stringify(data.keyData));

      // Redirect based on password status
      setTimeout(() => {
        if (!data.hasPassword) {
          // First time - redirect to password setup with key data
          const params = new URLSearchParams({
            email: formData.email,
            credential_key_id: data.keyData.credential_key_id,
            plan_id: data.keyData.plan_id,
            subscription_expires_at: data.keyData.expires_at,
            billing_cycle: data.keyData.billing_cycle,
          });
          navigate(`/setup-password?${params.toString()}`);
        } else {
          // Already has password - redirect to dashboard
          navigate("/dashboard");
        }
      }, 2000);
    } catch {
      setError("Failed to connect to server. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Credential Key Redeemed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your subscription has been activated successfully. Redirecting to
            dashboard...
          </p>
          <Loader2 className="animate-spin mx-auto text-primary" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Redeem Your Credential Key
          </h1>
          <p className="text-white/80">
            Enter your key from the payment confirmation
          </p>
        </div>

        {/* Redemption Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must match the email used for purchase
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credential Key
              </label>
              <input
                type="text"
                value={formData.credentialKey}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    credentialKey: e.target.value
                      .toUpperCase()
                      .replace(/\s/g, ""),
                  });
                  setError("");
                }}
                placeholder="LIRRA-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXX"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                disabled={loading}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Copy and paste from your payment success email
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.credentialKey || !formData.email}
              className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Redeeming...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Redeem & Activate
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">Need help?</p>
            <div className="space-y-2 text-center text-sm">
              <p className="text-gray-500"></p>
              <p className="text-gray-500"></p>
              <a
                href="http://localhost:5173"
                className="block text-primary hover:underline font-medium mt-4"
              >
                Don't have a key? Purchase a plan →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenRedemption;
