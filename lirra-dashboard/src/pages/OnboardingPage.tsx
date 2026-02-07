import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

const OnboardingPage = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    helpWith: [] as string[],
    whatsappNumber: "",
    stores: [] as string[],
  });

  const businessTypes = [
    { id: "food", label: "Food & Beverage", icon: "🍔" },
    { id: "fashion", label: "Fashion & Apparel", icon: "👗" },
    { id: "services", label: "Services", icon: "🔧" },
    { id: "other", label: "Other", icon: "📦" },
  ];

  const helpOptions = [
    { id: "finance", label: "Finance & Bookkeeping" },
    { id: "photos", label: "Product Photos" },
    { id: "content", label: "Content & Labels" },
    { id: "chat", label: "Chat Automation" },
  ];

  const storeOptions = [
    { id: "tokopedia", label: "Tokopedia", icon: "🛒" },
    { id: "shopee", label: "Shopee", icon: "🛍️" },
    { id: "instagram", label: "Instagram", icon: "📸" },
    { id: "whatsapp", label: "WhatsApp Business", icon: "💬" },
  ];

  const toggleSelection = (field: "helpWith" | "stores", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {step} of 3
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((step / 3) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Let's set up your business
            </h2>
            <p className="text-gray-600 mb-8">
              Tell us about your business so we can customize your experience
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  placeholder="e.g., Sarah's Bakery"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Business Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {businessTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() =>
                        setFormData({ ...formData, businessType: type.id })
                      }
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.businessType === type.id
                          ? "border-primary bg-primary-light"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="font-medium text-gray-900">
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Help Preferences */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              What do you need help with?
            </h2>
            <p className="text-gray-600 mb-8">
              Select all that apply. We'll prioritize these features for you.
            </p>

            <div className="space-y-3">
              {helpOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleSelection("helpWith", option.id)}
                  className={`w-full p-4 border-2 rounded-lg text-left flex items-center justify-between transition-all ${
                    formData.helpWith.includes(option.id)
                      ? "border-primary bg-primary-light"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                  {formData.helpWith.includes(option.id) && (
                    <Check className="text-primary" size={24} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Integrations */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Connect your stores
            </h2>
            <p className="text-gray-600 mb-8">
              Select the platforms you want to integrate (you can add more
              later)
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Business Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
                  }
                  placeholder="+62 812 3456 7890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Online Stores
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {storeOptions.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => toggleSelection("stores", store.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.stores.includes(store.id)
                          ? "border-primary bg-primary-light"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{store.icon}</div>
                      <div className="font-medium text-gray-900">
                        {store.label}
                      </div>
                      {formData.stores.includes(store.id) && (
                        <Check className="text-primary mt-2" size={20} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="ml-auto bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center"
          >
            {step === 3 ? "Complete Setup" : "Next"}
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
