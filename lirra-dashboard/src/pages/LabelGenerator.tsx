import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  Palette,
  Type,
  Image as ImageIcon,
  Save,
  Trash2,
  Copy,
  RotateCcw,
  Grid3x3,
  Ruler,
  Tag,
  Zap,
  X,
  ChevronDown,
  History,
  Eye,
  FileText,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Circle,
  Square,
  Star,
  Heart,
  Paintbrush,
} from "lucide-react";
import {
  templates,
  exportFormats,
  previewData,
} from "../data/labelGeneratorData";

interface LabelData {
  id: string;
  productName: string;
  subtitle: string;
  ingredients: string;
  netWeight: string;
  bestBefore: string;
  barcode?: string;
  allergens?: string;
  nutritionFacts?: string;
  manufacturer?: string;
}

interface SavedLabel {
  id: string;
  name: string;
  data: LabelData;
  template: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  timestamp: number;
}

const fontFamilies = [
  { value: "font-sans", label: "Sans Serif", style: "Arial, sans-serif" },
  { value: "font-serif", label: "Serif", style: "Georgia, serif" },
  { value: "font-mono", label: "Monospace", style: "Courier, monospace" },
  { value: "font-cursive", label: "Cursive", style: "cursive" },
  { value: "font-fantasy", label: "Fantasy", style: "fantasy" },
];

const LabelGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#8b5cf6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("font-sans");
  const [fontSize, setFontSize] = useState(16);
  const [titleFontSize, setTitleFontSize] = useState(24);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center"
  );
  const [titleBold, setTitleBold] = useState(true);
  const [titleItalic, setTitleItalic] = useState(false);
  const [titleUnderline, setTitleUnderline] = useState(false);
  const [cornerRadius, setCornerRadius] = useState(8);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState("#000000");
  const [shadowIntensity, setShadowIntensity] = useState(2);
  const [paddingSize, setPaddingSize] = useState(24);
  const [headerShape, setHeaderShape] = useState<
    "none" | "circle" | "square" | "star" | "heart"
  >("circle");
  const [backgroundPattern, setBackgroundPattern] = useState<
    "none" | "dots" | "grid" | "diagonal"
  >("none");
  const [gradientType, setGradientType] = useState<
    "linear" | "radial" | "none"
  >("linear");
  const [gradientAngle, setGradientAngle] = useState(45);
  const [headerOpacity, setHeaderOpacity] = useState(100);
  const [textShadow, setTextShadow] = useState(false);
  const [textOutline, setTextOutline] = useState(false);
  const [textOutlineColor, setTextOutlineColor] = useState("#000000");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [qrCodeEnabled, setQrCodeEnabled] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [qrCodeSize, setQrCodeSize] = useState(64);
  const [qrCodePosition, setQrCodePosition] = useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right"
  >("bottom-right");
  const [secondaryLogo, setSecondaryLogo] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<
    "center" | "top-left" | "top-right"
  >("center");
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [badgeEnabled, setBadgeEnabled] = useState(false);
  const [badgeText, setBadgeText] = useState("NEW");
  const [badgeColor, setBadgeColor] = useState("#ef4444");
  const [badgePosition, setBadgePosition] = useState<"top-left" | "top-right">(
    "top-right"
  );
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState("BRAND");
  const [watermarkOpacity, setWatermarkOpacity] = useState(10);
  const [ribbonEnabled, setRibbonEnabled] = useState(false);
  const [ribbonText, setRibbonText] = useState("Premium");
  const [ribbonColor, setRibbonColor] = useState("#10b981");
  const [ribbonPosition, setRibbonPosition] = useState<
    "top-left" | "top-right"
  >("top-left");
  const [textTransform, setTextTransform] = useState<
    "none" | "uppercase" | "lowercase" | "capitalize"
  >("none");
  const [headerHeight, setHeaderHeight] = useState(35);
  const [contentBackground, setContentBackground] = useState("#ffffff");
  const [contentOpacity, setContentOpacity] = useState(100);

  const [labelSize, setLabelSize] = useState("medium");
  const [customWidth, setCustomWidth] = useState(300);
  const [customHeight, setCustomHeight] = useState(400);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(64);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [savedLabels, setSavedLabels] = useState<SavedLabel[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [gridLines, setGridLines] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<LabelData>({
    id: crypto.randomUUID(),
    productName: previewData.productName,
    subtitle: previewData.subtitle,
    ingredients: previewData.ingredients,
    netWeight: previewData.netWeight,
    bestBefore: previewData.bestBefore,
    barcode: "",
    allergens: "",
    nutritionFacts: "",
    manufacturer: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("savedLabels");
    if (saved) {
      setSavedLabels(JSON.parse(saved));
    }
  }, []);

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
        showSuccessToast("Logo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSecondaryLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSecondaryLogo(reader.result as string);
        showSuccessToast("Secondary logo uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const applyThemePreset = (theme: string) => {
    switch (theme) {
      case "elegant":
        setPrimaryColor("#1e293b");
        setSecondaryColor("#64748b");
        setTextColor("#ffffff");
        setBackgroundColor("#f8fafc");
        setFontFamily("font-serif");
        setCornerRadius(16);
        setBackgroundPattern("none");
        setGradientType("linear");
        break;
      case "bold":
        setPrimaryColor("#dc2626");
        setSecondaryColor("#ea580c");
        setTextColor("#ffffff");
        setBackgroundColor("#fef2f2");
        setFontFamily("font-sans");
        setCornerRadius(8);
        setBackgroundPattern("diagonal");
        setGradientType("linear");
        break;
      case "minimal":
        setPrimaryColor("#000000");
        setSecondaryColor("#404040");
        setTextColor("#ffffff");
        setBackgroundColor("#ffffff");
        setFontFamily("font-sans");
        setCornerRadius(0);
        setBackgroundPattern("none");
        setGradientType("none");
        break;
      case "playful":
        setPrimaryColor("#f59e0b");
        setSecondaryColor("#ec4899");
        setTextColor("#ffffff");
        setBackgroundColor("#fef3c7");
        setFontFamily("font-cursive");
        setCornerRadius(24);
        setBackgroundPattern("dots");
        setGradientType("radial");
        break;
    }
    showSuccessToast(
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied!`
    );
  };

  const handleSaveLabel = () => {
    const newLabel: SavedLabel = {
      id: crypto.randomUUID(),
      name: formData.productName || "Untitled Label",
      data: formData,
      template: selectedTemplate,
      primaryColor,
      secondaryColor,
      fontFamily,
      fontSize,
      timestamp: Date.now(),
    };

    const updated = [newLabel, ...savedLabels].slice(0, 10);
    setSavedLabels(updated);
    localStorage.setItem("savedLabels", JSON.stringify(updated));
    showSuccessToast("Label saved to history!");
  };

  const handleLoadLabel = (label: SavedLabel) => {
    setFormData(label.data);
    setSelectedTemplate(label.template);
    setPrimaryColor(label.primaryColor);
    setSecondaryColor(label.secondaryColor);
    setFontFamily(label.fontFamily);
    setFontSize(label.fontSize);
    setShowHistory(false);
    showSuccessToast("Label loaded from history!");
  };

  const handleDeleteLabel = (id: string) => {
    const updated = savedLabels.filter((l) => l.id !== id);
    setSavedLabels(updated);
    localStorage.setItem("savedLabels", JSON.stringify(updated));
    showSuccessToast("Label deleted from history!");
  };

  const handleDuplicateLabel = () => {
    setFormData({
      ...formData,
      id: crypto.randomUUID(),
      productName: `${formData.productName} (Copy)`,
    });
    showSuccessToast("Label duplicated!");
  };

  const handleResetLabel = () => {
    if (confirm("Are you sure you want to reset all fields?")) {
      setFormData({
        id: crypto.randomUUID(),
        productName: "",
        subtitle: "",
        ingredients: "",
        netWeight: "",
        bestBefore: "",
        barcode: "",
        allergens: "",
        nutritionFacts: "",
        manufacturer: "",
      });
      setLogoImage(null);
      setPrimaryColor("#3b82f6");
      setSecondaryColor("#8b5cf6");
      setTextColor("#ffffff");
      setBackgroundColor("#ffffff");
      setFontFamily("font-sans");
      setFontSize(16);
      setTitleFontSize(24);
      showSuccessToast("Label reset successfully!");
    }
  };

  const handleGenerateBarcode = () => {
    const barcode = Array.from({ length: 13 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    setFormData({ ...formData, barcode });
    setShowBarcodeModal(false);
    showSuccessToast("Barcode generated!");
  };

  const handleAutoFillSample = () => {
    setFormData({
      ...formData,
      productName: "Premium Chocolate Cake",
      subtitle: "Handcrafted with Love",
      ingredients:
        "Flour, Sugar, Cocoa Powder, Eggs, Butter, Milk, Vanilla Extract, Baking Powder, Salt",
      netWeight: "500g (17.6oz)",
      bestBefore: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      allergens: "Contains: Eggs, Milk, Wheat, Soy",
      manufacturer: "Artisan Bakery Co. | Est. 2020",
    });
    showSuccessToast("Sample data filled!");
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setPrimaryColor(template.primaryColor);
      setSecondaryColor(template.secondaryColor);
      setTextColor(template.textColor);
      setBackgroundColor(template.backgroundColor);
      showSuccessToast(`${template.name} template applied!`);
    }
  };

  const handleExport = async (format: string) => {
    if (!labelRef.current) return;

    try {
      if (format === "png") {
        const html2canvas = (await import("html2canvas")).default;

        const canvas = await html2canvas(labelRef.current, {
          scale: 2,
          backgroundColor: null,
          logging: false,
          width: dimensions.width,
          height: dimensions.height,
        });

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${
              formData.productName || "label"
            }-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
            showSuccessToast("PNG exported successfully!");
          }
        });
      } else if (format === "pdf") {
        const html2canvas = (await import("html2canvas")).default;
        const { jsPDF } = await import("jspdf");

        const canvas = await html2canvas(labelRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
          width: dimensions.width,
          height: dimensions.height,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: orientation === "landscape" ? "landscape" : "portrait",
          unit: "px",
          format: [dimensions.width, dimensions.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, dimensions.width, dimensions.height);
        pdf.save(`${formData.productName || "label"}-${Date.now()}.pdf`);
        showSuccessToast("PDF exported successfully!");
      } else if (format === "svg") {
        const svgString = createSVGExport();
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${formData.productName || "label"}-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
        showSuccessToast("SVG exported successfully!");
      }
    } catch (error) {
      console.error("Export error:", error);
      showSuccessToast("Export failed. Please try again.");
    }
  };

  const createSVGExport = () => {
    const { width, height } = dimensions;
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${backgroundColor}" rx="${cornerRadius}"/>
  
  <!-- Header -->
  <rect width="${width}" height="${
      height * 0.35
    }" fill="url(#headerGradient)" />
  
  <!-- Product Name -->
  <text x="${width / 2}" y="${height * 0.22}" 
    font-family="${fontFamily.replace("font-", "")}" 
    font-size="${titleFontSize}" 
    font-weight="${titleBold ? "bold" : "normal"}"
    font-style="${titleItalic ? "italic" : "normal"}"
    text-decoration="${titleUnderline ? "underline" : "none"}"
    fill="${textColor}" 
    text-anchor="middle">
    ${formData.productName || "Product Name"}
  </text>
  
  ${
    formData.subtitle
      ? `
  <text x="${width / 2}" y="${height * 0.28}" 
    font-family="${fontFamily.replace("font-", "")}" 
    font-size="${fontSize - 2}" 
    fill="${textColor}" 
    opacity="0.9"
    text-anchor="middle">
    ${formData.subtitle}
  </text>`
      : ""
  }
  
  <!-- Ingredients -->
  ${
    formData.ingredients
      ? `
  <text x="${paddingSize}" y="${height * 0.45}" 
    font-family="${fontFamily.replace("font-", "")}" 
    font-size="${fontSize - 2}" 
    font-weight="bold"
    fill="#4B5563">
    INGREDIENTS
  </text>
  <text x="${paddingSize}" y="${height * 0.5}" 
    font-family="${fontFamily.replace("font-", "")}" 
    font-size="${fontSize - 1}" 
    fill="#1F2937">
    ${formData.ingredients.substring(0, 50)}...
  </text>`
      : ""
  }
  
  <!-- Footer -->
  ${
    formData.manufacturer
      ? `
  <text x="${width / 2}" y="${height - 20}" 
    font-family="${fontFamily.replace("font-", "")}" 
    font-size="${fontSize - 3}" 
    fill="#6B7280" 
    font-style="italic"
    text-anchor="middle">
    ${formData.manufacturer}
  </text>`
      : ""
  }
</svg>`;
  };

  const getLabelDimensions = () => {
    if (labelSize === "custom") {
      return { width: customWidth, height: customHeight };
    }

    const sizes = {
      small: { width: 200, height: 300 },
      medium: { width: 300, height: 400 },
      large: { width: 400, height: 600 },
    };

    const dimensions = sizes[labelSize as keyof typeof sizes] || sizes.medium;

    if (orientation === "landscape") {
      return { width: dimensions.height, height: dimensions.width };
    }

    return dimensions;
  };

  const getBackgroundGradient = () => {
    const opacity = headerOpacity / 100;

    if (gradientType === "none") {
      return `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(
        primaryColor.slice(3, 5),
        16
      )}, ${parseInt(primaryColor.slice(5, 7), 16)}, ${opacity})`;
    } else if (gradientType === "radial") {
      return `radial-gradient(circle at center, ${primaryColor}, ${secondaryColor})`;
    } else {
      return `linear-gradient(${gradientAngle}deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    }
  };

  const getBackgroundPattern = () => {
    if (backgroundPattern === "dots") {
      return "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)";
    } else if (backgroundPattern === "grid") {
      return "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)";
    } else if (backgroundPattern === "diagonal") {
      return "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)";
    }
    return "none";
  };

  const renderLogoShape = () => {
    if (logoImage) {
      return (
        <img
          src={logoImage}
          alt="Logo"
          style={{
            width: `${logoSize}px`,
            height: `${logoSize}px`,
            objectFit: "contain",
            margin: "0 auto",
            marginBottom: "0.75rem",
            borderRadius: headerShape === "circle" ? "9999px" : "0.5rem",
          }}
        />
      );
    }

    const shapeStyles: Record<string, string> = {
      circle: "9999px",
      square: "0.5rem",
      star: "0.5rem",
      heart: "9999px",
      none: "0.5rem",
    };

    return (
      <div
        style={{
          width: `${logoSize}px`,
          height: `${logoSize}px`,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          margin: "0 auto",
          marginBottom: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: shapeStyles[headerShape],
          transform: headerShape === "star" ? "rotate(45deg)" : "none",
        }}
      >
        <ImageIcon
          size={logoSize / 3}
          style={{ color: "rgba(255, 255, 255, 0.5)" }}
        />
      </div>
    );
  };

  const dimensions = getLabelDimensions();

  return (
    <div className="p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
<div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Label Generator
              </h1>
              <p className="text-gray-600">
                Create professional product labels with unlimited customization
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <History size={20} className="mr-2" />
                History ({savedLabels.length})
              </button>
              <button
                onClick={handleSaveLabel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Save size={20} className="mr-2" />
                Save Label
              </button>
            </div>
          </div>
        </div>
<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={handleAutoFillSample}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Sparkles size={18} className="mr-2" />
              Auto-Fill Sample
            </button>
            <button
              onClick={handleDuplicateLabel}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Copy size={18} className="mr-2" />
              Duplicate
            </button>
            <button
              onClick={handleResetLabel}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <RotateCcw size={18} className="mr-2" />
              Reset
            </button>
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setGridLines(!gridLines)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  gridLines
                    ? "bg-primary text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
<div className="lg:col-span-1 space-y-6">
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="mr-2" size={18} />
                Select Template
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleTemplateChange(tmpl.id)}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedTemplate === tmpl.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-full h-20 ${tmpl.preview} rounded mb-2`}
                    ></div>
                    <p className="text-sm font-medium text-gray-900">
                      {tmpl.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="mr-2" size={18} />
                Brand Logo
              </h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              {logoImage ? (
                <div className="relative">
                  <img
                    src={logoImage}
                    alt="Logo"
                    className="w-full h-32 object-contain bg-gray-50 rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => setLogoImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </button>
              )}
<div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Size: {logoSize}px
                </label>
                <input
                  type="range"
                  min="32"
                  max="128"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
<div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Shape
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setHeaderShape("none")}
                    className={`flex-1 p-2 rounded border ${
                      headerShape === "none"
                        ? "border-primary bg-primary/5"
                        : "border-gray-300"
                    }`}
                  >
                    <Square size={20} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => setHeaderShape("circle")}
                    className={`flex-1 p-2 rounded border ${
                      headerShape === "circle"
                        ? "border-primary bg-primary/5"
                        : "border-gray-300"
                    }`}
                  >
                    <Circle size={20} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => setHeaderShape("star")}
                    className={`flex-1 p-2 rounded border ${
                      headerShape === "star"
                        ? "border-primary bg-primary/5"
                        : "border-gray-300"
                    }`}
                  >
                    <Star size={20} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => setHeaderShape("heart")}
                    className={`flex-1 p-2 rounded border ${
                      headerShape === "heart"
                        ? "border-primary bg-primary/5"
                        : "border-gray-300"
                    }`}
                  >
                    <Heart size={20} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="w-full flex items-center justify-between text-left mb-4"
              >
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Palette className="mr-2" size={18} />
                  Design Customization
                </h3>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    showCustomization ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showCustomization && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color (Gradient)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Text Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Pattern
                    </label>
                    <select
                      value={backgroundPattern}
                      onChange={(e) =>
                        setBackgroundPattern(
                          e.target.value as
                            | "none"
                            | "dots"
                            | "grid"
                            | "diagonal"
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="none">None</option>
                      <option value="dots">Dots</option>
                      <option value="grid">Grid</option>
                      <option value="diagonal">Diagonal Lines</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Corner Radius: {cornerRadius}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={cornerRadius}
                      onChange={(e) => setCornerRadius(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shadow Intensity: {shadowIntensity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={shadowIntensity}
                      onChange={(e) =>
                        setShadowIntensity(Number(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Padding: {paddingSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={paddingSize}
                      onChange={(e) => setPaddingSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Width: {borderWidth}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {borderWidth > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Border Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="mr-2" size={18} />
                Typography
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {fontFamilies.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Size: {titleFontSize}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="48"
                    value={titleFontSize}
                    onChange={(e) => setTitleFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Text Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Alignment
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTextAlign("left")}
                      className={`flex-1 p-2 rounded border ${
                        textAlign === "left"
                          ? "border-primary bg-primary/5"
                          : "border-gray-300"
                      }`}
                    >
                      <AlignLeft size={20} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setTextAlign("center")}
                      className={`flex-1 p-2 rounded border ${
                        textAlign === "center"
                          ? "border-primary bg-primary/5"
                          : "border-gray-300"
                      }`}
                    >
                      <AlignCenter size={20} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setTextAlign("right")}
                      className={`flex-1 p-2 rounded border ${
                        textAlign === "right"
                          ? "border-primary bg-primary/5"
                          : "border-gray-300"
                      }`}
                    >
                      <AlignRight size={20} className="mx-auto" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Style
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTitleBold(!titleBold)}
                      className={`flex-1 p-2 rounded border ${
                        titleBold
                          ? "border-primary bg-primary/5"
                          : "border-gray-300"
                      }`}
                    >
                      <Bold size={20} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setTitleItalic(!titleItalic)}
                      className={`flex-1 p-2 rounded border ${
                        titleItalic
                          ? "border-primary bg-primary/5"
                          : "border-gray-300"
                      }`}
                    >
                      <Italic size={20} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setTitleUnderline(!titleUnderline)}
                      className={`flex-1 p-2 rounded border ${
                        titleUnderline
                          ? "border-primary bg-primary/5"
                          : "border-gray-300"
                      }`}
                    >
                      <Underline size={20} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Ruler className="mr-2" size={18} />
                Label Dimensions
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size Preset
                  </label>
                  <select
                    value={labelSize}
                    onChange={(e) => setLabelSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="small">Small (2" × 3")</option>
                    <option value="medium">Medium (3" × 4")</option>
                    <option value="large">Large (4" × 6")</option>
                    <option value="custom">Custom Size</option>
                  </select>
                </div>

                {labelSize === "custom" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        min="100"
                        max="800"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) =>
                          setCustomHeight(Number(e.target.value))
                        }
                        min="100"
                        max="800"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orientation
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOrientation("portrait")}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                        orientation === "portrait"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      onClick={() => setOrientation("landscape")}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                        orientation === "landscape"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Sparkles className="mr-2" size={18} />
                Quick Theme Presets
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => applyThemePreset("elegant")}
                  className="p-4 rounded-lg border-2 border-gray-300 hover:border-primary transition-all text-left"
                >
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-slate-800"></div>
                    <div className="w-6 h-6 rounded bg-slate-500"></div>
                  </div>
                  <p className="font-semibold text-sm">Elegant</p>
                  <p className="text-xs text-gray-500">
                    Sophisticated & refined
                  </p>
                </button>
                <button
                  onClick={() => applyThemePreset("bold")}
                  className="p-4 rounded-lg border-2 border-gray-300 hover:border-primary transition-all text-left"
                >
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-red-600"></div>
                    <div className="w-6 h-6 rounded bg-orange-600"></div>
                  </div>
                  <p className="font-semibold text-sm">Bold</p>
                  <p className="text-xs text-gray-500">
                    Eye-catching & vibrant
                  </p>
                </button>
                <button
                  onClick={() => applyThemePreset("minimal")}
                  className="p-4 rounded-lg border-2 border-gray-300 hover:border-primary transition-all text-left"
                >
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-black"></div>
                    <div className="w-6 h-6 rounded bg-gray-500"></div>
                  </div>
                  <p className="font-semibold text-sm">Minimal</p>
                  <p className="text-xs text-gray-500">Clean & simple</p>
                </button>
                <button
                  onClick={() => applyThemePreset("playful")}
                  className="p-4 rounded-lg border-2 border-gray-300 hover:border-primary transition-all text-left"
                >
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-yellow-500"></div>
                    <div className="w-6 h-6 rounded bg-pink-500"></div>
                  </div>
                  <p className="font-semibold text-sm">Playful</p>
                  <p className="text-xs text-gray-500">Fun & cheerful</p>
                </button>
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="mr-2" size={18} />
                Advanced Typography
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Transform
                  </label>
                  <select
                    value={textTransform}
                    onChange={(e) =>
                      setTextTransform(
                        e.target.value as
                          | "none"
                          | "uppercase"
                          | "lowercase"
                          | "capitalize"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="none">Normal</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="lowercase">lowercase</option>
                    <option value="capitalize">Capitalize</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Letter Spacing: {letterSpacing}px
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line Height: {lineHeight}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="textShadow"
                    checked={textShadow}
                    onChange={(e) => setTextShadow(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="textShadow"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enable Text Shadow
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="textOutline"
                    checked={textOutline}
                    onChange={(e) => setTextOutline(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="textOutline"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enable Text Outline
                  </label>
                </div>

                {textOutline && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Outline Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={textOutlineColor}
                        onChange={(e) => setTextOutlineColor(e.target.value)}
                        className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={textOutlineColor}
                        onChange={(e) => setTextOutlineColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Paintbrush className="mr-2" size={18} />
                Gradient & Effects
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gradient Type
                  </label>
                  <select
                    value={gradientType}
                    onChange={(e) =>
                      setGradientType(
                        e.target.value as "linear" | "radial" | "none"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="linear">Linear Gradient</option>
                    <option value="radial">Radial Gradient</option>
                    <option value="none">Solid Color (No Gradient)</option>
                  </select>
                </div>

                {gradientType === "linear" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradient Angle: {gradientAngle}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={gradientAngle}
                      onChange={(e) => setGradientAngle(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Opacity: {headerOpacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={headerOpacity}
                    onChange={(e) => setHeaderOpacity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Height: {headerHeight}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    value={headerHeight}
                    onChange={(e) => setHeaderHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={contentBackground}
                      onChange={(e) => setContentBackground(e.target.value)}
                      className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={contentBackground}
                      onChange={(e) => setContentBackground(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Opacity: {contentOpacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contentOpacity}
                    onChange={(e) => setContentOpacity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="mr-2" size={18} />
                Decorative Elements
              </h3>
              <div className="space-y-4">
<div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Corner Badge
                    </label>
                    <input
                      type="checkbox"
                      checked={badgeEnabled}
                      onChange={(e) => setBadgeEnabled(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                  {badgeEnabled && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        placeholder="Badge text"
                        maxLength={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={badgeColor}
                          onChange={(e) => setBadgeColor(e.target.value)}
                          className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <select
                          value={badgePosition}
                          onChange={(e) =>
                            setBadgePosition(
                              e.target.value as "top-left" | "top-right"
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
<div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Corner Ribbon
                    </label>
                    <input
                      type="checkbox"
                      checked={ribbonEnabled}
                      onChange={(e) => setRibbonEnabled(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                  {ribbonEnabled && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={ribbonText}
                        onChange={(e) => setRibbonText(e.target.value)}
                        placeholder="Ribbon text"
                        maxLength={15}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={ribbonColor}
                          onChange={(e) => setRibbonColor(e.target.value)}
                          className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <select
                          value={ribbonPosition}
                          onChange={(e) =>
                            setRibbonPosition(
                              e.target.value as "top-left" | "top-right"
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
<div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Watermark
                    </label>
                    <input
                      type="checkbox"
                      checked={watermarkEnabled}
                      onChange={(e) => setWatermarkEnabled(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                  {watermarkEnabled && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Watermark text"
                        maxLength={20}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Opacity: {watermarkOpacity}%
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          value={watermarkOpacity}
                          onChange={(e) =>
                            setWatermarkOpacity(Number(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
<div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      QR Code
                    </label>
                    <input
                      type="checkbox"
                      checked={qrCodeEnabled}
                      onChange={(e) => setQrCodeEnabled(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                  {qrCodeEnabled && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={qrCodeData}
                        onChange={(e) => setQrCodeData(e.target.value)}
                        placeholder="URL or text for QR code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Size: {qrCodeSize}px
                          </label>
                          <input
                            type="range"
                            min="40"
                            max="120"
                            value={qrCodeSize}
                            onChange={(e) =>
                              setQrCodeSize(Number(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>
                        <select
                          value={qrCodePosition}
                          onChange={(e) =>
                            setQrCodePosition(
                              e.target.value as
                                | "top-left"
                                | "top-right"
                                | "bottom-left"
                                | "bottom-right"
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="mr-2" size={18} />
                Logo & Images
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Logo
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors"
                  >
                    <Upload className="mx-auto mb-1" size={20} />
                    <span className="text-sm">Upload Primary Logo</span>
                  </button>
                  {logoImage && (
                    <button
                      onClick={() => setLogoImage(null)}
                      className="mt-2 w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                {logoImage && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Position
                      </label>
                      <select
                        value={logoPosition}
                        onChange={(e) =>
                          setLogoPosition(
                            e.target.value as
                              | "center"
                              | "top-left"
                              | "top-right"
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="center">Center (Header)</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Size: {logoSize}px
                      </label>
                      <input
                        type="range"
                        min="32"
                        max="150"
                        value={logoSize}
                        onChange={(e) => setLogoSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Opacity: {logoOpacity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={logoOpacity}
                        onChange={(e) => setLogoOpacity(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Logo/Icon
                  </label>
                  <button
                    onClick={() =>
                      document.getElementById("secondaryLogoInput")?.click()
                    }
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors"
                  >
                    <Upload className="mx-auto mb-1" size={16} />
                    <span className="text-xs">Upload Secondary Logo</span>
                  </button>
                  <input
                    id="secondaryLogoInput"
                    type="file"
                    onChange={handleSecondaryLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {secondaryLogo && (
                    <button
                      onClick={() => setSecondaryLogo(null)}
                      className="mt-2 w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"
                    >
                      Remove Secondary Logo
                    </button>
                  )}
                </div>
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2" size={18} />
                Label Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    placeholder="e.g., Chocolate Cake"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    placeholder="e.g., Premium Homemade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredients *
                  </label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) =>
                      setFormData({ ...formData, ingredients: e.target.value })
                    }
                    placeholder="List all ingredients..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Net Weight
                    </label>
                    <input
                      type="text"
                      value={formData.netWeight}
                      onChange={(e) =>
                        setFormData({ ...formData, netWeight: e.target.value })
                      }
                      placeholder="500g"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Best Before
                    </label>
                    <input
                      type="date"
                      value={formData.bestBefore}
                      onChange={(e) =>
                        setFormData({ ...formData, bestBefore: e.target.value })
                      }
                      placeholder="yyyy-MM-dd"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Zap className="mr-2" size={18} />
                  Advanced Fields
                </h3>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    showAdvanced ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showAdvanced && (
                <div className="space-y-3 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barcode
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) =>
                          setFormData({ ...formData, barcode: e.target.value })
                        }
                        placeholder="Enter barcode"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        onClick={() => setShowBarcodeModal(true)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Zap size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergens
                    </label>
                    <textarea
                      value={formData.allergens}
                      onChange={(e) =>
                        setFormData({ ...formData, allergens: e.target.value })
                      }
                      placeholder="Contains: Eggs, Milk, Wheat..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={2}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nutrition Facts
                    </label>
                    <textarea
                      value={formData.nutritionFacts}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nutritionFacts: e.target.value,
                        })
                      }
                      placeholder="Calories: 250, Protein: 5g..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={2}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manufacturer: e.target.value,
                        })
                      }
                      placeholder="Company name & address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
<div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Eye className="mr-2" size={18} />
                  Live Preview
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Download size={20} className="mr-2" />
                    Export Label
                  </button>
                </div>
              </div>
<div
                className={`border-2 border-gray-300 rounded-lg p-8 bg-gray-50 overflow-auto`}
                style={{
                  backgroundImage: gridLines
                    ? "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)"
                    : "none",
                  backgroundSize: "20px 20px",
                }}
              >
                <div className="flex items-center justify-center min-h-[600px]">
                  <div
                    ref={labelRef}
                    style={{
                      width: `${dimensions.width}px`,
                      height: `${dimensions.height}px`,
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: "center",
                      margin: "0 auto",
                      backgroundColor: "#ffffff",
                      overflow: "hidden",
                      transition: "all 0.3s",
                      fontFamily: fontFamily,
                      position: "relative",
                      borderRadius: `${cornerRadius}px`,
                      boxShadow:
                        shadowIntensity > 0
                          ? `0 ${shadowIntensity * 4}px ${
                              shadowIntensity * 8
                            }px rgba(0,0,0,${0.1 * shadowIntensity})`
                          : "none",
                      border:
                        borderWidth > 0
                          ? `${borderWidth}px solid ${borderColor}`
                          : "none",
                    }}
                  >
{badgeEnabled && (
                      <div
                        style={{
                          position: "absolute",
                          zIndex: 20,
                          top: badgePosition === "top-left" ? "12px" : "12px",
                          left: badgePosition === "top-left" ? "12px" : "auto",
                          right:
                            badgePosition === "top-right" ? "12px" : "auto",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: badgeColor,
                            transform: "rotate(-5deg)",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            color: "#ffffff",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            boxShadow:
                              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          {badgeText}
                        </div>
                      </div>
                    )}
{ribbonEnabled && (
                      <div
                        style={{
                          position: "absolute",
                          zIndex: 20,
                          overflow: "hidden",
                          top: ribbonPosition === "top-left" ? 0 : 0,
                          left: ribbonPosition === "top-left" ? 0 : "auto",
                          right: ribbonPosition === "top-right" ? 0 : "auto",
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            backgroundColor: ribbonColor,
                            color: "#ffffff",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            textAlign: "center",
                            top: "20px",
                            left:
                              ribbonPosition === "top-left" ? "-30px" : "auto",
                            right:
                              ribbonPosition === "top-right" ? "-30px" : "auto",
                            width: "140px",
                            transform:
                              ribbonPosition === "top-left"
                                ? "rotate(-45deg)"
                                : "rotate(45deg)",
                            padding: "5px 0",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                          }}
                        >
                          {ribbonText}
                        </div>
                      </div>
                    )}
{qrCodeEnabled && qrCodeData && (
                      <div
                        style={{
                          position: "absolute",
                          zIndex: 10,
                          backgroundColor: "#ffffff",
                          padding: "0.5rem",
                          borderRadius: "0.25rem",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          top: qrCodePosition.includes("top") ? "12px" : "auto",
                          bottom: qrCodePosition.includes("bottom")
                            ? "12px"
                            : "auto",
                          left: qrCodePosition.includes("left")
                            ? "12px"
                            : "auto",
                          right: qrCodePosition.includes("right")
                            ? "12px"
                            : "auto",
                          width: `${qrCodeSize}px`,
                          height: `${qrCodeSize}px`,
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#111827",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          QR
                        </div>
                      </div>
                    )}
{watermarkEnabled && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          pointerEvents: "none",
                          zIndex: 5,
                          opacity: watermarkOpacity / 100,
                        }}
                      >
                        <div
                          style={{
                            color: "#9ca3af",
                            fontWeight: "bold",
                            userSelect: "none",
                            fontSize: `${dimensions.width / 4}px`,
                            transform: "rotate(-45deg)",
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                          }}
                        >
                          {watermarkText}
                        </div>
                      </div>
                    )}
<div
                      style={{
                        ...(backgroundPattern !== "none"
                          ? { backgroundImage: getBackgroundPattern() }
                          : gradientType === "none"
                          ? { backgroundColor: getBackgroundGradient() }
                          : { backgroundImage: getBackgroundGradient() }),
                        backgroundSize:
                          backgroundPattern === "dots"
                            ? "20px 20px"
                            : backgroundPattern === "grid"
                            ? "20px 20px"
                            : "cover",
                        color: textColor,
                        padding: `${paddingSize}px`,
                        textAlign: textAlign,
                        height: `${headerHeight}%`,
                        opacity: headerOpacity / 100,
                      }}
                    >
                      {renderLogoShape()}
                      <h4
                        style={{
                          fontSize: `${titleFontSize}px`,
                          fontWeight: titleBold ? "bold" : "normal",
                          fontStyle: titleItalic ? "italic" : "normal",
                          textDecoration: titleUnderline ? "underline" : "none",
                          letterSpacing: `${letterSpacing}px`,
                          lineHeight: lineHeight,
                          textTransform: textTransform,
                          textShadow: textShadow
                            ? "2px 2px 4px rgba(0,0,0,0.3)"
                            : "none",
                          WebkitTextStroke: textOutline
                            ? `1px ${textOutlineColor}`
                            : "none",
                        }}
                      >
                        {formData.productName || "Product Name"}
                      </h4>
                      {formData.subtitle && (
                        <p
                          style={{
                            fontSize: `${fontSize - 2}px`,
                            opacity: 0.9,
                            marginTop: "4px",
                          }}
                        >
                          {formData.subtitle}
                        </p>
                      )}
                    </div>
<div
                      style={{
                        padding: `${paddingSize}px`,
                        backgroundColor: contentBackground,
                        opacity: contentOpacity / 100,
                        fontSize: `${fontSize}px`,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
<div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {formData.ingredients && (
                          <div style={{ textAlign: textAlign }}>
                            <p
                              style={{
                                fontSize: `${fontSize - 2}px`,
                                letterSpacing: "0.5px",
                                fontWeight: "bold",
                                color: "#374151",
                                marginBottom: "0.25rem",
                                textTransform: "uppercase",
                              }}
                            >
                              Ingredients
                            </p>
                            <p
                              style={{
                                fontSize: `${fontSize - 1}px`,
                                color: "#1f2937",
                                lineHeight: 1.625,
                              }}
                            >
                              {formData.ingredients}
                            </p>
                          </div>
                        )}
{(formData.netWeight || formData.bestBefore) && (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(2, 1fr)",
                              gap: "0.75rem",
                              paddingTop: "0.5rem",
                            }}
                          >
                            {formData.netWeight && (
                              <div
                                style={{
                                  textAlign: textAlign,
                                  backgroundColor: "#f9fafb",
                                  padding: "0.75rem",
                                  borderRadius: "0.5rem",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: `${fontSize - 4}px`,
                                    letterSpacing: "0.5px",
                                    fontWeight: "bold",
                                    color: "#4b5563",
                                    textTransform: "uppercase",
                                    marginBottom: "0.25rem",
                                  }}
                                >
                                  Net Weight
                                </p>
                                <p
                                  style={{
                                    fontSize: `${fontSize + 1}px`,
                                    color: "#111827",
                                    fontWeight: 600,
                                  }}
                                >
                                  {formData.netWeight}
                                </p>
                              </div>
                            )}
                            {formData.bestBefore && (
                              <div
                                style={{
                                  textAlign: textAlign,
                                  backgroundColor: "#f9fafb",
                                  padding: "0.75rem",
                                  borderRadius: "0.5rem",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: `${fontSize - 4}px`,
                                    letterSpacing: "0.5px",
                                    fontWeight: "bold",
                                    color: "#4b5563",
                                    textTransform: "uppercase",
                                    marginBottom: "0.25rem",
                                  }}
                                >
                                  Best Before
                                </p>
                                <p
                                  style={{
                                    fontSize: `${fontSize + 1}px`,
                                    color: "#111827",
                                    fontWeight: 600,
                                  }}
                                >
                                  {new Date(
                                    formData.bestBefore
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {formData.allergens && (
                          <div
                            style={{
                              textAlign: textAlign,
                              backgroundColor: "#fef2f2",
                              border: "1px solid #fecaca",
                              padding: "0.75rem",
                              borderRadius: "0.5rem",
                            }}
                          >
                            <p
                              style={{
                                fontSize: `${fontSize - 2}px`,
                                letterSpacing: "0.5px",
                                fontWeight: "bold",
                                color: "#b91c1c",
                                marginBottom: "0.25rem",
                                textTransform: "uppercase",
                              }}
                            >
                              ⚠️ Allergen Warning
                            </p>
                            <p
                              style={{
                                fontSize: `${fontSize - 1}px`,
                                color: "#7f1d1d",
                                fontWeight: 500,
                              }}
                            >
                              {formData.allergens}
                            </p>
                          </div>
                        )}

                        {formData.nutritionFacts && (
                          <div
                            style={{
                              textAlign: textAlign,
                              backgroundColor: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              padding: "0.75rem",
                              borderRadius: "0.5rem",
                            }}
                          >
                            <p
                              style={{
                                fontSize: `${fontSize - 2}px`,
                                letterSpacing: "0.5px",
                                fontWeight: "bold",
                                color: "#1d4ed8",
                                marginBottom: "0.25rem",
                                textTransform: "uppercase",
                              }}
                            >
                              Nutrition Facts
                            </p>
                            <p
                              style={{
                                fontSize: `${fontSize - 1}px`,
                                color: "#1e3a8a",
                              }}
                            >
                              {formData.nutritionFacts}
                            </p>
                          </div>
                        )}
                      </div>
<div
                        style={{
                          marginTop: "auto",
                          paddingTop: "0.75rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                          borderTop: "2px solid #e5e7eb",
                        }}
                      >
                        {formData.barcode && (
                          <div
                            style={{
                              textAlign: textAlign,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                border: "2px solid #d1d5db",
                                padding: "0.75rem",
                                borderRadius: "0.5rem",
                                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: "2px",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                {formData.barcode.split("").map((_digit, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      width: "2px",
                                      height: "40px",
                                      backgroundColor: "#111827",
                                    }}
                                  ></div>
                                ))}
                              </div>
                              <p
                                style={{
                                  fontSize: `${fontSize - 3}px`,
                                  fontFamily: "monospace",
                                  textAlign: "center",
                                  fontWeight: 600,
                                }}
                              >
                                {formData.barcode}
                              </p>
                            </div>
                          </div>
                        )}

                        {formData.manufacturer && (
                          <div
                            style={{
                              textAlign: textAlign,
                              borderTop: "1px solid #e5e7eb",
                              paddingTop: "0.5rem",
                            }}
                          >
                            <p
                              style={{
                                fontSize: `${fontSize - 3}px`,
                                color: "#6b7280",
                                fontStyle: "italic",
                              }}
                            >
                              {formData.manufacturer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
<div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Export Format
                </p>
                <div className="flex gap-3">
                  {exportFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium hover:shadow-md"
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
{showHistory && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full p-6 max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <History className="mr-2" size={24} />
                  Saved Labels
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {savedLabels.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600">No saved labels yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedLabels.map((label) => (
                    <div
                      key={label.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {label.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(label.timestamp).toLocaleString()} •{" "}
                            {label.template}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLoadLabel(label)}
                            className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteLabel(label.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
{showBarcodeModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Generate Barcode
                </h2>
                <button
                  onClick={() => setShowBarcodeModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Generate a random EAN-13 barcode for your product label.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBarcodeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateBarcode}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}
{showToast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelGenerator;