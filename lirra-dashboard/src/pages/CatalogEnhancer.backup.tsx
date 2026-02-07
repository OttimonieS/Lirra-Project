import { useState } from "react";
import { Upload, Download, Trash2, Sparkles } from "lucide-react";

// Types
interface Photo {
  id: number;
  name: string;
  status: "pending" | "processing" | "processed";
  thumbnail: string;
}

interface EnhancementOption {
  id: string;
  label: string;
  defaultChecked: boolean;
}

interface BackgroundStyle {
  id: string;
  className: string;
  isActive: boolean;
}

interface ExportSize {
  id: string;
  label: string;
}

// Data
const initialPhotos: Photo[] = [
  {
    id: 1,
    name: "product-1.jpg",
    status: "processed",
    thumbnail: "https://placehold.co/200x200",
  },
  {
    id: 2,
    name: "product-2.jpg",
    status: "processing",
    thumbnail: "https://placehold.co/200x200",
  },
  {
    id: 3,
    name: "product-3.jpg",
    status: "pending",
    thumbnail: "https://placehold.co/200x200",
  },
];

const enhancementOptions: EnhancementOption[] = [
  { id: "remove-bg", label: "Remove Background", defaultChecked: true },
  { id: "enhance-lighting", label: "Enhance Lighting", defaultChecked: true },
  { id: "color-correction", label: "Color Correction", defaultChecked: true },
  { id: "add-shadow", label: "Add Shadow", defaultChecked: false },
];

const backgroundStyles: BackgroundStyle[] = [
  { id: "white", className: "bg-white", isActive: true },
  { id: "gray", className: "bg-gray-100", isActive: false },
  {
    id: "gradient",
    className: "bg-gradient-to-br from-blue-100 to-purple-100",
    isActive: false,
  },
];

const exportSizes: ExportSize[] = [
  { id: "square", label: "1:1 Square (1080x1080)" },
  { id: "portrait", label: "4:5 Portrait (1080x1350)" },
  { id: "landscape", label: "16:9 Landscape (1920x1080)" },
  { id: "custom", label: "Custom Size" },
];

const uploadConfig = {
  title: "Drop photos here or click to upload",
  description: "Support for JPG, PNG. Max 10MB per file.",
  buttonText: "Select Files",
};

// Components
const PageHeader = () => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalog Enhancer</h1>
    <p className="text-gray-600">
      Automatically enhance product photos for marketplaces
    </p>
  </div>
);

const UploadZone = () => (
  <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-dashed border-gray-300 mb-6 hover:border-primary hover:bg-primary-light transition-all">
    <div className="text-center">
      <Upload className="mx-auto text-gray-400 mb-4" size={48} />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {uploadConfig.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{uploadConfig.description}</p>
      <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors">
        {uploadConfig.buttonText}
      </button>
    </div>
  </div>
);

const EnhancementOptionsPanel = () => (
  <div className="lg:col-span-1">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Enhancement Options</h3>
      <div className="space-y-3">
        {enhancementOptions.map((option) => (
          <label key={option.id} className="flex items-center">
            <input
              type="checkbox"
              defaultChecked={option.defaultChecked}
              className="mr-3 w-4 h-4 text-primary"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      <hr className="my-4" />

      <h4 className="font-semibold text-gray-900 mb-3">Background Style</h4>
      <div className="grid grid-cols-3 gap-2">
        {backgroundStyles.map((style) => (
          <button
            key={style.id}
            className={`aspect-square ${style.className} border-2 ${
              style.isActive
                ? "border-primary"
                : "border-gray-300 hover:border-gray-400"
            } rounded-lg`}
          ></button>
        ))}
      </div>

      <hr className="my-4" />

      <h4 className="font-semibold text-gray-900 mb-3">Export Size</h4>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
        {exportSizes.map((size) => (
          <option key={size.id}>{size.label}</option>
        ))}
      </select>

      <button className="w-full mt-4 bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
        <Sparkles size={20} className="mr-2" />
        Enhance All
      </button>
    </div>
  </div>
);

const PhotoCard = ({ photo }: { photo: Photo }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
    <div className="aspect-square bg-gray-100 relative">
      <img
        src={photo.thumbnail}
        alt={photo.name}
        className="w-full h-full object-cover"
      />
      {photo.status === "processing" && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
        </div>
      )}
      {photo.status === "processed" && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
          ✓ Ready
        </div>
      )}
    </div>
    <div className="p-3">
      <p className="text-sm font-medium text-gray-900 truncate">{photo.name}</p>
      <div className="flex gap-2 mt-2">
        <button className="flex-1 text-sm bg-primary text-white px-3 py-1.5 rounded hover:bg-primary-hover transition-colors">
          Download
        </button>
        <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

const EmptyPhotoState = () => (
  <div className="text-center py-12 text-gray-500">
    <Upload size={48} className="mx-auto mb-3 text-gray-300" />
    <p>No photos uploaded yet</p>
  </div>
);

const PhotoGallery = ({ photos }: { photos: Photo[] }) => (
  <div className="lg:col-span-3">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">
          Processed Photos ({photos.length})
        </h3>
        <button className="text-primary hover:text-primary-hover font-medium flex items-center">
          <Download size={20} className="mr-2" />
          Download All
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>

      {photos.length === 0 && <EmptyPhotoState />}
    </div>
  </div>
);

const CatalogEnhancer = () => {
  const [photos] = useState<Photo[]>(initialPhotos);

  return (
    <div className="p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        <UploadZone />
        <div className="grid lg:grid-cols-4 gap-6">
          <EnhancementOptionsPanel />
          <PhotoGallery photos={photos} />
        </div>
      </div>
    </div>
  );
};

export default CatalogEnhancer;
