import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, Copy, AlertTriangle, Loader } from "lucide-react";

interface CredentialKeyData {
  credential_key: string;
  plan_name: string;
  billing_cycle: string;
  expires_at: string;
  email: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [keyData, setKeyData] = useState<CredentialKeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found");
      setLoading(false);
      return;
    }

    let retryCount = 0;
    const maxRetries = 5;

    const fetchCredentialKey = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/api/get-credential-key?session_id=${sessionId}`
        );
        const data = await response.json();

        if (data.error) {
          if (data.error.includes("not completed") && retryCount < maxRetries) {
            console.log(
              `Waiting for webhook... Retry ${retryCount + 1}/${maxRetries}`
            );
            retryCount++;
            setTimeout(fetchCredentialKey, 2000);
            return;
          }
          setError(data.error);
          setLoading(false);
        } else {
          setKeyData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        if (retryCount < maxRetries) {
          console.log(
            `Network error, retrying... ${retryCount + 1}/${maxRetries}`
          );
          retryCount++;
          setTimeout(fetchCredentialKey, 2000);
        } else {
          setError("Failed to fetch credential key. Please contact support.");
          setLoading(false);
        }
      }
    };

    fetchCredentialKey();
  }, [sessionId]);

  const copyToClipboard = () => {
    if (keyData?.credential_key) {
      navigator.clipboard.writeText(keyData.credential_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-dark-gray">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !keyData) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-dark-gray mb-6">
            {error || "Failed to load credential key"}
          </p>
          <Link
            to="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-dark-gray">
            Thank you for your purchase. Here's your credential key.
          </p>
        </div>

        {/* Credential Key Display */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 mb-8">
          <h2 className="text-white text-lg font-semibold mb-4 text-center">
            Your Credential Key
          </h2>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-center font-mono text-lg text-gray-900 break-all">
              {keyData.credential_key}
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className="w-full bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check size={20} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={20} />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>

        {/* Plan Details */}
        <div className="bg-light-gray rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Plan Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-dark-gray mb-1">Plan</p>
              <p className="font-medium text-gray-900">{keyData.plan_name}</p>
            </div>
            <div>
              <p className="text-sm text-dark-gray mb-1">Billing</p>
              <p className="font-medium text-gray-900 capitalize">
                {keyData.billing_cycle}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-dark-gray mb-1">Email</p>
              <p className="font-medium text-gray-900">{keyData.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-dark-gray mb-1">Valid Until</p>
              <p className="font-medium text-gray-900">
                {new Date(keyData.expires_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="border-t border-gray pt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <div>
                <p className="font-medium text-gray-900">
                  Save your credential key
                </p>
                <p className="text-sm text-dark-gray">
                  Keep it safe - you'll need it to access your dashboard
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <div>
                <p className="font-medium text-gray-900">Create your account</p>
                <p className="text-sm text-dark-gray">
                  Sign up with the same email: {keyData.email}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <div>
                <p className="font-medium text-gray-900">Redeem your key</p>
                <p className="text-sm text-dark-gray">
                  Enter your credential key in the dashboard to activate your
                  plan
                </p>
              </div>
            </li>
          </ol>

          <div className="flex gap-4">
            <Link
              to="/signup"
              className="flex-1 text-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/signin"
              className="flex-1 text-center bg-primary-light text-primary px-6 py-3 rounded-lg font-medium hover:bg-opacity-80 transition-colors"
            >
              Already have an account?
            </Link>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle
              className="text-yellow-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <p className="font-medium text-yellow-900 text-sm">Important</p>
              <p className="text-sm text-yellow-800">
                This credential key will only be shown once on this page. Make
                sure to save it before leaving. A copy has also been sent to
                your email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
