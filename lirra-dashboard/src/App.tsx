import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

// Auth Pages
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import TokenRedemption from "./pages/TokenRedemption";
import SetupPassword from "./pages/SetupPassword";

// Layout Components
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import Bookkeeping from "./pages/Bookkeeping";
import LabelGenerator from "./pages/LabelGenerator";
import CatalogEnhancer from "./pages/CatalogEnhancer";
import WhatsAppAI from "./pages/WhatsAppAI";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

// Utils
import { auth } from "./utils/supabase";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Check for existing session
    auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signin"
          element={!user ? <SignIn /> : <Navigate to="/dashboard" />}
        />
        <Route path="/redeem-key" element={<TokenRedemption />} />
        <Route path="/setup-password" element={<SetupPassword />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            user ? (
              <div className="flex h-screen bg-light-gray overflow-hidden">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header user={user} />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/bookkeeping" element={<Bookkeeping />} />
                      <Route
                        path="/label-generator"
                        element={<LabelGenerator />}
                      />
                      <Route
                        path="/catalog-enhancer"
                        element={<CatalogEnhancer />}
                      />
                      <Route path="/whatsapp-ai" element={<WhatsAppAI />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
