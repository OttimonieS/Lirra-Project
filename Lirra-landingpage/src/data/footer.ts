export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const footerSections: FooterSection[] = [
  {
    title: "Resources",
    links: [
      { text: "Documentation", href: "/documentation" },
      { text: "Blog", href: "/blog" },
      { text: "Community", href: "/community" },
      { text: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Service", href: "/terms" },
      { text: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export const footerCompanyInfo = {
  name: " NexusLabid",
  description:
    "Empowering teams to work smarter, not harder through intelligent automation and collaboration.",
  copyright: "2025 NexusLabid. All rights reserved.",
};
