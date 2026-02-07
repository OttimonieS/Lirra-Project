import { Building, User, Link, Download, Bell, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Types
export interface SettingsNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}

export interface BusinessProfile {
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  address: string;
}

export interface StaffMember {
  name: string;
  role: string;
  roleColor: string;
  access: string;
  canEdit: boolean;
}

export interface MarketplaceIntegration {
  name: string;
  status: "connected" | "not-connected";
  icon: string;
}

export interface BusinessType {
  id: string;
  label: string;
}

// Data
export const settingsNavItems: SettingsNavItem[] = [
  { id: "business", label: "Business Profile", icon: Building, isActive: true },
  { id: "staff", label: "Staff & Roles", icon: User, isActive: false },
  { id: "integrations", label: "Integrations", icon: Link, isActive: false },
  { id: "export", label: "Data Export", icon: Download, isActive: false },
  { id: "notifications", label: "Notifications", icon: Bell, isActive: false },
  { id: "billing", label: "Billing", icon: CreditCard, isActive: false },
];

export const businessProfile: BusinessProfile = {
  businessName: "Sarah's Bakery",
  businessType: "Food & Beverage",
  email: "sarah@bakery.com",
  phone: "+62 812 3456 7890",
  address: "Jl. Merdeka No. 123, Jakarta",
};

export const businessTypes: BusinessType[] = [
  { id: "food", label: "Food & Beverage" },
  { id: "fashion", label: "Fashion" },
  { id: "services", label: "Services" },
  { id: "other", label: "Other" },
];

export const staffMembers: StaffMember[] = [
  {
    name: "John Doe",
    role: "Owner",
    roleColor: "bg-purple-100 text-purple-800",
    access: "Full Access",
    canEdit: false,
  },
  {
    name: "Jane Smith",
    role: "Manager",
    roleColor: "bg-blue-100 text-blue-800",
    access: "Sales, Analytics",
    canEdit: true,
  },
];

export const marketplaceIntegrations: MarketplaceIntegration[] = [
  { name: "Tokopedia", status: "connected", icon: "🛒" },
  { name: "Shopee", status: "connected", icon: "🛍️" },
  { name: "Instagram", status: "not-connected", icon: "📸" },
  { name: "WhatsApp Business", status: "connected", icon: "💬" },
];
