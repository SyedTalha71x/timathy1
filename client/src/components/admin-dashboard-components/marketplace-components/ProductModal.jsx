/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { FaPlus } from 'react-icons/fa';

const ProductModal = ({ isOpen, onClose, editingProduct, formData, handleInputChange, handleImageUpload, handleRemovePicture, handleSubmit, triggerFileInput, fileInputRef }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-lg w-full max-w-md mx-auto max-h-[80vh] custom-scrollbar overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-white">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Picture Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Product Picture
              </label>
              <div className="flex flex-col items-start space-y-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-600/40 flex items-center justify-center">
                  {formData.picturePreview ? (
                    <img
                      src={formData.picturePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-2xl">📷</div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-upload"
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 transition-colors text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
                  >
                    Upload Picture
                  </button>

                  {formData.picturePreview && (
                    <button
                      type="button"
                      onClick={handleRemovePicture}
                      className="bg-gray-600 hover:bg-gray-700 transition-colors text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#FF6B35] transition-colors"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#FF6B35] transition-colors"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Article No
                </label>
                <input
                  type="text"
                  name="articleNo"
                  value={formData.articleNo}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#FF6B35] transition-colors"
                  placeholder="Enter article number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#FF6B35] transition-colors"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#FF6B35] transition-colors"
                  placeholder="https://example.com/product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Info
                </label>
                <textarea
                  name="infoText"
                  value={formData.infoText}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#FF6B35] transition-colors resize-none"
                  placeholder="Add additional information about the product..."
                />
              </div>

              {/* Active/Inactive Toggle - Updated with proper toggle styling */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div>
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                    Product Status
                  </label>
                  <p className="text-xs text-gray-500">Toggle to activate/deactivate product</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm text-gray-300">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 text-sm hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {editingProduct ? (
                  'Update Product'
                ) : (
                  <>
                    <FaPlus size={14} />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;