/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { X, Upload, Trash2, Link, Image } from 'lucide-react';
import LanguageTabs, { LANGUAGES, emptyTranslations } from '../../shared/LanguageTabs';
import { useTranslation } from 'react-i18next';

const ProductModal = ({ isOpen, onClose, editingProduct, formData, setFormData, handleInputChange, handleImageUpload, handleRemovePicture, handleSubmit, triggerFileInput, fileInputRef }) => {
  const { t, i18n } = useTranslation();
  const [formLang, setFormLang] = useState("en");
  const [priceDisplay, setPriceDisplay] = useState("");

  if (!isOpen) return null;

  // Format price for display based on current language
  const formatPriceForDisplay = (value) => {
    if (!value && value !== 0) return ""
    return Number(value).toLocaleString(i18n.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Parse locale-formatted price string to number
  const parsePriceInput = (input) => {
    if (!input) return ""
    // Replace comma with dot for parsing (handles both DE "29,99" and EN "29.99")
    const cleaned = input.replace(/[^\d,.]/g, "").replace(",", ".")
    return cleaned
  }

  const handlePriceChange = (e) => {
    const raw = e.target.value
    setPriceDisplay(raw)
    const parsed = parsePriceInput(raw)
    handleInputChange({ target: { name: "price", value: parsed } })
  }

  const handlePriceFocus = () => {
    // Show raw number on focus for easy editing
    setPriceDisplay(formData.price ? String(formData.price).replace(".", i18n.language === "en" ? "." : ",") : "")
  }

  const handlePriceBlur = () => {
    // Format on blur
    const num = parseFloat(parsePriceInput(priceDisplay))
    if (!isNaN(num)) {
      setPriceDisplay(formatPriceForDisplay(num))
    }
  }

  const currentLangLabel = t(`languages.${formLang}`);
  const mp = "admin.marketplace.modal";

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
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center sm:p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:mx-auto h-[92vh] sm:h-auto sm:max-h-[85vh] overflow-y-auto custom-scrollbar border-t sm:border border-[#333333] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-[#1C1C1C] z-10 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-[#333333] flex-shrink-0 rounded-t-2xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {editingProduct ? t(`${mp}.titleEdit`) : t(`${mp}.titleAdd`)}
            </h2>
            <button
              onClick={() => { onClose(); setFormLang("en"); }}
              className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-[#2F2F2F] rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 flex-1 overflow-y-auto">
          {/* Language Tabs */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">{t(`${mp}.language`)}</label>
            <LanguageTabs
              selectedLang={formLang}
              onSelect={setFormLang}
              translations={typeof formData.productName === "object" ? formData.productName : undefined}
            />
            {formLang !== "en" && (
              <p className="text-xs text-gray-500 mt-1.5">
                {t(`${mp}.langHint`, { language: currentLangLabel })}
              </p>
            )}
          </div>

          {/* Picture Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">{t(`${mp}.productPicture`)}</label>
            <div className="relative w-full h-36 sm:h-44 bg-[#2a2a2a] rounded-2xl overflow-hidden border-2 border-dashed border-[#444444] hover:border-gray-500 transition-colors group">
              {formData.picturePreview ? (
                <>
                  <img src={formData.picturePreview} alt="Product preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={triggerFileInput} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-xl transition-colors" title={t(`${mp}.changePicture`)}>
                      <Upload size={18} />
                    </button>
                    <button type="button" onClick={handleRemovePicture} className="bg-red-500/30 hover:bg-red-500/50 backdrop-blur-sm text-white p-3 rounded-xl transition-colors" title={t(`${mp}.removePicture`)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" onClick={triggerFileInput} className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <div className="bg-[#3a3a3a] p-3 rounded-xl"><Image size={24} className="text-gray-400" /></div>
                  <span className="text-gray-400 text-sm font-medium">{t(`${mp}.clickToUpload`)}</span>
                  <span className="text-gray-600 text-xs">{t(`${mp}.imageFormats`)}</span>
                </button>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="product-image-upload" ref={fileInputRef} />
            </div>
          </div>

          <div className="space-y-4">
            {/* Brand Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t(`${mp}.brandName`)}</label>
              <input type="text" name="brandName" value={formData.brandName} onChange={handleInputChange} required className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2.5 sm:py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors" placeholder={t(`${mp}.brandNamePlaceholder`)} />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t(`${mp}.productName`)} {formLang === "en" ? "*" : `(${currentLangLabel})`}
              </label>
              <input
                type="text"
                value={typeof formData.productName === "object" ? (formData.productName?.[formLang] || "") : formData.productName}
                onChange={(e) => handleTranslatedField("productName", e.target.value)}
                required={formLang === "en"}
                className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2.5 sm:py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors"
                placeholder={
                  formLang === "en"
                    ? t(`${mp}.productNamePlaceholder`)
                    : typeof formData.productName === "object" && formData.productName?.en
                      ? t(`${mp}.translationFor`, { name: formData.productName.en })
                      : t(`${mp}.enterTranslation`)
                }
              />
              {formLang !== "en" && typeof formData.productName === "object" && formData.productName?.en && (
                <p className="text-xs text-gray-600 mt-1">🇬🇧 {formData.productName.en}</p>
              )}
            </div>

            {/* Article No & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t(`${mp}.articleNo`)}</label>
                <input type="text" name="articleNo" value={formData.articleNo} onChange={handleInputChange} required className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2.5 sm:py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors" placeholder={t(`${mp}.articleNoPlaceholder`)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t(`${mp}.price`)}</label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="price"
                  value={priceDisplay || (formData.price ? formatPriceForDisplay(formData.price) : "")}
                  onChange={handlePriceChange}
                  onFocus={handlePriceFocus}
                  onBlur={handlePriceBlur}
                  required
                  className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2.5 sm:py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors"
                  placeholder={t(`${mp}.pricePlaceholder`)}
                />
              </div>
            </div>

            {/* Product Link */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t(`${mp}.productLink`)}</label>
              <div className="relative">
                <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="url" name="link" value={formData.link} onChange={handleInputChange} className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2.5 sm:py-3 pl-10 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors" placeholder={t(`${mp}.productLinkPlaceholder`)} />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t(`${mp}.productInfo`)} {formLang !== "en" ? `(${currentLangLabel})` : ""}
              </label>
              <textarea
                value={typeof formData.infoText === "object" ? (formData.infoText?.[formLang] || "") : formData.infoText}
                onChange={(e) => handleTranslatedField("infoText", e.target.value)}
                rows="3"
                className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2.5 sm:py-3 text-white placeholder-gray-500 outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors resize-none"
                placeholder={
                  formLang === "en"
                    ? t(`${mp}.productInfoPlaceholder`)
                    : typeof formData.infoText === "object" && formData.infoText?.en
                      ? t(`${mp}.productInfoTranslationPlaceholder`)
                      : t(`${mp}.enterTranslation`)
                }
              />
              {formLang !== "en" && typeof formData.infoText === "object" && formData.infoText?.en && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">🇬🇧 {formData.infoText.en}</p>
              )}
            </div>

            {/* Active/Inactive Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-[#333333]">
              <div>
                <label htmlFor="isActive" className="text-sm font-medium text-gray-300">{t(`${mp}.productStatus`)}</label>
                <p className="text-xs text-gray-500">{t(`${mp}.productStatusHelp`)}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm text-gray-300">{formData.isActive ? t('common.active') : t('common.inactive')}</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => { onClose(); setFormLang("en"); }} className="flex-1 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white py-3 px-4 rounded-xl font-medium transition-colors text-sm">
              {t("common.cancel")}
            </button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2">
              {editingProduct ? t(`${mp}.updateProduct`) : (<><FaPlus size={12} /><span>{t("admin.marketplace.addProduct")}</span></>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
