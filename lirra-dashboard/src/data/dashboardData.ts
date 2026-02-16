import {
  TrendingDown,
  DollarSign,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
export interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

export interface BestSeller {
  name: string;
  sold: number;
  revenue: string;
}

export interface Notification {
  type: "warning" | "info" | "success";
  message: string;
}

export interface QuickAction {
  label: string;
}
export const stats: Stat[] = [
  {
    label: "Today's Sales",
    value: "$1,245",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Incoming Chats",
    value: "23",
    change: "+5",
    trend: "up",
    icon: MessageSquare,
  },
  {
    label: "Daily Expenses",
    value: "$340",
    change: "-8%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    label: "Orders",
    value: "15",
    change: "+3",
    trend: "up",
    icon: ShoppingBag,
  },
];

export const bestSellers: BestSeller[] = [
  { name: "Chocolate Cake", sold: 45, revenue: "$675" },
  { name: "Croissant", sold: 38, revenue: "$570" },
  { name: "Cappuccino", sold: 62, revenue: "$310" },
];

export const notifications: Notification[] = [
  { type: "warning", message: "3 products are running low on stock" },
  { type: "info", message: "Monthly financial report is ready" },
  { type: "success", message: "WhatsApp AI handled 15 inquiries today" },
];

export const quickActions: QuickAction[] = [
  { label: "Add Transaction" },
  { label: "Create Label" },
  { label: "Enhance Photos" },
  { label: "View Reports" },
];

export const salesChartData = [40, 65, 45, 80, 55, 75, 90];
export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];