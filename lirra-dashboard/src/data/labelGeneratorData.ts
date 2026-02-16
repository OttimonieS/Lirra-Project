export interface Template {
  id: string;
  name: string;
  preview: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
}

export interface ColorOption {
  id: string;
  className: string;
}

export interface FontOption {
  id: string;
  name: string;
}

export interface ExportFormat {
  id: string;
  label: string;
}
export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    preview: "bg-gradient-to-br from-blue-500 to-purple-600",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    textColor: "#ffffff",
    backgroundColor: "#ffffff",
  },
  {
    id: "classic",
    name: "Classic",
    preview: "bg-gradient-to-br from-gray-700 to-gray-900",
    primaryColor: "#374151",
    secondaryColor: "#111827",
    textColor: "#ffffff",
    backgroundColor: "#f9fafb",
  },
  {
    id: "elegant",
    name: "Elegant",
    preview: "bg-gradient-to-br from-pink-400 to-orange-400",
    primaryColor: "#f472b6",
    secondaryColor: "#fb923c",
    textColor: "#ffffff",
    backgroundColor: "#fff7ed",
  },
  {
    id: "minimal",
    name: "Minimal",
    preview: "bg-white border-2 border-gray-300",
    primaryColor: "#ffffff",
    secondaryColor: "#f3f4f6",
    textColor: "#111827",
    backgroundColor: "#ffffff",
  },
];

export const colorOptions: ColorOption[] = [
  { id: "blue", className: "bg-blue-500" },
  { id: "red", className: "bg-red-500" },
  { id: "green", className: "bg-green-500" },
  { id: "purple", className: "bg-purple-500" },
  { id: "yellow", className: "bg-yellow-500" },
];

export const fontOptions: FontOption[] = [
  { id: "modern-sans", name: "Modern Sans" },
  { id: "classic-serif", name: "Classic Serif" },
  { id: "elegant-script", name: "Elegant Script" },
];

export const exportFormats: ExportFormat[] = [
  { id: "png", label: "PNG (Print)" },
  { id: "pdf", label: "PDF (High Quality)" },
  { id: "svg", label: "SVG (Scalable)" },
];

export const previewData = {
  productName: "Chocolate Cake",
  subtitle: "Premium Homemade",
  ingredients: "Flour, Sugar, Cocoa, Eggs, Butter, Milk",
  netWeight: "500g",
  bestBefore: "Dec 10, 2025",
};