import { Check, Shield, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ValueItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const values: ValueItem[] = [
  {
    icon: Check,
    title: "Seamless Integration",
    description:
      "Connect with 100+ tools you already use without complex setup.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption and compliance with SOC 2, GDPR, and HIPAA.",
  },
  {
    icon: Users,
    title: "Collaborative Workflows",
    description:
      "Bring teams together with shared visibility and real-time updates.",
  },
];
