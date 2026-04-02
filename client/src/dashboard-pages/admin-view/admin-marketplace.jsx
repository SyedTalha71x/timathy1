/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import toast from "../../components/shared/SharedToast"
import { FaInfoCircle, FaThumbtack, FaPlus } from 'react-icons/fa';
import { ChevronDown, Search, ArrowUpDown, ArrowUp, ArrowDown, Info, ExternalLink, Plus } from 'lucide-react';

import ProductModal from '../../components/admin-dashboard-components/marketplace-components/ProductModal';
import DeleteModal from '../../components/shared/DeleteModal';
import ProductInfoModal from '../../components/admin-dashboard-components/marketplace-components/ProductInfoModal';
import { getTranslation, emptyTranslations } from '../../components/shared/LanguageTabs';

import { useTranslation } from "react-i18next"
import { haptic } from "../../utils/haptic"
import PullToRefresh from "../../components/shared/PullToRefresh"
import {
  initialProducts,
} from "../../utils/admin-panel-states/marketplace-states";

// ─── Admin Product Card ──────────────────────────────────────────────────────
const AdminProductCard = ({ product, onEdit, onDelete, onTogglePin, onToggleStatus, onInfo }) => {
  const { t, i18n } = useTranslation()
  const productName = getTranslation(product.productName, "en");
  const formattedPrice = Number(product.price).toLocaleString(i18n.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className={`bg-surface-button rounded-2xl overflow-hidden relative select-none ${!product.isActive ? 'opacity-60' : ''}`}>
      {/* Image Area */}
      <div className="relative w-full h-48 bg-white">
        {product.picture ? (
          <img
            src={product.picture}
            alt={productName}
            className="object-cover w-full h-full pointer-events-none"
            draggable="false"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-content-muted text-4xl bg-gray-100">📷</div>
        )}

        {/* Bottom action buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={() => onTogglePin(product.id)}
            className={`p-2 rounded-full transition-colors ${
              product.isPinned 
                ? 'bg-primary hover:bg-primary-hover text-white' 
                : 'bg-black/50 hover:bg-black/70 text-white'
            }`}
            title={product.isPinned ? t('admin.marketplace.card.unpinProduct') : t('admin.marketplace.card.pinProduct')}
          >
            <FaThumbtack size={14} />
          </button>

          <button onClick={() => onInfo(product)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors" title={t('admin.marketplace.card.viewInfo')}>
            <Info size={16} />
          </button>

          <button onClick={() => onEdit(product)} className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors" title={t('admin.marketplace.card.editProduct')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button onClick={() => onDelete(product)} className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors" title={t('admin.marketplace.card.deleteProduct')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 bg-surface-button text-white">
        <h3 className="text-base font-medium truncate mb-1">{productName}</h3>
        <p className="text-sm text-content-secondary mb-1">{product.brandName}</p>
        <p className="text-sm text-content-muted mb-2">{t("admin.marketplace.card.articleNo")}: {product.articleNo}</p>
        <p className="text-lg font-bold text-white">{formattedPrice}</p>

        {/* Translation status indicator */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-content-faint text-xs mr-1">{t("admin.marketplace.card.translations")}:</span>
          {["en", "de", "fr", "it", "es"].map((lang) => (
            <span
              key={lang}
              title={`${lang.toUpperCase()}: ${typeof product.productName === "object" && product.productName[lang]?.trim() ? "✓" : "—"}`}
              className={`w-2 h-2 rounded-full ${
                typeof product.productName === "object" && product.productName[lang]?.trim()
                  ? "bg-green-500"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Active/Inactive Toggle */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
          <span className="text-sm text-content-secondary">{t("admin.marketplace.card.status")}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={product.isActive}
              onChange={() => onToggleStatus(product.id)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-content-secondary">
              {product.isActive ? t('common.active') : t('common.inactive')}
            </span>
          </label>
        </div>

        {product.link && (
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm mt-3 truncate">
            <ExternalLink size={14} />
            <span className="truncate">{t("admin.marketplace.card.viewProduct")}</span>
          </a>
        )}
      </div>
    </div>
  );
};

// ─── Main Marketplace Component ──────────────────────────────────────────────
const Marketplace = () => {
  const { t } = useTranslation()

  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productForInfo, setProductForInfo] = useState(null);
  const [formData, setFormData] = useState({
    brandName: '',
    productName: emptyTranslations(),
    articleNo: '',
    price: '',
    link: '',
    picture: null,
    picturePreview: '',
    infoText: emptyTranslations(),
    isActive: true
  });

  const fileInputRef = useRef(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Sort state
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('all');

  // Section collapse states
  const [isFeaturedCollapsed, setIsFeaturedCollapsed] = useState(false);
  const [isMoreCollapsed, setIsMoreCollapsed] = useState(false);

  // Sort options
  const sortOptions = [
    { value: 'name', label: t('admin.marketplace.sort.name') },
    { value: 'price', label: t('admin.marketplace.sort.price') },
    { value: 'brand', label: t('admin.marketplace.sort.brand') },
    { value: 'articleNo', label: t('admin.marketplace.sort.articleNo') },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || t('common.sortBy');

  const getSortIcon = () => {
    if (sortDirection === 'asc') return <ArrowUp size={14} />;
    if (sortDirection === 'desc') return <ArrowDown size={14} />;
    return <ArrowUpDown size={14} />;
  };

  const handleSortOptionClick = (value) => {
    if (value === sortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortDirection('asc');
    }
  };

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // ─── Filter products (search across ALL languages) ──────────────────────────
  const getFilteredProducts = () => {
    const query = searchQuery.toLowerCase();

    let filtered = products.filter((product) => {
      // Search productName across all languages
      const nameMatch = typeof product.productName === "string"
        ? product.productName.toLowerCase().includes(query)
        : Object.values(product.productName || {}).some(v => v?.toLowerCase().includes(query));

      const brandMatch = product.brandName?.toLowerCase().includes(query);
      const articleMatch = product.articleNo?.toLowerCase().includes(query);

      // Search infoText across all languages
      const infoMatch = typeof product.infoText === "string"
        ? product.infoText?.toLowerCase().includes(query)
        : Object.values(product.infoText || {}).some(v => v?.toLowerCase().includes(query));

      return nameMatch || brandMatch || articleMatch || infoMatch;
    });

    if (filterStatus === 'active') {
      filtered = filtered.filter(p => p.isActive);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(p => !p.isActive);
    } else if (filterStatus === 'pinned') {
      filtered = filtered.filter(p => p.isPinned);
    }

    return filtered;
  };

  // ─── Sort products ──────────────────────────────────────────────────────────
  const sortProducts = (productsToSort) => {
    return [...productsToSort].sort((a, b) => {
      let aValue, bValue;

      if (sortBy === 'price') {
        aValue = parseFloat(a.price) || 0;
        bValue = parseFloat(b.price) || 0;
      } else if (sortBy === 'name') {
        aValue = getTranslation(a.productName, "en").toLowerCase();
        bValue = getTranslation(b.productName, "en").toLowerCase();
      } else if (sortBy === 'brand') {
        aValue = a.brandName.toLowerCase();
        bValue = b.brandName.toLowerCase();
      } else if (sortBy === 'articleNo') {
        aValue = a.articleNo.toLowerCase();
        bValue = b.articleNo.toLowerCase();
      }

      if (sortDirection === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      }
      return 0;
    });
  };

  const filtered = getFilteredProducts();
  const sortedProducts = sortProducts(filtered);

  const featuredProducts = sortedProducts.filter(p => p.isPinned);
  const allProducts = sortedProducts.filter(p => !p.isPinned);

  const activeCount = products.filter(p => p.isActive).length;
  const inactiveCount = products.filter(p => !p.isActive).length;
  const pinnedCount = products.filter(p => p.isPinned).length;
  // ─── Modal handlers ─────────────────────────────────────────────────────────

  const openAddModal = () => {
    haptic.light()
    setEditingProduct(null);
    setFormData({
      brandName: '',
      productName: emptyTranslations(),
      articleNo: '',
      price: '',
      link: '',
      picture: null,
      picturePreview: '',
      infoText: emptyTranslations(),
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    haptic.light()
    setEditingProduct(product);
    setFormData({
      brandName: product.brandName,
      productName: typeof product.productName === "string"
        ? { ...emptyTranslations(), en: product.productName }
        : { ...emptyTranslations(), ...product.productName },
      articleNo: product.articleNo,
      price: product.price,
      link: product.link,
      picture: null,
      picturePreview: product.picture || '',
      infoText: typeof product.infoText === "string"
        ? { ...emptyTranslations(), en: product.infoText }
        : { ...emptyTranslations(), ...product.infoText },
      isActive: product.isActive
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (product) => {
    haptic.warning()
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openInfoModal = (product) => {
    setProductForInfo(product);
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setProductForInfo(null);
    setIsInfoModalOpen(false);
  };

  const togglePinProduct = (productId) => {
    haptic.light()
    setProducts(products.map(product =>
      product.id === productId ? { ...product, isPinned: !product.isPinned } : product
    ));
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(product.isPinned ? t('admin.marketplace.toast.unpinned') : t('admin.marketplace.toast.pinned'));
    }
  };

  const toggleProductStatus = (productId) => {
    haptic.light()
    setProducts(products.map(product =>
      product.id === productId ? { ...product, isActive: !product.isActive } : product
    ));
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(product.isActive ? t('admin.marketplace.toast.deactivated') : t('admin.marketplace.toast.activated'));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, picture: file, picturePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePicture = () => {
    setFormData(prev => ({ ...prev, picture: null, picturePreview: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      brandName: formData.brandName,
      productName: typeof formData.productName === "object" ? { ...formData.productName } : { ...emptyTranslations(), en: formData.productName },
      articleNo: formData.articleNo,
      price: formData.price,
      link: formData.link,
      picture: formData.picturePreview || (editingProduct ? editingProduct.picture : ''),
      infoText: typeof formData.infoText === "object" ? { ...formData.infoText } : { ...emptyTranslations(), en: formData.infoText },
      isPinned: editingProduct ? editingProduct.isPinned : false,
      isActive: formData.isActive
    };

    if (editingProduct) {
      setProducts(products.map(product =>
        product.id === editingProduct.id ? { ...productData, id: editingProduct.id } : product
      ));
      toast.success(t('admin.marketplace.toast.updated'));
    } else {
      const newProduct = { ...productData, id: Date.now().toString() };
      setProducts([...products, newProduct]);
      toast.success(t('admin.marketplace.toast.added'));
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      haptic.success()
      setProducts(products.filter(product => product.id !== productToDelete.id));
      closeDeleteModal();
      toast.success(t('admin.marketplace.toast.deleted'));
    }
  };

  // ─── Sort Dropdown Component ────────────────────────────────────────────────
  const SortDropdown = ({ className = "" }) => (
    <div className={`relative ${className}`} ref={sortDropdownRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); }}
        className="px-3 sm:px-4 py-2 bg-surface-button text-content-secondary rounded-xl text-xs sm:text-sm hover:bg-surface-button-hover transition-colors flex items-center gap-2"
      >
        {getSortIcon()}
        <span className="hidden sm:inline">{currentSortLabel}</span>
      </button>

      {showSortDropdown && (
        <div className="absolute top-full right-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
          <div className="py-1">
            <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">{t("common.sortBy")}</div>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${
                  sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-content-secondary'
                }`}
              >
                <span>{option.label}</span>
                {sortBy === option.value && (
                  <span className="text-content-muted">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
<div className={`
        min-h-screen rounded-3xl bg-surface-base text-white lg:p-3 md:p-3 sm:p-2 p-1
        transition-all duration-500 ease-in-out flex-1
        
      `}>
        <div className="md:p-6 p-3">
          {/* Header */}
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-white oxanium_font text-xl md:text-2xl">{t("admin.marketplace.title")}</h1>
              <div className="sm:hidden"><SortDropdown /></div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button onClick={openAddModal} className="bg-primary hover:bg-primary-hover text-white px-4 sm:px-6 py-2 cursor-pointer rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 text-sm">
                <FaPlus size={14} />
                <span>{t("admin.marketplace.addProduct")}</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              <input
                type="text"
                placeholder={t("admin.marketplace.search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-card outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-border focus:border-[#3F74FF] transition-colors"
              />
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            <button onClick={() => setFilterStatus('all')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatus === 'all' ? "bg-blue-600 text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>
              {t("admin.marketplace.filter.all")} ({products.length})
            </button>
            <button onClick={() => setFilterStatus(filterStatus === 'active' ? 'all' : 'active')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${filterStatus === 'active' ? "bg-green-600 text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>
              <span className={`w-2 h-2 rounded-full ${filterStatus === 'active' ? 'bg-white' : 'bg-green-500'}`}></span>
              {t("admin.marketplace.filter.active")} ({activeCount})
            </button>
            <button onClick={() => setFilterStatus(filterStatus === 'inactive' ? 'all' : 'inactive')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${filterStatus === 'inactive' ? "bg-red-600 text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>
              <span className={`w-2 h-2 rounded-full ${filterStatus === 'inactive' ? 'bg-white' : 'bg-red-500'}`}></span>
              {t("admin.marketplace.filter.inactive")} ({inactiveCount})
            </button>
            <button onClick={() => setFilterStatus(filterStatus === 'pinned' ? 'all' : 'pinned')} className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${filterStatus === 'pinned' ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>
              <FaThumbtack size={12} className={filterStatus === 'pinned' ? "text-white" : ""} />
              {t("admin.marketplace.filter.pinned")} ({pinnedCount})
            </button>
            <div className="ml-auto hidden sm:block"><SortDropdown /></div>
          </div>

          {/* Products Display */}
          <PullToRefresh onRefresh={async () => { haptic.success() }} className="flex-1 overflow-y-auto">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-content-muted text-lg mb-4">{t("admin.marketplace.empty.noProducts")}</p>
              <button onClick={openAddModal} className="bg-primary hover:bg-primary-hover text-sm text-white px-6 py-2 rounded-xl flex items-center gap-2 mx-auto">
                <FaPlus size={14} />
                <span>{t("admin.marketplace.addProduct")}</span>
              </button>
            </div>
          ) : filterStatus === 'all' && !searchQuery ? (
            <>
              {featuredProducts.length > 0 && (
                <div className="mb-8">
                  <button onClick={() => setIsFeaturedCollapsed(!isFeaturedCollapsed)} className="flex items-center gap-2 mb-4 group cursor-pointer">
                    <ChevronDown size={20} className={`text-content-muted transition-transform duration-200 ${isFeaturedCollapsed ? '-rotate-90' : ''}`} />
                    <h2 className="text-lg font-semibold text-white group-hover:text-content-secondary transition-colors">{t("admin.marketplace.sections.featured")}</h2>
                    <span className="text-sm text-content-muted">({featuredProducts.length})</span>
                  </button>
                  {!isFeaturedCollapsed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {featuredProducts.map((product) => (
                        <AdminProductCard key={product.id} product={product} onEdit={openEditModal} onDelete={openDeleteModal} onTogglePin={togglePinProduct} onToggleStatus={toggleProductStatus} onInfo={openInfoModal} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {allProducts.length > 0 && (
                <div>
                  <button onClick={() => setIsMoreCollapsed(!isMoreCollapsed)} className="flex items-center gap-2 mb-4 group cursor-pointer">
                    <ChevronDown size={20} className={`text-content-muted transition-transform duration-200 ${isMoreCollapsed ? '-rotate-90' : ''}`} />
                    <h2 className="text-lg font-semibold text-white group-hover:text-content-secondary transition-colors">{t("admin.marketplace.sections.moreProducts")}</h2>
                    <span className="text-sm text-content-muted">({allProducts.length})</span>
                  </button>
                  {!isMoreCollapsed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {allProducts.map((product) => (
                        <AdminProductCard key={product.id} product={product} onEdit={openEditModal} onDelete={openDeleteModal} onTogglePin={togglePinProduct} onToggleStatus={toggleProductStatus} onInfo={openInfoModal} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {sortedProducts.map((product) => (
                  <AdminProductCard key={product.id} product={product} onEdit={openEditModal} onDelete={openDeleteModal} onTogglePin={togglePinProduct} onToggleStatus={toggleProductStatus} onInfo={openInfoModal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-content-muted text-lg">
                  {filterStatus === 'active' ? t("admin.marketplace.empty.noActive")
                    : filterStatus === 'inactive' ? t("admin.marketplace.empty.noInactive")
                    : filterStatus === 'pinned' ? t("admin.marketplace.empty.noPinned")
                    : t("admin.marketplace.empty.noSearch")}
                </p>
              </div>
            )
          )}
          </PullToRefresh>
        </div>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={openAddModal}
        className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
        aria-label={t("admin.marketplace.addProduct")}
      >
        <Plus size={22} />
      </button>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        handleRemovePicture={handleRemovePicture}
        handleSubmit={handleSubmit}
        triggerFileInput={triggerFileInput}
        fileInputRef={fileInputRef}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title={t("admin.marketplace.deleteModal.title")}
        message={t("admin.marketplace.deleteModal.message", { name: productToDelete ? getTranslation(productToDelete.productName, "en") : '' })}
      />
      <ProductInfoModal isOpen={isInfoModalOpen} onClose={closeInfoModal} productForInfo={productForInfo} onEditClick={openEditModal} />
    </>
  );
};

export default Marketplace;
