/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, ExternalLink, Search, ArrowUpDown, ArrowUp, ArrowDown, Info, Heart } from "lucide-react"
import { IoIosMenu } from "react-icons/io"
import { useNavigate } from "react-router-dom"

// sidebar related import
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import EditTaskModal from "../../components/user-panel-components/todo-components/edit-task-modal"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import Sidebar from "../../components/central-sidebar"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import { Toaster } from "react-hot-toast"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"


const marketplaceProducts = [
  {
    id: 1,
    name: "Mens Jordan Trainer",
    brand: "JORDAN",
    articleNo: "456",
    price: "5,00 €",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV1xUYD-Gqa5d08aoyqp4g1i6vs4lySrH4cA&s",
    link: "https://example.com/product/1",
    pinned: true,
    infoText: "Premium basketball shoes with enhanced ankle support and cushioning. Made from breathable materials."
  },
  {
    id: 2,
    name: "Snickers Off-White 2024",
    brand: "NIKE",
    articleNo: "123",
    price: "5,00 €",
    image: "https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/105/365/563/original/1507255_01.jpg.jpeg?action=crop&width=750",
    link: "https://example.com/product/2",
    pinned: false,
    infoText: "Limited edition collaboration with Off-White. Features deconstructed design elements."
  },
  // Add more products with pinned and infoText fields as needed
];

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

// Affiliate Link Button with disclosure tooltip
const AffiliateLinkButton = ({ link }) => {
  const [showDisclosure, setShowDisclosure] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => window.open(link, "_blank")}
        onMouseEnter={() => setShowDisclosure(true)}
        onMouseLeave={() => setShowDisclosure(false)}
        className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
        aria-label="Open product link (affiliate)"
      >
        <ExternalLink size={16} />
      </button>
      
      {showDisclosure && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-lg z-50 p-2">
          <div className="absolute -top-1.5 right-4 w-3 h-3 bg-[#1C1C1C] border-l border-t border-gray-700 rotate-45"></div>
          <p className="text-gray-400 text-xs leading-relaxed">
            <span className="text-orange-500 font-medium">Affiliate Link</span> – We may earn a small commission on purchases.
          </p>
        </div>
      )}
    </div>
  );
};


