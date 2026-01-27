/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, ExternalLink, Search, ArrowUpDown, ArrowUp, ArrowDown, Info, Heart, Tag } from "lucide-react"
import { IoIosMenu } from "react-icons/io"
import { useNavigate } from "react-router-dom"

// sidebar related import
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import { Toaster } from "react-hot-toast"

// Import marketplace data from states file
import { 
  defaultProducts, 
  defaultCategories, 
  defaultBrands,
  formatPrice, 
  calculateDiscountPercentage, 
  isOnSale 
} from "../../utils/user-panel-states/marketplace-states"


// Info Tooltip Component with hover and click support
const InfoTooltip = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const containerRef = useRef(null);
  const isHoveringRef = useRef(false);
  const hideTimeoutRef = useRef(null);

  // Handle scroll to dismiss locked tooltip
  useEffect(() => {
    const handleScroll = () => {
      if (isLocked) {
        setIsLocked(false);
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isLocked]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLocked && 
          containerRef.current && 
          !containerRef.current.contains(event.target)) {
        setIsLocked(false);
        setIsVisible(false);
      }
    };

    if (isLocked) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocked]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (!isLocked) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    if (!isLocked) {
      // Small delay to allow moving to tooltip
      hideTimeoutRef.current = setTimeout(() => {
        if (!isLocked && !isHoveringRef.current) {
          setIsVisible(false);
        }
      }, 150);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isLocked) {
      setIsLocked(false);
      setIsVisible(false);
    } else {
      setIsLocked(true);
      setIsVisible(true);
    }
  };

  return (
    <div 
      className="relative" 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        className={`${isLocked ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-2 rounded-full transition-colors`}
        aria-label="Show product information"
      >
        <Info size={16} />
      </button>
      
      {isVisible && product.infoText && (
        <div 
          className="absolute top-full right-0 mt-2 w-64 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-lg z-50 p-3"
        >
          <div className="absolute -top-1.5 right-4 w-3 h-3 bg-[#1C1C1C] border-l border-t border-gray-700 rotate-45"></div>
          <p className="text-gray-300 text-sm leading-relaxed">{product.infoText}</p>
        </div>
      )}
    </div>
  );
};

