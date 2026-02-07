import { useState, useRef } from "react";
import {
  Upload,
  Download,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Zap,
  Eye,
  Settings,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileImage,
  Grid3x3,
  List,
} from "lucide-react";

interface Photo {
  id: string;
  name: string;
  originalFile: File;
  originalUrl: string;
  processedUrl: string | null;
  status: "pending" | "processing" | "processed" | "error";
  errorMessage?: string;
  thumbnail: string;
}

interface EnhancementSettings {
  removeBackground: boolean;
  enhanceLighting: boolean;
  colorCorrection: boolean;
  addShadow: boolean;
  backgroundStyle: string;
  exportSize: string;
  customWidth: number;
  customHeight: number;
}

const CatalogEnhancer = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSettings, setShowSettings] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<EnhancementSettings>({
    removeBackground: true,
    enhanceLighting: true,
    colorCorrection: true,
    addShadow: false,
    backgroundStyle: "white",
    exportSize: "square",
    customWidth: 1080,
    customHeight: 1080,
  });

  // API Keys
  const REMOVE_BG_API_KEY = "mUamGxMMbwCyM9VtxnPyxpwp";

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      showSuccessToast("Please select image files only");
      return;
    }

    const newPhotos: Photo[] = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      status: "pending",
      thumbnail: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    showSuccessToast(`${imageFiles.length} photo(s) added!`);
  };

  const removeBackground = async (imageUrl: string): Promise<string> => {
    const formData = new FormData();
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    formData.append("image_file", blob);
    formData.append("size", "auto");

    const result = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
      },
      body: formData,
    });

    if (!result.ok) {
      throw new Error("Background removal failed");
    }

    const resultBlob = await result.blob();
    return URL.createObjectURL(resultBlob);
  };

  const applyClientSideEnhancements = async (
    imageUrl: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Apply resize based on export size
        if (settings.exportSize === "1:1") {
          width = height = Math.min(width, height);
        } else if (settings.exportSize === "4:5") {
          const targetRatio = 4 / 5;
          if (width / height > targetRatio) {
            width = height * targetRatio;
          } else {
            height = width / targetRatio;
          }
        } else if (settings.exportSize === "16:9") {
          const targetRatio = 16 / 9;
          if (width / height > targetRatio) {
            height = width / targetRatio;
          } else {
            width = height * targetRatio;
          }
        } else if (settings.exportSize === "custom") {
          width = settings.customWidth;
          height = settings.customHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Apply background
        if (settings.backgroundStyle !== "transparent") {
          if (settings.backgroundStyle === "white") {
            ctx.fillStyle = "#ffffff";
          } else if (settings.backgroundStyle === "gradient") {
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, "#f3f4f6");
            gradient.addColorStop(1, "#e5e7eb");
            ctx.fillStyle = gradient;
          } else if (settings.backgroundStyle === "brand") {
            ctx.fillStyle = "#3b82f6";
          }
          ctx.fillRect(0, 0, width, height);
        }

        // Draw image centered
        const scale = Math.min(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;

        // Apply enhancements via canvas filters
        const filters = [];
        if (settings.enhanceLighting)
          filters.push("brightness(1.1) contrast(1.05)");
        if (settings.colorCorrection) filters.push("saturate(1.15)");
        if (settings.addShadow)
          filters.push("drop-shadow(0 10px 30px rgba(0,0,0,0.15))");

        ctx.filter = filters.join(" ");
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error("Failed to create blob"));
          }
        }, "image/png");
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageUrl;
    });
  };

  const processPhoto = async (photo: Photo) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, status: "processing" } : p))
    );

    try {
      let processedUrl = photo.originalUrl;

      // Step 1: Remove background if enabled
      if (settings.removeBackground) {
        processedUrl = await removeBackground(photo.originalUrl);
      }

      // Step 2: Apply client-side enhancements (lighting, color, sizing, background)
      const enhancedUrl = await applyClientSideEnhancements(processedUrl);

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? { ...p, status: "processed", processedUrl: enhancedUrl }
            : p
        )
      );

      return true;
    } catch (err) {
      console.error("Processing error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Processing failed. Please try again.";
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? {
                ...p,
                status: "error",
                errorMessage,
              }
            : p
        )
      );
      return false;
    }
  };

  const handleEnhanceAll = async () => {
    const pendingPhotos = photos.filter((p) => p.status === "pending");

    if (pendingPhotos.length === 0) {
      showSuccessToast("No photos to process");
      return;
    }

    setIsProcessing(true);
    showSuccessToast(`Processing ${pendingPhotos.length} photo(s)...`);

    let successCount = 0;
    for (const photo of pendingPhotos) {
      const success = await processPhoto(photo);
      if (success) successCount++;
    }

    setIsProcessing(false);
    showSuccessToast(
      `✅ ${successCount} of ${pendingPhotos.length} photo(s) processed successfully!`
    );
  };

  const handleEnhanceSingle = async (photo: Photo) => {
    setIsProcessing(true);
    await processPhoto(photo);
    setIsProcessing(false);
    showSuccessToast("Photo processed successfully!");
  };

  const handleDownload = async (photo: Photo) => {
    if (!photo.processedUrl) return;

    try {
      const response = await fetch(photo.processedUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `enhanced-${photo.name}`;
      link.click();
      URL.revokeObjectURL(url);
      showSuccessToast("Downloaded successfully!");
    } catch {
      showSuccessToast("Download failed. Please try again.");
    }
  };

  const handleDownloadAll = async () => {
    const processedPhotos = photos.filter((p) => p.processedUrl);

    if (processedPhotos.length === 0) {
      showSuccessToast("No processed photos to download");
      return;
    }

    showSuccessToast("Downloading all photos...");

    for (const photo of processedPhotos) {
      await handleDownload(photo);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    showSuccessToast(`Downloaded ${processedPhotos.length} photo(s)!`);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    showSuccessToast("Photo removed");
  };

  const handlePreview = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowPreview(true);
  };

  return (
    <div className="p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Catalog Enhancer
              </h1>
              <p className="text-gray-600">
                AI-powered product photo enhancement for e-commerce
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                {viewMode === "grid" ? (
                  <List size={20} />
                ) : (
                  <Grid3x3 size={20} />
                )}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Settings size={20} className="mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="bg-white p-8 rounded-xl shadow-sm border-2 border-dashed border-gray-300 mb-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="text-center">
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop photos here or click to upload
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Support for JPG, PNG. Max 10MB per file. Multiple files supported.
            </p>
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Select Files
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Enhancement Options Panel */}
          {showSettings && (
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="mr-2" size={18} />
                    AI Enhancement
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.removeBackground}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            removeBackground: e.target.checked,
                          })
                        }
                        className="mr-3 w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-gray-700">
                        Remove Background
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.enhanceLighting}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            enhanceLighting: e.target.checked,
                          })
                        }
                        className="mr-3 w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-gray-700">
                        Auto Lighting
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.colorCorrection}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            colorCorrection: e.target.checked,
                          })
                        }
                        className="mr-3 w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-gray-700">
                        Color Correction
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.addShadow}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            addShadow: e.target.checked,
                          })
                        }
                        className="mr-3 w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-gray-700">Add Shadow</span>
                    </label>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Background Style
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() =>
                        setSettings({ ...settings, backgroundStyle: "white" })
                      }
                      className={`aspect-square bg-white border-2 ${
                        settings.backgroundStyle === "white"
                          ? "border-primary"
                          : "border-gray-300"
                      } rounded-lg hover:border-primary transition-colors`}
                    ></button>
                    <button
                      onClick={() =>
                        setSettings({ ...settings, backgroundStyle: "gray" })
                      }
                      className={`aspect-square bg-gray-100 border-2 ${
                        settings.backgroundStyle === "gray"
                          ? "border-primary"
                          : "border-gray-300"
                      } rounded-lg hover:border-primary transition-colors`}
                    ></button>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          backgroundStyle: "gradient",
                        })
                      }
                      className={`aspect-square bg-gradient-to-br from-blue-100 to-purple-100 border-2 ${
                        settings.backgroundStyle === "gradient"
                          ? "border-primary"
                          : "border-gray-300"
                      } rounded-lg hover:border-primary transition-colors`}
                    ></button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Export Size
                  </h4>
                  <select
                    value={settings.exportSize}
                    onChange={(e) =>
                      setSettings({ ...settings, exportSize: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary mb-3"
                  >
                    <option value="square">1:1 Square (1080x1080)</option>
                    <option value="portrait">4:5 Portrait (1080x1350)</option>
                    <option value="landscape">
                      16:9 Landscape (1920x1080)
                    </option>
                    <option value="custom">Custom Size</option>
                  </select>

                  {settings.exportSize === "custom" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Width (px)
                        </label>
                        <input
                          type="number"
                          value={settings.customWidth}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              customWidth: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Height (px)
                        </label>
                        <input
                          type="number"
                          value={settings.customHeight}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              customHeight: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleEnhanceAll}
                  disabled={isProcessing || photos.length === 0}
                  className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} className="mr-2" />
                      Enhance All (
                      {photos.filter((p) => p.status === "pending").length})
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          <div className={showSettings ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900">
                  Photos ({photos.length})
                </h3>
                <button
                  onClick={handleDownloadAll}
                  disabled={photos.filter((p) => p.processedUrl).length === 0}
                  className="text-primary hover:text-primary-hover font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={20} className="mr-2" />
                  Download All
                </button>
              </div>

              {photos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileImage size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No photos uploaded yet</p>
                  <p className="text-sm mt-2">Upload photos to get started</p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-4"
                  }
                >
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div
                        className={`bg-gray-100 relative ${
                          viewMode === "grid" ? "aspect-square" : "w-32 h-32"
                        }`}
                      >
                        <img
                          src={photo.processedUrl || photo.thumbnail}
                          alt={photo.name}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => handlePreview(photo)}
                        />
                        {photo.status === "processing" && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <Loader2
                              className="animate-spin text-white"
                              size={32}
                            />
                          </div>
                        )}
                        {photo.status === "processed" && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                            <CheckCircle2 size={14} className="mr-1" />
                            Ready
                          </div>
                        )}
                        {photo.status === "error" && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            Error
                          </div>
                        )}
                      </div>
                      <div
                        className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}
                      >
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {photo.name}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {photo.status === "pending" && (
                            <button
                              onClick={() => handleEnhanceSingle(photo)}
                              disabled={isProcessing}
                              className="flex-1 text-sm bg-primary text-white px-3 py-1.5 rounded hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                              <Zap size={14} className="mr-1" />
                              Enhance
                            </button>
                          )}
                          {photo.status === "processed" && (
                            <button
                              onClick={() => handleDownload(photo)}
                              className="flex-1 text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                            >
                              <Download size={14} className="mr-1" />
                              Download
                            </button>
                          )}
                          <button
                            onClick={() => handlePreview(photo)}
                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && selectedPhoto && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-4xl w-full p-6 max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPhoto.name}
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Original
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={selectedPhoto.originalUrl}
                      alt="Original"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Enhanced
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {selectedPhoto.processedUrl ? (
                      <img
                        src={selectedPhoto.processedUrl}
                        alt="Enhanced"
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="aspect-square flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <ImageIcon size={48} className="mx-auto mb-2" />
                          <p>Not processed yet</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedPhoto.processedUrl && (
                <button
                  onClick={() => handleDownload(selectedPhoto)}
                  className="w-full mt-6 bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Download size={20} className="mr-2" />
                  Download Enhanced Image
                </button>
              )}
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

export default CatalogEnhancer;
