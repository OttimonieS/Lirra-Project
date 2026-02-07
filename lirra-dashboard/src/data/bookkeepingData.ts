import type { Transaction } from "../types";

// Data
export const initialTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-12-06",
    type: "income",
    amount: 450,
    category: "Sales",
    description: "Online order #1234",
  },
  {
    id: "2",
    date: "2025-12-06",
    type: "expense",
    amount: 120,
    category: "Supplies",
    description: "Ingredients purchase",
  },
  {
    id: "3",
    date: "2025-12-05",
    type: "income",
    amount: 780,
    category: "Sales",
    description: "Tokopedia sales",
  },
  {
    id: "4",
    date: "2025-12-05",
    type: "expense",
    amount: 200,
    category: "Utilities",
    description: "Electricity bill",
  },
  {
    id: "5",
    date: "2025-12-04",
    type: "income",
    amount: 1200,
    category: "Sales",
    description: "Shopee sales",
  },
];
