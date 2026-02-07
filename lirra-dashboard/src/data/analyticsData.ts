// Types
export interface WeeklyData {
  day: string;
  sales: number;
  expenses: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  trend: "up" | "down";
}

export interface PeakHour {
  hour: string;
  inquiries: number;
}

export interface KeyMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

// Data
export const weeklyData: WeeklyData[] = [
  { day: "Mon", sales: 1200, expenses: 400 },
  { day: "Tue", sales: 1500, expenses: 350 },
  { day: "Wed", sales: 1100, expenses: 450 },
  { day: "Thu", sales: 1800, expenses: 380 },
  { day: "Fri", sales: 2100, expenses: 420 },
  { day: "Sat", sales: 2400, expenses: 500 },
  { day: "Sun", sales: 1900, expenses: 380 },
];

export const topProducts: TopProduct[] = [
  { name: "Chocolate Cake", sales: 145, revenue: 2175, trend: "up" },
  { name: "Croissant", sales: 128, revenue: 1920, trend: "up" },
  { name: "Cappuccino", sales: 210, revenue: 1050, trend: "down" },
  { name: "Cheesecake", sales: 95, revenue: 1425, trend: "up" },
];

export const peakHours: PeakHour[] = [
  { hour: "8-9 AM", inquiries: 12 },
  { hour: "12-1 PM", inquiries: 24 },
  { hour: "3-4 PM", inquiries: 18 },
  { hour: "6-7 PM", inquiries: 32 },
];

export const keyMetrics: KeyMetric[] = [
  {
    label: "Total Revenue",
    value: "$12,450",
    change: "+18% from last month",
    trend: "up",
  },
  {
    label: "Total Expenses",
    value: "$3,280",
    change: "+5% from last month",
    trend: "up",
  },
  {
    label: "Products Sold",
    value: "578",
    change: "+12% from last month",
    trend: "up",
  },
  {
    label: "Active Customers",
    value: "234",
    change: "+23% from last month",
    trend: "up",
  },
];

export const maxChartValue = 2500;