export default function MarketplacePage() {
  const sidebarSystem = useSidebarSystem();
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const trainingVideos = trainingVideosData

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [productForInfo, setProductForInfo] = useState(null);

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


  const getFilteredProducts = () => {
    let products = marketplaceProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.articleNo.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    
    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      products = products.filter(product => favorites.includes(product.id));
    }
    
    return products;
  }



  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Special handling for price
      if (sortBy === "price") {
        const parsePrice = (priceStr) =>
          parseFloat(priceStr.replace("€", "").replace(",", ".").trim());
        aValue = parsePrice(aValue);
        bValue = parsePrice(bValue);
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


  // Extract all states and functions from the hook
  const {
    // States
    isRightSidebarOpen,
    isSidebarEditing,
    isRightWidgetModalOpen,
    openDropdownIndex,
    selectedMemberType,
    isChartDropdownOpen,
    isWidgetModalOpen,
    editingTask,
    todoFilter,
    isEditTaskModalOpen,
    isTodoFilterDropdownOpen,
    taskToCancel,
    taskToDelete,
    isBirthdayMessageModalOpen,
    selectedBirthdayPerson,
    birthdayMessage,
    activeNoteId,
    isSpecialNoteModalOpen,
    selectedAppointmentForNote,
    isTrainingPlanModalOpen,
    selectedUserForTrainingPlan,
    selectedAppointment,
    isEditAppointmentModalOpen,
    showAppointmentOptionsModal,
    showAppointmentModal,
    freeAppointments,
    selectedMember,
    isMemberOverviewModalOpen,
    isMemberDetailsModalOpen,
    activeMemberDetailsTab,
    isEditModalOpen,
    editModalTab,
    isNotifyMemberOpen,
    notifyAction,
    showHistoryModal,
    historyTab,
    memberHistory,
    currentBillingPeriod,
    tempContingent,
    selectedBillingPeriod,
    showAddBillingPeriodModal,
    newBillingPeriod,
    showContingentModal,
    editingRelations,
    newRelation,
    editForm,
    widgets,
    rightSidebarWidgets,
    notePopoverRef,

    // Setters
    setIsRightSidebarOpen,
    setIsSidebarEditing,
    setIsRightWidgetModalOpen,
    setOpenDropdownIndex,
    setSelectedMemberType,
    setIsChartDropdownOpen,
    setIsWidgetModalOpen,
    setEditingTask,
    setTodoFilter,
    setIsEditTaskModalOpen,
    setIsTodoFilterDropdownOpen,
    setTaskToCancel,
    setTaskToDelete,
    setIsBirthdayMessageModalOpen,
    setSelectedBirthdayPerson,
    setBirthdayMessage,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setShowAppointmentModal,
    setFreeAppointments,
    setSelectedMember,
    setIsMemberOverviewModalOpen,
    setIsMemberDetailsModalOpen,
    setActiveMemberDetailsTab,
    setIsEditModalOpen,
    setEditModalTab,
    setIsNotifyMemberOpen,
    setNotifyAction,
    setShowHistoryModal,
    setHistoryTab,
    setMemberHistory,
    setCurrentBillingPeriod,
    setTempContingent,
    setSelectedBillingPeriod,
    setShowAddBillingPeriodModal,
    setNewBillingPeriod,
    setShowContingentModal,
    setEditingRelations,
    setNewRelation,
    setEditForm,
    setWidgets,
    setRightSidebarWidgets,

    // Functions
    toggleRightSidebar,
    closeSidebar,
    toggleSidebarEditing,
    toggleDropdown,
    redirectToCommunication,
    moveRightSidebarWidget,
    removeRightSidebarWidget,
    getWidgetPlacementStatus,
    handleAddRightSidebarWidget,
    handleTaskComplete,
    handleEditTask,
    handleUpdateTask,
    handleCancelTask,
    handleDeleteTask,
    isBirthdayToday,
    handleSendBirthdayMessage,
    handleEditNote,
    handleDumbbellClick,
    handleCheckIn,
    handleAppointmentOptionsModal,
    handleSaveSpecialNote,
    isEventInPast,
    handleCancelAppointment,
    actuallyHandleCancelAppointment,
    handleDeleteAppointment,
    handleEditAppointment,
    handleCreateNewAppointment,
    handleViewMemberDetails,
    handleNotifyMember,
    calculateAge,
    isContractExpiringSoon,
    redirectToContract,
    handleCalendarFromOverview,
    handleHistoryFromOverview,
    handleCommunicationFromOverview,
    handleViewDetailedInfo,
    handleEditFromOverview,
    getMemberAppointments,
    handleManageContingent,
    getBillingPeriods,
    handleAddBillingPeriod,
    handleSaveContingent,
    handleInputChange,
    handleEditSubmit,
    handleAddRelation,
    handleDeleteRelation,
    handleArchiveMember,
    handleUnarchiveMember,
    truncateUrl,
    renderSpecialNoteIcon,

    // new states 
    customLinks, setCustomLinks, communications, setCommunications,
    todos, setTodos, expiringContracts, setExpiringContracts,
    birthdays, setBirthdays, notifications, setNotifications,
    appointments, setAppointments,
    memberContingentData, setMemberContingentData,
    memberRelations, setMemberRelations,

    memberTypes,
    availableMembersLeads,
    mockTrainingPlans,
    mockVideos,

    todoFilterOptions,
    relationOptions,
    appointmentTypes,

    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    setMemberTrainingPlans, availableTrainingPlans, setAvailableTrainingPlans
  } = sidebarSystem;


  // Wrapper functions to pass local state to hook functions
  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos);
  };

  const handleUpdateTaskWrapper = (updatedTask) => {
    handleUpdateTask(updatedTask, setTodos);
  };

  const handleCancelTaskWrapper = (taskId) => {
    handleCancelTask(taskId, setTodos);
  };

  const handleDeleteTaskWrapper = (taskId) => {
    handleDeleteTask(taskId, setTodos);
  };

  const handleEditNoteWrapper = (appointmentId, currentNote) => {
    handleEditNote(appointmentId, currentNote, appointments);
  };

  const handleCheckInWrapper = (appointmentId) => {
    handleCheckIn(appointmentId, appointments, setAppointments);
  };

  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => {
    handleSaveSpecialNote(appointmentId, updatedNote, setAppointments);
  };

  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => {
    actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments);
  };

  const handleDeleteAppointmentWrapper = (id) => {
    handleDeleteAppointment(id, appointments, setAppointments);
  };


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
      <div className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white lg:p-3 md:p-3 sm:p-2 p-1
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen
          ? 'lg:mr-86 mr-0'
          : 'mr-0'
        }
    `}>
        <div className="md:p-6 p-3">
          <div className="flex justify-between items-center w-full mb-6">

            <h1 className="text-white oxanium_font text-xl md:text-2xl">Marketplace</h1>

            {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className=" ">
              <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
            </div>
            ) : (<div onClick={toggleRightSidebar} className=" ">
              <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
            </div>
            )}
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
            {/* All / Favorites filter */}
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                !showFavoritesOnly
                  ? "bg-blue-600 text-white"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setShowFavoritesOnly(true)}
              className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${
                showFavoritesOnly
                  ? "bg-orange-500 text-white"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
              }`}
            >
              <Heart size={14} className={showFavoritesOnly ? "fill-white" : ""} />
              Favorites ({favorites.length})
            </button>

            {/* Sort dropdown */}
            <div className="ml-auto relative" ref={sortDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSortDropdown(!showSortDropdown);
                }}
                className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
              >
                {getSortIcon()}
                <span>{currentSortLabel}</span>
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
          </div>


          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-6`}>
            {sortedProducts.map((product) => (
              <div key={product.id} className="bg-[#2a2a2a] rounded-2xl overflow-hidden relative">
              

                <div className="relative w-full h-48 bg-white">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />

                  {/* Favorite button - top left */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`absolute top-3 left-3 p-2 rounded-full transition-colors ${
                      isFavorite(product.id)
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-black/50 hover:bg-black/70'
                    }`}
                    aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart 
                      size={16} 
                      className={isFavorite(product.id) ? "fill-white text-white" : "text-white"} 
                    />
                  </button>

                  {/* Top-right action buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {/* Info Tooltip Component */}
                    <InfoTooltip product={product} />

                    {/* Affiliate Link Button with disclosure */}
                    <AffiliateLinkButton link={product.link} />
                  </div>
                </div>

                <div className="p-4 bg-[#2a2a2a] text-white">
                  <h3 className="text-base font-medium mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-300 mb-1">{product.brand}</p>
                  <p className="text-sm text-gray-400 mb-2">Art. No: {product.articleNo}</p>
                  <p className="text-lg font-bold text-white">{product.price}</p>
                </div>
              </div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {showFavoritesOnly 
                  ? "No favorites yet. Click the heart icon to add products to your favorites."
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

      <Sidebar
        isRightSidebarOpen={isRightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
        isSidebarEditing={isSidebarEditing}
        toggleSidebarEditing={toggleSidebarEditing}
        rightSidebarWidgets={rightSidebarWidgets}
        moveRightSidebarWidget={moveRightSidebarWidget}
        removeRightSidebarWidget={removeRightSidebarWidget}
        setIsRightWidgetModalOpen={setIsRightWidgetModalOpen}
        communications={communications}
        redirectToCommunication={redirectToCommunication}
        todos={todos}
        handleTaskComplete={handleTaskCompleteWrapper}
        todoFilter={todoFilter}
        setTodoFilter={setTodoFilter}
        todoFilterOptions={todoFilterOptions}
        isTodoFilterDropdownOpen={isTodoFilterDropdownOpen}
        setIsTodoFilterDropdownOpen={setIsTodoFilterDropdownOpen}
        openDropdownIndex={openDropdownIndex}
        toggleDropdown={toggleDropdown}
        handleEditTask={handleEditTask}
        setTaskToCancel={setTaskToCancel}
        setTaskToDelete={setTaskToDelete}
        birthdays={birthdays}
        isBirthdayToday={isBirthdayToday}
        handleSendBirthdayMessage={handleSendBirthdayMessage}
        customLinks={customLinks}
        truncateUrl={truncateUrl}
        appointments={appointments}
        renderSpecialNoteIcon={renderSpecialNoteIcon}
        handleDumbbellClick={handleDumbbellClick}
        handleCheckIn={handleCheckInWrapper}
        handleAppointmentOptionsModal={handleAppointmentOptionsModal}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        isChartDropdownOpen={isChartDropdownOpen}
        setIsChartDropdownOpen={setIsChartDropdownOpen}
      
        expiringContracts={expiringContracts}
        getWidgetPlacementStatus={getWidgetPlacementStatus}
        onClose={toggleRightSidebar}
        hasUnreadNotifications={2}
        setIsWidgetModalOpen={setIsWidgetModalOpen}
        handleEditNote={handleEditNoteWrapper}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        isSpecialNoteModalOpen={isSpecialNoteModalOpen}
        setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen}
        selectedAppointmentForNote={selectedAppointmentForNote}
        setSelectedAppointmentForNote={setSelectedAppointmentForNote}
        handleSaveSpecialNote={handleSaveSpecialNoteWrapper}
        onSaveSpecialNote={handleSaveSpecialNoteWrapper}
        notifications={notifications}
        setTodos={setTodos}
      />

      {/* Sidebar related modals */}
      <TrainingPlansModal
        isOpen={isTrainingPlanModalOpen}
        onClose={() => {
          setIsTrainingPlanModalOpen(false)
          setSelectedUserForTrainingPlan(null)
        }}
        selectedMember={selectedUserForTrainingPlan}
        memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
        availableTrainingPlans={availableTrainingPlans}
        onAssignPlan={handleAssignTrainingPlan}
        onRemovePlan={handleRemoveTrainingPlan}
      />

      <AppointmentActionModalV2
        isOpen={showAppointmentOptionsModal}
        onClose={() => {
          setShowAppointmentOptionsModal(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        isEventInPast={isEventInPast}
        onEdit={() => {
          setShowAppointmentOptionsModal(false);
          setIsEditAppointmentModalOpen(true);
        }}
        onCancel={handleCancelAppointment}
        onViewMember={handleViewMemberDetails}
      />

      <NotifyMemberModal
        isOpen={isNotifyMemberOpen}
        onClose={() => setIsNotifyMemberOpen(false)}
        notifyAction={notifyAction}
        actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper}
        handleNotifyMember={handleNotifyMember}
      />

      {isEditAppointmentModalOpen && selectedAppointment && (
        <EditAppointmentModalV2
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          appointmentTypes={appointmentTypes}
          freeAppointments={freeAppointments}
          handleAppointmentChange={(changes) => {
            setSelectedAppointment({ ...selectedAppointment, ...changes });
          }}
          appointments={appointments}
          setAppointments={setAppointments}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          onDelete={handleDeleteAppointmentWrapper}
          onClose={() => {
            setIsEditAppointmentModalOpen(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddRightSidebarWidget}
        getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
        widgetArea="sidebar"
      />

      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {isEditTaskModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            setIsEditTaskModalOpen(false);
            setEditingTask(null);
          }}
          onUpdateTask={handleUpdateTaskWrapper}
        />
      )}

      {taskToDelete && (
        <div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTaskWrapper(taskToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {taskToCancel && (
        <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancel Task</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to cancel this task?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTaskToCancel(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                No
              </button>
              <button
                onClick={() => handleCancelTaskWrapper(taskToCancel)}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
              >
                Cancel Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>

  )
}
