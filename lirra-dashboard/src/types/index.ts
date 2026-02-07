export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  businessType: "food" | "fashion" | "services" | "other";
}

export interface Transaction {
  id: string;
  date: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  currency: string;
  receiptUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  description?: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  date: string;
  marketplace?: string;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  message: string;
  reply?: string;
  timestamp: string;
  isAuto: boolean;
}

export interface Store {
  id: string;
  name: string;
  platform: "tokopedia" | "shopee" | "instagram" | "whatsapp";
  connected: boolean;
  lastSync?: string;
}

export interface Analytics {
  totalSales: number;
  totalExpenses: number;
  profit: number;
  topProducts: Array<{ name: string; sales: number }>;
  peakHours: Array<{ hour: number; inquiries: number }>;
}
