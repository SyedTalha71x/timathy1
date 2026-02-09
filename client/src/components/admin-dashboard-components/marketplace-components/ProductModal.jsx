/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { X, Upload, Trash2, Link, Image } from 'lucide-react';
import LanguageTabs, { LANGUAGES, emptyTranslations } from '../shared/LanguageTabs';

const ProductModal = ({ isOpen, onClose, editingProduct, formData, setFormData, handleInputChange, handleImageUpload, handleRemovePicture, handleSubmit, triggerFileInput, fileInputRef }) => {
  const [formLang, setFormLang] = useState("en");

  if (!isOpen) return null;

  const currentLangLabel = LANGUAGES.find((l) => l.code === formLang)?.fullLabel || "English";

  // Helper to update a translated field (productName / infoText)
  const handleTranslatedField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(typeof prev[field] === "object" ? prev[field] : emptyTranslations()),
        [formLang]: value,
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md mx-auto max-h-[85vh] custom-scrollbar overflow-y-auto border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#1C1C1C] z-10 px-6 pt-6 pb-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={() => { onClose(); setFormLang("en"); }}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#2F2F2F] rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
          {/* Language Tabs */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <LanguageTabs
              selectedLang={formLang}
              onSelect={setFormLang}
              translations={typeof formData.productName === "object" ? formData.productName : undefined}
            />
            {formLang !== "en" && (
              <p className="text-xs text-gray-500 mt-1.5">
                English is required. {currentLangLabel} is optional.
              </p>
            )}
          </div>

          {/* Picture Upload — language-independent */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Product Picture</label>
            <div className="relative w-full h-44 bg-[#2a2a2a] rounded-2xl overflow-hidden border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors group">
              {formData.picturePreview ? (
                <>
                  <img src={formData.picturePreview} alt="Product preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={triggerFileInput} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-xl transition-colors" title="Change picture">
                      <Upload size={18} />
                    </button>
                    <button type="button" onClick={handleRemovePicture} className="bg-red-500/30 hover:bg-red-500/50 backdrop-blur-sm text-white p-3 rounded-xl transition-colors" title="Remove picture">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" onClick={triggerFileInput} className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <div className="bg-[#3a3a3a] p-3 rounded-xl"><Image size={24} className="text-gray-400" /></div>
                  <span className="text-gray-400 text-sm font-medium">Click to upload image</span>
                  <span className="text-gray-600 text-xs">PNG, JPG, WEBP</span>
                </button>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="product-image-upload" ref={fileInputRef} />
            </div>
          </div>

          <div className="space-y-4">
            {/* Brand Name — language-independent */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
              <input type="text" name="brandName" value={formData.brandName} onChange={handleInputChange} required className="w-full bg-[#141414] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors" placeholder="Enter brand name" />
            </div>

            {/* Product Name — translated */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Name {formLang === "en" ? "*" : `(${currentLangLabel})`}
              </label>
              <input
                type="text"
                value={typeof formData.productName === "object" ? (formData.productName?.[formLang] || "") : formData.productName}
                onChange={(e) => handleTranslatedField("productName", e.target.value)}
                required={formLang === "en"}
                className="w-full bg-[#141414] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors"
                placeholder={
                  formLang === "en"
                    ? "Enter product name"
                    : typeof formData.productName === "object" && formData.productName?.en
                      ? `Translation for: "${formData.productName.en}"`
                      : "Enter translation..."
                }
              />
              {formLang !== "en" && typeof formData.productName === "object" && formData.productName?.en && (
                <p className="text-xs text-gray-600 mt-1">🇬🇧 {formData.productName.en}</p>
              )}
            </div>

            {/* Article No & Price — language-independent */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Article No</label>
                <input type="text" name="articleNo" value={formData.articleNo} onChange={handleInputChange} required className="w-full bg-[#141414] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors" placeholder="e.g. 555088-101" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" className="w-full bg-[#141414] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors" placeholder="0.00" />
              </div>
            </div>

            {/* Product Link — language-independent */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Product Link</label>
              <div className="relative">
                <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="url" name="link" value={formData.link} onChange={handleInputChange} className="w-full bg-[#141414] text-sm rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors" placeholder="https://example.com/product" />
              </div>
            </div>

            {/* Product Info — translated */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Info {formLang !== "en" ? `(${currentLangLabel})` : ""}
              </label>
              <textarea
                value={typeof formData.infoText === "object" ? (formData.infoText?.[formLang] || "") : formData.infoText}
                onChange={(e) => handleTranslatedField("infoText", e.target.value)}
                rows="3"
                className="w-full bg-[#141414] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors resize-none"
                placeholder={
                  formLang === "en"
                    ? "Add additional information about the product..."
                    : typeof formData.infoText === "object" && formData.infoText?.en
                      ? "Enter translation for the product info..."
                      : "Enter translation..."
                }
              />
              {formLang !== "en" && typeof formData.infoText === "object" && formData.infoText?.en && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">🇬🇧 {formData.infoText.en}</p>
              )}
            </div>

            {/* Active/Inactive Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div>
                <label htmlFor="isActive" className="text-sm font-medium text-gray-300">Product Status</label>
                <p className="text-xs text-gray-500">Toggle to activate/deactivate product</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm text-gray-300">{formData.isActive ? 'Active' : 'Inactive'}</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => { onClose(); setFormLang("en"); }} className="flex-1 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white py-3 px-4 rounded-xl font-medium transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2">
              {editingProduct ? 'Update Product' : (<><FaPlus size={12} /><span>Add Product</span></>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
