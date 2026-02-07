import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
}

interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  trial_end: string | null;
  plan: {
    name: string;
    price: number;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if user is logged in
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          navigate("/signin");
          return;
        }

        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Load subscription
        const { data: subData, error: subError } = await supabase
          .from("subscriptions")
          .select(
            `
            *,
            plan:plans(name, price)
          `
          )
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (!subError && subData) {
          setSubscription(subData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isOnTrial =
    subscription?.trial_end && new Date(subscription.trial_end) > new Date();
  const trialDaysRemaining = isOnTrial
    ? Math.ceil(
        (new Date(subscription.trial_end!).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="text-dark-gray hover:text-gray-900 font-medium"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || "User"}!
          </h2>
          <p className="text-dark-gray">
            {profile?.company && `${profile.company} • `}
            {profile?.email}
          </p>
        </div>

        {/* Trial Banner */}
        {isOnTrial && (
          <div className="bg-secondary bg-opacity-10 border border-secondary rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-secondary mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Trial Active
                </h3>
                <p className="text-dark-gray">
                  You have {trialDaysRemaining} days remaining in your free
                  trial. Your card will be charged after the trial ends.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subscription Info */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Subscription
            </h3>

            {subscription ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-dark-gray mb-1">Current Plan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscription.plan.name}
                  </p>
                  <p className="text-dark-gray">
                    ${subscription.plan.price}/month
                  </p>
                </div>

                <div>
                  <p className="text-sm text-dark-gray mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      subscription.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {subscription.status.charAt(0).toUpperCase() +
                      subscription.status.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-dark-gray mb-1">
                    Next Billing Date
                  </p>
                  <p className="text-gray-900 font-medium">
                    {new Date(
                      subscription.current_period_end
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <button className="w-full mt-4 bg-primary-light text-primary px-4 py-2 rounded-lg font-medium hover:bg-opacity-80 transition-colors">
                  Manage Subscription
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-dark-gray mb-4">No active subscription</p>
                <button
                  onClick={() => navigate("/#pricing")}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors"
                >
                  Choose a Plan
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/documentation")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-light-gray transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 text-primary mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="font-medium">View Documentation</span>
              </button>

              <button
                onClick={() => navigate("/support")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-light-gray transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 text-primary mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="font-medium">Get Support</span>
              </button>

              <button
                onClick={() => navigate("/community")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-light-gray transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 text-primary mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="font-medium">Join Community</span>
              </button>
            </div>
          </div>
        </div>

        {/* Usage Stats (Placeholder) */}
        <div className="mt-8 bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Usage Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-dark-gray mb-1">Projects</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-sm text-dark-gray mb-1">API Calls</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-sm text-dark-gray mb-1">Team Members</p>
              <p className="text-3xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
