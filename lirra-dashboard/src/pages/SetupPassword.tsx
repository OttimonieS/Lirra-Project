import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { auth } from "../utils/supabase";

const SetupPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const credential_key_id = searchParams.get("credential_key_id") || "";
  const plan_id = searchParams.get("plan_id") || "";
  const subscription_expires_at =
    searchParams.get("subscription_expires_at") || "";
  const billing_cycle = searchParams.get("billing_cycle") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      // Create Supabase auth user with email and password
      const { data, error: signUpError } = await auth.signUp(
        email,
        formData.password
      );

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Failed to create account");
        setLoading(false);
        return;
      }

      // Create profile with auth user ID
      const response = await fetch("/api/auth/link-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential_key_id,
          plan_id,
          subscription_expires_at,
          billing_cycle,
          email,
          auth_user_id: data.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to link profile");
      }

      // Success! Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create password"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Your Password
          </h1>
          <p className="text-white/80">
            Secure your account to access the dashboard
          </p>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle
              className="text-green-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Credential Key Verified!
              </p>
              <p className="text-xs text-green-700 mt-1">Account: {email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  placeholder="Enter password (min. 6 characters)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    setError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
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
              disabled={
                loading || !formData.password || !formData.confirmPassword
              }
              className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account & Continue"}
            </button>
          </form>

          {/* Password Requirements */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Password Requirements:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                At least 6 characters long
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                Both passwords must match
              </li>
            </ul>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-white/60 text-sm mt-6">
          You'll use this password to sign in to the dashboard
        </p>
      </div>
    </div>
  );
};

export default SetupPassword;
