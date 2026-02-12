/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, ExternalLink, Search, ArrowUpDown, ArrowUp, ArrowDown, Info, Heart, Tag } from "lucide-react"
import { IoIosMenu } from "react-icons/io"
import { useNavigate } from "react-router-dom"

// sidebar related import
import { trainingVideosData } from "../../utils/studio-states/training-states"
import { Toaster } from "react-hot-toast"

// Import marketplace data from states file
import { 
  defaultProducts, 
  defaultCategories, 
  defaultBrands,
  formatPrice, 
  calculateDiscountPercentage, 
  isOnSale 
} from "../../utils/studio-states/marketplace-states"


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
        className={`${isLocked ? 'bg-secondary' : 'bg-secondary hover:bg-secondary-hover'} text-white p-2 rounded-full transition-colors`}
        aria-label="Show product information"
      >
        <Info size={16} />
      </button>
      
      {isVisible && product.infoText && (
        <div 
          className="absolute top-full right-0 mt-2 w-64 bg-surface-hover border border-border rounded-xl shadow-lg z-50 p-3"
        >
          <div className="absolute -top-1.5 right-4 w-3 h-3 bg-surface-hover border-l border-t border-border rotate-45"></div>
          <p className="text-content-secondary text-sm leading-relaxed open_sans_font">{product.infoText}</p>
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
      <div className="bg-surface-card rounded-2xl w-full max-w-md mx-auto border border-border shadow-2xl">
        <div className="p-6">
          {/* Affiliate Notice Banner */}
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <div className="bg-primary rounded-full p-1.5 mt-0.5">
                <Info size={14} className="text-white" />
              </div>
              <div>
                <h4 className="text-primary font-semibold text-sm mb-1 oxanium_font">Affiliate Link</h4>
                <p className="text-primary/80 text-xs leading-relaxed open_sans_font">
                  This is an affiliate link. We may earn a small commission if you make a purchase through this link, at no additional cost to you.
                </p>
              </div>
            </div>
          </div>

          {/* External Link Warning */}
          <div className="text-center mb-6">
            <div className="bg-surface-dark rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ExternalLink size={28} className="text-content-secondary" />
            </div>
            <h3 className="text-xl font-bold text-content-primary mb-2 oxanium_font">You are leaving our site</h3>
            <p className="text-content-secondary text-sm leading-relaxed open_sans_font">
              You are about to be redirected to an external website. We are not responsible for the content, privacy policies, or practices of third-party websites.
            </p>
          </div>

          {/* Link Preview */}
          <div className="bg-surface-dark rounded-xl p-3 mb-6">
            <p className="text-content-faint text-xs mb-1">Destination:</p>
            <p className="text-secondary text-sm break-all truncate">{link}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-surface-button hover:bg-surface-button-hover text-content-primary py-3 px-4 rounded-xl font-medium transition-colors text-sm open_sans_font"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-xl font-medium transition-colors text-sm open_sans_font flex items-center justify-center gap-2"
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
      className="bg-surface-button hover:bg-surface-button-hover text-content-secondary p-2 rounded-full transition-colors"
      aria-label="Open product link (affiliate)"
    >
      <ExternalLink size={16} />
    </button>
  );
};

// Discount Badge Component
const DiscountBadge = ({ percentage }) => {
  return (
    <div className="absolute top-3 right-3 bg-secondary text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 z-10">
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
          <span className="text-lg font-bold text-secondary">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-sm text-content-faint line-through">
            {formatPrice(product.originalPrice, product.currency)}
          </span>
        </div>
        <span className="text-xs text-secondary font-medium open_sans_font">
          You save {formatPrice(product.originalPrice - product.price, product.currency)} ({discountPercentage}%)
        </span>
      </div>
    );
  }
  
  return (
    <p className="text-lg font-bold text-content-primary">
      {formatPrice(product.price, product.currency)}
    </p>
  );
};