// External Link Confirmation Modal
const ExternalLinkModal = ({ isOpen, onClose, link }) => {
  if (!isOpen) return null;

  const handleContinue = () => {
    window.open(link, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md mx-auto border border-gray-700 shadow-2xl">
        <div className="p-6">
          {/* Affiliate Notice Banner */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <div className="bg-orange-500 rounded-full p-1.5 mt-0.5">
                <Info size={14} className="text-white" />
              </div>
              <div>
                <h4 className="text-orange-400 font-semibold text-sm mb-1">Affiliate Link</h4>
                <p className="text-orange-300/80 text-xs leading-relaxed">
                  This is an affiliate link. We may earn a small commission if you make a purchase through this link, at no additional cost to you.
                </p>
              </div>
            </div>
          </div>

          {/* External Link Warning */}
          <div className="text-center mb-6">
            <div className="bg-[#2a2a2a] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ExternalLink size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You are leaving our site</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              You are about to be redirected to an external website. We are not responsible for the content, privacy policies, or practices of third-party websites.
            </p>
          </div>

          {/* Link Preview */}
          <div className="bg-[#101010] rounded-xl p-3 mb-6">
            <p className="text-gray-500 text-xs mb-1">Destination:</p>
            <p className="text-blue-400 text-sm break-all truncate">{link}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white py-3 px-4 rounded-xl font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2"
            >
              Continue
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Affiliate Link Button - opens confirmation modal
const AffiliateLinkButton = ({ link, onOpenModal }) => {
  return (
    <button
      onClick={() => onOpenModal(link)}
      className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
      aria-label="Open product link (affiliate)"
    >
      <ExternalLink size={16} />
    </button>
  );
};

// Discount Badge Component
const DiscountBadge = ({ percentage }) => {
  return (
    <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 z-10">
      <Tag size={12} />
      -{percentage}%
    </div>
  );
};

// Price Display Component with sale formatting
const PriceDisplay = ({ product }) => {
  const hasDiscount = isOnSale(product);
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(product.originalPrice, product.price) : 0;
  
  if (hasDiscount) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-400">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(product.originalPrice, product.currency)}
          </span>
        </div>
        <span className="text-xs text-blue-400 font-medium">
          You save {formatPrice(product.originalPrice - product.price, product.currency)} ({discountPercentage}%)
        </span>
      </div>
    );
  }
  
  return (
    <p className="text-lg font-bold text-white">
      {formatPrice(product.price, product.currency)}
    </p>
  );
};

// Product Card Component
const ProductCard = ({ product, isFavorite, toggleFavorite, openExternalLinkModal }) => {
  return (
    <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden relative select-none">
      <div className="relative w-full h-48 bg-white">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="object-cover w-full h-full pointer-events-none"
          draggable="false"
        />

        {/* Discount Badge - top right corner of image */}
        {isOnSale(product) && (
          <DiscountBadge percentage={calculateDiscountPercentage(product.originalPrice, product.price)} />
        )}

        {/* Favorite button - top left */}
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`absolute top-3 left-3 p-2 rounded-full transition-colors ${
            isFavorite
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-black/50 hover:bg-black/70'
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={16} 
            className={isFavorite ? "fill-white text-white" : "text-white"} 
          />
        </button>

        {/* Bottom-right action buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <InfoTooltip product={product} />
          <AffiliateLinkButton link={product.link} onOpenModal={openExternalLinkModal} />
        </div>
      </div>

      <div className="p-4 bg-[#2a2a2a] text-white">
        <h3 className="text-base font-medium mb-1">{product.name}</h3>
        <p className="text-sm text-gray-300 mb-1">{product.brand}</p>
        <p className="text-sm text-gray-400 mb-2">Art. No: {product.articleNo}</p>
        <PriceDisplay product={product} />
      </div>
    </div>
  );
};


export default function MarketplacePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const trainingVideos = trainingVideosData

  // Products state - initialized from states file
  const [products, setProducts] = useState(defaultProducts);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [productForInfo, setProductForInfo] = useState(null);

  // External link modal state
  const [isExternalLinkModalOpen, setIsExternalLinkModalOpen] = useState(false);
  const [externalLinkUrl, setExternalLinkUrl] = useState("");

  const openExternalLinkModal = (link) => {
    setExternalLinkUrl(link);
    setIsExternalLinkModalOpen(true);
  };

  const closeExternalLinkModal = () => {
    setIsExternalLinkModalOpen(false);
    setExternalLinkUrl("");
  };

  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('marketplaceFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Sale filter state
  const [showSaleOnly, setShowSaleOnly] = useState(false);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('marketplaceFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId) => favorites.includes(productId);

  // Sort options matching assessment style
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "brand", label: "Brand" },
    { value: "articleNo", label: "Article No." },
  ];

  // Get current sort label
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Sort";

  // Get sort icon based on current sort direction
  const getSortIcon = () => {
    if (sortDirection === 'asc') return <ArrowUp size={14} />;
    if (sortDirection === 'desc') return <ArrowDown size={14} />;
    return <ArrowUpDown size={14} />;
  };

  // Handle sort option click - don't close dropdown to allow toggling direction
  const handleSortOptionClick = (value) => {
    if (value === sortBy) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortDirection('asc');
    }
    // Don't close dropdown - let user click outside or toggle direction
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

  // Count sale items
  const saleItemsCount = products.filter(p => isOnSale(p)).length;

  const getFilteredProducts = () => {
    let filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.articleNo.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    
    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      filteredProducts = filteredProducts.filter(product => favorites.includes(product.id));
    }
    
    // Filter by sale items if enabled
    if (showSaleOnly) {
      filteredProducts = filteredProducts.filter(product => isOnSale(product));
    }
    
    return filteredProducts;
  }



  const sortProducts = (productsToSort) => {
    return [...productsToSort].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Special handling for price - use numeric price field
      if (sortBy === "price") {
        aValue = a.price;
        bValue = b.price;
      } else {
        // Normalize strings
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();
      }

      // Handle comparison based on direction
      if (sortDirection === "asc") {
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
  
  // Separate featured and all products
  const featuredProducts = sortedProducts.filter(product => product.pinned);
  const allProducts = sortedProducts.filter(product => !product.pinned);
  
  // Section collapse states
  const [isFeaturedCollapsed, setIsFeaturedCollapsed] = useState(false);
  const [isMoreCollapsed, setIsMoreCollapsed] = useState(false);

  const openInfoModal = (product) => {
    setProductForInfo(product);
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setProductForInfo(null);
  };

  const openEditModal = (product) => {
    // Implement or adapt your edit modal logic here
    console.log("Edit product:", product);
  };



  // Sort Dropdown Component for reuse
  const SortDropdown = ({ className = "" }) => (
    <div className={`relative ${className}`} ref={sortDropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowSortDropdown(!showSortDropdown);
        }}
        className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
      >
        {getSortIcon()}
        <span className="hidden sm:inline">{currentSortLabel}</span>
      </button>

      {/* Sort Dropdown */}
      {showSortDropdown && (
        <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
          <div className="py-1">
            <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
              Sort by
            </div>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSortOptionClick(option.value);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                  sortBy === option.value 
                    ? 'text-white bg-gray-800/50' 
                    : 'text-gray-300'
                }`}
              >
                <span>{option.label}</span>
                {sortBy === option.value && (
                  <span className="text-gray-400">
                    {sortDirection === 'asc' 
                      ? <ArrowUp size={14} /> 
                      : <ArrowDown size={14} />
                    }
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );


  return (
    <>
      <style>
        {`
          @keyframes wobble {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-1deg); }
            30% { transform: rotate(1deg); }
            45% { transform: rotate(-1deg); }
            60% { transform: rotate(1deg); }
            75% { transform: rotate(-1deg); }
            90% { transform: rotate(1deg); }
          }
          .animate-wobble {
            animation: wobble 0.5s ease-in-out infinite;
          }
          .dragging {
            opacity: 0.5;
            border: 2px dashed #fff;
          }
          .drag-over {
            border: 2px dashed #888;
          }
        `}
      </style>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white lg:p-3 md:p-3 sm:p-2 p-1 transition-all duration-500 ease-in-out flex-1">
        <div className="md:p-6 p-3">
          {/* Header with title, sort (mobile) */}
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Marketplace</h1>
              {/* Sort button - visible on mobile only */}
              <div className="sm:hidden">
                <SortDropdown />
              </div>
            </div>
          </div>

          {/* Search Bar - matching assessment.jsx style */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, brand or article number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
              />
            </div>
          </div>

          {/* Filter and Sort Controls - matching assessment.jsx style */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {/* All filter */}
            <button
              onClick={() => {
                setShowFavoritesOnly(false);
                setShowSaleOnly(false);
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                !showFavoritesOnly && !showSaleOnly
                  ? "bg-blue-600 text-white"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
              }`}
            >
              All
            </button>
            
            {/* Sale filter */}
            <button
              onClick={() => {
                setShowSaleOnly(!showSaleOnly);
                if (!showSaleOnly) setShowFavoritesOnly(false);
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${
                showSaleOnly
                  ? "bg-blue-600 text-white"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
              }`}
            >
              <Tag size={14} />
              Sale ({saleItemsCount})
            </button>
            
            {/* Favorites filter */}
            <button
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                if (!showFavoritesOnly) setShowSaleOnly(false);
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${
                showFavoritesOnly
                  ? "bg-orange-500 text-white"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
              }`}
            >
              <Heart size={14} className={showFavoritesOnly ? "fill-white" : ""} />
              Favorites ({favorites.length})
            </button>

            {/* Sort dropdown - hidden on mobile (shown in header instead) */}
            <div className="ml-auto hidden sm:block">
              <SortDropdown />
            </div>
          </div>

          {/* Show sections only when no filter is active */}
          {!showFavoritesOnly && !showSaleOnly ? (
            <>
              {/* Featured Products Section */}
              {featuredProducts.length > 0 && (
                <div className="mb-8">
                  <button 
                    onClick={() => setIsFeaturedCollapsed(!isFeaturedCollapsed)}
                    className="flex items-center gap-2 mb-4 group cursor-pointer"
                  >
                    <ChevronDown 
                      size={20} 
                      className={`text-gray-400 transition-transform duration-200 ${isFeaturedCollapsed ? '-rotate-90' : ''}`} 
                    />
                    <h2 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">Featured</h2>
                    <span className="text-sm text-gray-400">({featuredProducts.length})</span>
                  </button>
                  {!isFeaturedCollapsed && (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6`}>
                      {featuredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isFavorite={isFavorite(product.id)}
                          toggleFavorite={toggleFavorite}
                          openExternalLinkModal={openExternalLinkModal}
                          
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* More Products Section */}
              {allProducts.length > 0 && (
                <div>
                  <button 
                    onClick={() => setIsMoreCollapsed(!isMoreCollapsed)}
                    className="flex items-center gap-2 mb-4 group cursor-pointer"
                  >
                    <ChevronDown 
                      size={20} 
                      className={`text-gray-400 transition-transform duration-200 ${isMoreCollapsed ? '-rotate-90' : ''}`} 
                    />
                    <h2 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">More Products</h2>
                    <span className="text-sm text-gray-400">({allProducts.length})</span>
                  </button>
                  {!isMoreCollapsed && (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6`}>
                      {allProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isFavorite={isFavorite(product.id)}
                          toggleFavorite={toggleFavorite}
                          openExternalLinkModal={openExternalLinkModal}
                          
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Flat list when filter is active */
            sortedProducts.length > 0 && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6`}>
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={isFavorite(product.id)}
                    toggleFavorite={toggleFavorite}
                    openExternalLinkModal={openExternalLinkModal}
                    
                  />
                ))}
              </div>
            )
          )}

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {showFavoritesOnly 
                  ? "No favorites yet. Click the heart icon to add products to your favorites."
                  : showSaleOnly
                    ? "No sale items available at the moment."
                    : "No products found matching your search."
                }
              </p>
            </div>
          )}
        </div>


      </div>

      {isInfoModalOpen && productForInfo && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md mx-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Product Information</h2>
                <button
                  onClick={closeInfoModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{productForInfo.productName || productForInfo.name}</h3>
                <p className="text-gray-400 text-sm mb-1">Brand: {productForInfo.brandName || productForInfo.brand}</p>
                <p className="text-gray-400 text-sm mb-3">Article No: {productForInfo.articleNo}</p>

                {productForInfo.infoText ? (
                  <div className="bg-[#101010] rounded-lg p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{productForInfo.infoText}</p>
                  </div>
                ) : (
                  <div className="bg-[#101010] rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">No additional information available</p>
                    <button
                      onClick={() => {
                        closeInfoModal();
                        openEditModal(productForInfo);
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                    >
                      Add information
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">

                <button
                  onClick={closeInfoModal}
                  className="flex-1 bg-gray-600 text-sm hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* External Link Confirmation Modal */}
      <ExternalLinkModal
        isOpen={isExternalLinkModalOpen}
        onClose={closeExternalLinkModal}
        link={externalLinkUrl}
      />
    </>

  )
}
