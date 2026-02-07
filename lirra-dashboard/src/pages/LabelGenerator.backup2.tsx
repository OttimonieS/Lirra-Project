import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  Palette,
  Type,
  Image as ImageIcon,
  Maximize2,
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
} from "lucide-react";
import {
  templates,
  colorOptions,
  fontOptions,
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
  color: string;
  font: string;
  timestamp: number;
}

const LabelGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedFont, setSelectedFont] = useState("modern-sans");
  const [labelSize, setLabelSize] = useState("medium");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [savedLabels, setSavedLabels] = useState<SavedLabel[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [gridLines, setGridLines] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Load saved labels from localStorage
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

  const handleSaveLabel = () => {
    const newLabel: SavedLabel = {
      id: crypto.randomUUID(),
      name: formData.productName || "Untitled Label",
      data: formData,
      template: selectedTemplate,
      color: selectedColor,
      font: selectedFont,
      timestamp: Date.now(),
    };

    const updated = [newLabel, ...savedLabels].slice(0, 10); // Keep only last 10
    setSavedLabels(updated);
    localStorage.setItem("savedLabels", JSON.stringify(updated));
    showSuccessToast("Label saved to history!");
  };

  const handleLoadLabel = (label: SavedLabel) => {
    setFormData(label.data);
    setSelectedTemplate(label.template);
    setSelectedColor(label.color);
    setSelectedFont(label.font);
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
      showSuccessToast("Label reset successfully!");
    }
  };

  const handleGenerateBarcode = () => {
    // Generate random 13-digit EAN-13 barcode
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

  const handleExport = (format: string) => {
    showSuccessToast(`Exporting as ${format.toUpperCase()}...`);
    // Export logic would go here
  };

  const getTemplateStyles = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    const color = colorOptions.find((c) => c.id === selectedColor);
    return {
      template: template?.preview || templates[0].preview,
      colorClass: color?.className || colorOptions[0].className,
    };
  };

  const getSizeClass = () => {
    switch (labelSize) {
      case "small":
        return "max-w-xs";
      case "large":
        return "max-w-2xl";
      default:
        return "max-w-md";
    }
  };

  const { template, colorClass } = getTemplateStyles();

  return (
    <div className="p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Label Generator
              </h1>
              <p className="text-gray-600">
                Create professional product labels with AI-powered design tools
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

        {/* Quick Actions Bar */}
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
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="mr-2" size={18} />
                Select Template
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
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

            {/* Logo Upload */}
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
            </div>

            {/* Color & Font */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Customization
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette size={16} className="inline mr-2" />
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`w-10 h-10 ${
                          color.className
                        } rounded-lg border-2 transition-all ${
                          selectedColor === color.id
                            ? "border-gray-900 scale-110"
                            : "border-gray-300 hover:scale-105"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Type size={16} className="inline mr-2" />
                    Font Style
                  </label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Label Dimensions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Ruler className="mr-2" size={18} />
                Label Size
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
                  </select>
                </div>
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

            {/* Basic Fields */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Fields Toggle */}
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

          {/* Live Preview */}
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

              {/* Preview Canvas */}
              <div
                className={`border-2 border-gray-300 rounded-lg p-8 bg-gray-50 overflow-auto ${
                  gridLines ? "bg-grid-pattern" : ""
                }`}
                style={{
                  backgroundImage: gridLines
                    ? "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)"
                    : "none",
                  backgroundSize: "20px 20px",
                }}
              >
                <div className="flex items-center justify-center min-h-[600px]">
                  <div
                    className={`${getSizeClass()} mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all`}
                    style={{
                      transform: `scale(${zoom / 100}) ${
                        orientation === "landscape" ? "rotate(90deg)" : ""
                      }`,
                      transformOrigin: "center",
                    }}
                  >
                    {/* Header Section */}
                    <div className={`${template} p-6 text-white`}>
                      <div className="text-center">
                        {logoImage ? (
                          <img
                            src={logoImage}
                            alt="Logo"
                            className="w-16 h-16 object-contain mx-auto mb-3 bg-white rounded-full p-2"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <ImageIcon size={24} className="text-white/50" />
                          </div>
                        )}
                        <h4 className="text-2xl font-bold">
                          {formData.productName || "Product Name"}
                        </h4>
                        {formData.subtitle && (
                          <p className="text-sm opacity-90 mt-1">
                            {formData.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                      {formData.ingredients && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            INGREDIENTS
                          </p>
                          <p className="text-sm text-gray-700">
                            {formData.ingredients}
                          </p>
                        </div>
                      )}

                      {formData.allergens && (
                        <div>
                          <p className="text-xs font-semibold text-red-600 mb-1">
                            ALLERGEN INFO
                          </p>
                          <p className="text-sm text-gray-700">
                            {formData.allergens}
                          </p>
                        </div>
                      )}

                      {formData.nutritionFacts && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            NUTRITION FACTS
                          </p>
                          <p className="text-sm text-gray-700">
                            {formData.nutritionFacts}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                        {formData.netWeight && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600">
                              NET WT
                            </p>
                            <p className="text-gray-900">
                              {formData.netWeight}
                            </p>
                          </div>
                        )}
                        {formData.bestBefore && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600">
                              BEST BEFORE
                            </p>
                            <p className="text-gray-900">
                              {new Date(
                                formData.bestBefore
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {formData.barcode && (
                        <div className="pt-2 border-t">
                          <div className="bg-white border border-gray-300 p-2 rounded text-center">
                            <div className="flex justify-center gap-1 mb-1">
                              {formData.barcode.split("").map((digit, i) => (
                                <div
                                  key={i}
                                  className="w-1 h-12 bg-gray-900"
                                ></div>
                              ))}
                            </div>
                            <p className="text-xs font-mono">
                              {formData.barcode}
                            </p>
                          </div>
                        </div>
                      )}

                      {formData.manufacturer && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            {formData.manufacturer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
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

        {/* History Modal */}
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

        {/* Barcode Generator Modal */}
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

        {/* Toast Notification */}
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