// Product Card Component
const ProductCard = ({ product, isFavorite, toggleFavorite, openExternalLinkModal }) => {
  return (
    <div className="bg-surface-card rounded-2xl overflow-hidden relative select-none border border-border-subtle hover:border-border transition-colors">
      <div className="relative w-full h-48 bg-surface-dark">
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
              ? 'bg-primary hover:bg-primary-hover'
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

      <div className="p-4 bg-surface-card text-content-primary">
        <h3 className="text-base font-medium mb-1 open_sans_font text-content-primary">{product.name}</h3>
        <p className="text-sm text-content-secondary mb-1 open_sans_font">{product.brand}</p>
        <p className="text-sm text-content-faint mb-2 open_sans_font">Art. No: {product.articleNo}</p>
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
        className="px-3 sm:px-4 py-2 bg-surface-button text-content-secondary rounded-xl text-xs sm:text-sm hover:bg-surface-button-hover transition-colors flex items-center gap-2"
      >
        {getSortIcon()}
        <span className="hidden sm:inline">{currentSortLabel}</span>
      </button>

      {/* Sort Dropdown */}
      {showSortDropdown && (
        <div className="absolute top-full right-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
          <div className="py-1">
            <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">
              Sort by
            </div>
            {sortOptions.map((option) => {
              const isSelected = sortBy === option.value;
              const optionClasses = isSelected
                ? 'text-content-primary bg-surface-hover/80'
                : 'text-content-secondary hover:bg-surface-hover';
              
              return (
                <button
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSortOptionClick(option.value);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${optionClasses}`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className="text-content-muted">
                      {sortDirection === 'asc' 
                        ? <ArrowUp size={14} /> 
                        : <ArrowDown size={14} />
                      }
                    </span>
                  )}
                </button>
              );
            })}
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
      <div className="min-h-screen rounded-3xl bg-surface-base text-content-primary lg:p-3 md:p-3 sm:p-2 p-1 transition-all duration-500 ease-in-out flex-1">
        <div className="md:p-6 p-3">
          {/* Header with title, sort (mobile) */}
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-content-primary oxanium_font text-xl md:text-2xl">Marketplace</h1>
              {/* Sort button - visible on mobile only */}
              <div className="sm:hidden">
                <SortDropdown />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-faint" size={16} />
              <input
                type="text"
                placeholder="Search by name, brand or article number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-card outline-none text-sm text-content-primary rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-border focus:border-primary transition-colors placeholder-content-faint"
              />
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap gap-1.5 sm:gap-3 mb-6 items-center">
            {/* All filter */}
            <button
              onClick={() => {
                setShowFavoritesOnly(false);
                setShowSaleOnly(false);
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                !showFavoritesOnly && !showSaleOnly
                  ? "bg-primary text-white"
                  : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
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
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                showSaleOnly
                  ? "bg-secondary text-white"
                  : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
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
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                showFavoritesOnly
                  ? "bg-primary text-white"
                  : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
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
                      className={`text-content-faint transition-transform duration-200 ${isFeaturedCollapsed ? '-rotate-90' : ''}`} 
                    />
                    <h2 className="text-lg font-semibold text-content-primary group-hover:text-content-secondary transition-colors oxanium_font">Featured</h2>
                    <span className="text-sm text-content-faint">({featuredProducts.length})</span>
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
                      className={`text-content-faint transition-transform duration-200 ${isMoreCollapsed ? '-rotate-90' : ''}`} 
                    />
                    <h2 className="text-lg font-semibold text-content-primary group-hover:text-content-secondary transition-colors oxanium_font">More Products</h2>
                    <span className="text-sm text-content-faint">({allProducts.length})</span>
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
              <p className="text-content-faint text-lg open_sans_font">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-card rounded-xl w-full max-w-md mx-auto border border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-content-primary oxanium_font">Product Information</h2>
                <button
                  onClick={closeInfoModal}
                  className="text-content-faint hover:text-content-secondary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-content-primary mb-2 open_sans_font">{productForInfo.productName || productForInfo.name}</h3>
                <p className="text-content-secondary text-sm mb-1 open_sans_font">Brand: {productForInfo.brandName || productForInfo.brand}</p>
                <p className="text-content-faint text-sm mb-3 open_sans_font">Article No: {productForInfo.articleNo}</p>

                {productForInfo.infoText ? (
                  <div className="bg-surface-dark rounded-lg p-4">
                    <p className="text-content-secondary text-sm leading-relaxed open_sans_font">{productForInfo.infoText}</p>
                  </div>
                ) : (
                  <div className="bg-surface-dark rounded-lg p-4 text-center">
                    <p className="text-content-faint text-sm open_sans_font">No additional information available</p>
                    <button
                      onClick={() => {
                        closeInfoModal();
                        openEditModal(productForInfo);
                      }}
                      className="text-secondary hover:text-secondary-hover text-sm mt-2 transition-colors"
                    >
                      Add information
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeInfoModal}
                  className="flex-1 bg-surface-button hover:bg-surface-button-hover text-content-primary text-sm py-3 px-4 rounded-xl font-medium transition-colors open_sans_font"
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