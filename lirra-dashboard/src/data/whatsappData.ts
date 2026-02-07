import type { WhatsAppMessage } from "../types";

// Types
export interface WorkingHours {
  day: string;
  hours: string;
}

export interface QuickReplyTemplate {
  id: string;
  label: string;
  message: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  phoneNumber: string;
  activeSince: string;
}

// Data
export const initialMessages: WhatsAppMessage[] = [
  {
    id: "1",
    from: "+62 812 3456 7890",
    message: "Do you have chocolate cake available?",
    reply:
      "Yes! Our chocolate cake is available. Price: $15. Would you like to order?",
    timestamp: "2025-12-06 10:30",
    isAuto: true,
  },
  {
    id: "2",
    from: "+62 811 2345 6789",
    message: "What time do you open?",
    reply: "We are open Monday-Saturday, 8 AM - 8 PM. Sunday 9 AM - 5 PM.",
    timestamp: "2025-12-06 11:15",
    isAuto: true,
  },
  {
    id: "3",
    from: "+62 813 4567 8901",
    message: "Can I customize a birthday cake?",
    timestamp: "2025-12-06 12:00",
    isAuto: false,
  },
];

export const workingHours: WorkingHours[] = [
  { day: "Weekdays", hours: "8 AM - 8 PM" },
  { day: "Saturday", hours: "8 AM - 8 PM" },
  { day: "Sunday", hours: "9 AM - 5 PM" },
];

export const quickReplyTemplates: QuickReplyTemplate[] = [
  {
    id: "greeting",
    label: "Greeting",
    message: "Hello! Welcome to our store. How can I help you today?",
  },
  {
    id: "hours",
    label: "Business Hours",
    message: "We are open Monday-Saturday 8 AM - 8 PM, Sunday 9 AM - 5 PM.",
  },
  {
    id: "pricing",
    label: "Pricing Info",
    message: "Please check our catalog for current prices and availability.",
  },
];

export const connectionStatus: ConnectionStatus = {
  isConnected: true,
  phoneNumber: "+62 812 3456 7890",
  activeSince: "Dec 1, 2025",
};

export const autoReplyStats = {
  todayResponses: 15,
  responseRate: "92%",
  avgResponseTime: "< 1 min",
};
