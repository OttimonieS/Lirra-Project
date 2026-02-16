import { Eye, Shield, Zap, Users, FileDown, Code } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: Eye,
    title: "Vision-Based Accessibility Auditing",
    description:
      "Automatically scan and identify accessibility issues using advanced visual analysis.",
  },
  {
    icon: Shield,
    title: "Automated Compliance Checks",
    description:
      "Ensure your applications meet WCAG, ADA, and other accessibility standards.",
  },
  {
    icon: Zap,
    title: "Real-Time Testing Playground",
    description:
      "Test and validate accessibility improvements instantly in a live environment.",
  },
  {
    icon: Users,
    title: "Project Workspace & Collaboration",
    description:
      "Collaborate with your team on accessibility projects with shared workspaces.",
  },
  {
    icon: FileDown,
    title: "Downloadable Analysis Reports",
    description:
      "Generate comprehensive reports with actionable insights and recommendations.",
  },
  {
    icon: Code,
    title: "API Access for Developers",
    description:
      "Integrate accessibility testing directly into your development workflow.",
  },
];