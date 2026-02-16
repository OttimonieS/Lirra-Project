import { useEffect, useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";
import { auth, profile } from "../utils/supabase";

interface SubscriptionData {
  planName: string;
  billingCycle: string;
  expiresAt: string;
  credentialKey: string;
  status: string;
}

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const handleToggleKey = () => {
    if (showKey) {
      setShowKey(false);
    } else {
      setShowPasswordModal(true);
      setPassword("");
      setPasswordError("");
    }
  };

  const handleVerifyPassword = async () => {
    setPasswordError("");
    setVerifying(true);

    try {
      const { data: userData } = await auth.getUser();
      if (!userData.user?.email) {
        setPasswordError("User not found");
        setVerifying(false);
        return;
      }
      const { error } = await auth.signIn(userData.user.email, password);

      if (error) {
        setPasswordError("Incorrect password");
        setVerifying(false);
        return;
      }
      setShowKey(true);
      setShowPasswordModal(false);
      setPassword("");
    } catch {
      setPasswordError("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const loadSubscription = async () => {
    try {
      const { data: userData } = await auth.getUser();

      if (!userData.user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await profile.get(userData.user.id);

      if (profileData) {
        setSubscription({
          planName: profileData.plans?.name || "Unknown",
          billingCycle: profileData.credential_keys?.billing_cycle || "monthly",
          expiresAt: profileData.subscription_expires_at,
          credentialKey: profileData.credential_keys?.credential_key || "",
          status: profileData.subscription_status,
        });
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="text-yellow-600 flex-shrink-0 mt-1"
            size={24}
          />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">
              No Active Subscription
            </h3>
            <p className="text-sm text-yellow-800">
              Please redeem your credential key to activate your subscription.
            </p>
            <a
              href="/redeem-key"
              className="inline-block mt-3 text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Redeem Key
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isActive = subscription.status === "active";
  const expiresDate = new Date(subscription.expiresAt);
  const daysUntilExpiry = Math.ceil(
    (expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <div
      className={`rounded-xl shadow-sm border p-6 ${
        isActive ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {isActive ? (
            <CheckCircle
              className="text-green-600 flex-shrink-0 mt-1"
              size={24}
            />
          ) : (
            <AlertCircle
              className="text-red-600 flex-shrink-0 mt-1"
              size={24}
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {subscription.planName} Plan
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {subscription.billingCycle} billing
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="text-gray-400" size={16} />
          <span className="text-gray-600">Expires:</span>
          <span className="font-medium text-gray-900">
            {expiresDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {isExpiringSoon && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
              {daysUntilExpiry} days left
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="text-gray-400" size={16} />
          <span className="text-gray-600">Credential Key:</span>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              {showKey ? subscription.credentialKey : "•".repeat(40)}
            </code>
            <button
              onClick={handleToggleKey}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? (
                <EyeOff className="text-gray-500" size={16} />
              ) : (
                <Eye className="text-gray-500" size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      {isExpiringSoon && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 mb-3">
            Your subscription is expiring soon. Renew now to continue using all
            features.
          </p>
          <a
            href="http://localhost:5173"
            className="inline-block text-sm bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Renew Subscription
          </a>
        </div>
      )}
{showPasswordModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Verify Your Password
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter your password to view the credential key.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerifyPassword()}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
              autoFocus
            />
            {passwordError && (
              <div className="mb-4 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={16} />
                {passwordError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setPasswordError("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={verifying}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPassword}
                disabled={verifying || !password}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;