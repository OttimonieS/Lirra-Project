export interface Plan {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  price: {
    monthly: number; // USD
    yearly: number; // USD
  };
  billingCycle: "monthly" | "yearly";
  features: string[];
  limits: {
    stores: number | "unlimited";
    photos: number | "unlimited";
    apiCalls: number | "unlimited";
    users: number | "unlimited";
  };
  recommended?: boolean;
}

export const pricingPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Small single owner shops",
    targetAudience: "Food stalls, small sellers, home business",
    price: {
      monthly: 7, // USD (~100k IDR)
      yearly: 70, // USD (2 months free)
    },
    billingCycle: "monthly",
    features: [
      "Auto Bookkeeping (basic)",
      "Photo enhancer (single file processing)",
      "Basic WhatsApp AI reply",
      "One store only",
      "Limited analytics",
      "Email support",
    ],
    limits: {
      stores: 1,
      photos: "unlimited", // single file at a time
      apiCalls: 1000,
      users: 1,
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Growing UMKM with 1-3 staff",
    targetAudience: "Boutiques, cafes, online sellers on Shopify and Tokopedia",
    price: {
      monthly: 20, // USD (~300k IDR)
      yearly: 200, // USD (2 months free)
    },
    billingCycle: "monthly",
    recommended: true,
    features: [
      "Everything in Starter",
      "Unlimited photo enhancement",
      "Multi-store support (up to 3)",
      "Auto packaging label generator",
      "Full analytics dashboard",
      "WhatsApp integration with templates",
      "Priority support",
    ],
    limits: {
      stores: 3,
      photos: "unlimited",
      apiCalls: 10000,
      users: 3,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Medium scale stores or agencies",
    targetAudience: "Agencies, multi-outlet brands, large ecommerce sellers",
    price: {
      monthly: 49, // USD (~750k IDR)
      yearly: 490, // USD (2 months free)
    },
    billingCycle: "monthly",
    features: [
      "Everything in Professional",
      "Team roles & permissions",
      "Custom AI reply training",
      "API access",
      "Large file processing",
      "Dedicated support staff",
      "Custom workflow automations",
      "Unlimited stores",
    ],
    limits: {
      stores: "unlimited",
      photos: "unlimited",
      apiCalls: "unlimited",
      users: "unlimited",
    },
  },
];
