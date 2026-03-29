/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import LanguageTabs, { getTranslation } from '../../shared/LanguageTabs';

const ProductInfoModal = ({ isOpen, onClose, productForInfo, onEditClick }) => {
  const [viewLang, setViewLang] = useState("en");

  if (!isOpen) return null;

  const productName = getTranslation(productForInfo?.productName, viewLang);
  const infoText = getTranslation(productForInfo?.infoText, viewLang);
  const hasInfoText = infoText?.trim();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center sm:p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:mx-auto max-h-[85vh] overflow-y-auto border-t sm:border border-[#333333] shadow-2xl">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">Product Information</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#2F2F2F] rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Language Tabs */}
          <div className="mb-4">
            <LanguageTabs
              selectedLang={viewLang}
              onSelect={setViewLang}
              translations={productForInfo?.productName}
            />
          </div>

          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{productName}</h3>
            <p className="text-gray-400 text-sm mb-1">Brand: {productForInfo?.brandName}</p>
            <p className="text-gray-400 text-sm mb-1">Article No: {productForInfo?.articleNo}</p>
            <p className="text-gray-400 text-sm mb-3">
              Status:{' '}
              <span className={productForInfo?.isActive ? 'text-green-400' : 'text-red-400'}>
                {productForInfo?.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>

            {hasInfoText ? (
              <div className="bg-[#101010] rounded-xl p-4">
                <p className="text-gray-300 text-sm leading-relaxed">{infoText}</p>
                {viewLang !== "en" && typeof productForInfo?.infoText === "object" && !productForInfo.infoText[viewLang]?.trim() && (
                  <p className="text-xs text-gray-600 mt-2 italic">Showing English fallback</p>
                )}
              </div>
            ) : (
              <div className="bg-[#101010] rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm">No additional information available</p>
                <button
                  onClick={() => { onClose(); onEditClick(productForInfo); }}
                  className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                >
                  Add information
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { onClose(); onEditClick(productForInfo); }}
              className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-sm text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Edit Product
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-[#2F2F2F] text-sm hover:bg-[#3F3F3F] text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoModal;
