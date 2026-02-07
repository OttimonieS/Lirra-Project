import { useState } from "react";
import { Upload, Download, Palette, Type } from "lucide-react";
import {
  templates,
  colorOptions,
  fontOptions,
  exportFormats,
  previewData,
} from "../data/labelGeneratorData";

const LabelGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  return (
    <div className="p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Label Generator
          </h1>
          <p className="text-gray-600">
            Create professional product labels in minutes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Select Template
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? "border-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-full h-20 ${template.preview} rounded mb-2`}
                    ></div>
                    <p className="text-sm font-medium text-gray-900">
                      {template.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Upload Logo</h3>
              <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary hover:bg-primary-light transition-colors">
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-600">Click to upload logo</p>
              </button>
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
                        className={`w-10 h-10 ${color.className} rounded-lg border-2 border-gray-300 hover:scale-110 transition-transform`}
                      ></button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Type size={16} className="inline mr-2" />
                    Font Style
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    {fontOptions.map((font) => (
                      <option key={font.id}>{font.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Auto-generated Text */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Auto-generated Fields
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Chocolate Cake"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredients
                  </label>
                  <textarea
                    placeholder="Auto-generated from product database"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900">Live Preview</h3>
                <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                  <Download size={20} className="mr-2" />
                  Export Label
                </button>
              </div>

              {/* Preview Canvas */}
              <div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3"></div>
                      <h4 className="text-2xl font-bold">
                        {previewData.productName}
                      </h4>
                      <p className="text-sm opacity-90">
                        {previewData.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        INGREDIENTS
                      </p>
                      <p className="text-sm text-gray-700">
                        {previewData.ingredients}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-gray-600">
                          NET WT
                        </p>
                        <p className="text-gray-900">{previewData.netWeight}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">
                          BEST BEFORE
                        </p>
                        <p className="text-gray-900">
                          {previewData.bestBefore}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Export Options
                </p>
                <div className="flex gap-3">
                  {exportFormats.map((format) => (
                    <button
                      key={format.id}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelGenerator;
