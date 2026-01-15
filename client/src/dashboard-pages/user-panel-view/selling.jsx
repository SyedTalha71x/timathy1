/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useCallback } from "react"
import { X, Plus, ShoppingBasket, ExternalLink, History, Search, Trash2, ShoppingCart, ArrowUpDown, ArrowUp, ArrowDown, GripVertical, Edit, Copy } from "lucide-react"
import { RiServiceFill } from "react-icons/ri"
import SidebarAreaSelling from "../../components/user-panel-components/selling-components/custom-sidebar-selling"
import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { toast, Toaster } from "react-hot-toast"
import CreateTempMemberModal from "../../components/user-panel-components/selling-components/create-temp-member-modal"
import DeleteConfirmationModal from "../../components/user-panel-components/selling-components/delete-confirmation-modal"
import SalesJournalModal from "../../components/user-panel-components/selling-components/sales-journal-modal"
import { productsMainData, sellingMainData, serviceMainData } from "../../utils/user-panel-states/selling-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import ProductServiceModal from "../../components/user-panel-components/selling-components/product-service-modal"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Product/Service Card Component
const SortableItemCard = ({ item, children, isDragDisabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    disabled: isDragDisabled 
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.95 : 1,
    zIndex: isDragging ? 1000 : 1,
    boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    willChange: isDragging ? 'transform' : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative h-full ${isDragging ? 'rounded-xl ring-1 ring-gray-500/30' : ''}`}>
      {!isDragDisabled && (
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-3 left-3 md:top-4 md:left-4 cursor-grab active:cursor-grabbing text-white hover:text-white active:text-blue-400 p-1.5 md:p-1.5 rounded-lg active:bg-blue-600/30 z-20 touch-none bg-black/60 shadow-lg"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}
      {children}
    </div>
  )
}

// Helper function to get dynamic text size based on content length
const getTextSizeClass = (text, isCard = false) => {
  const length = text?.length || 0
  if (isCard) {
    // For card display (larger sizes for orange background) - made bigger
    if (length <= 10) return 'text-3xl'
    if (length <= 20) return 'text-2xl'
    if (length <= 35) return 'text-xl'
    if (length <= 50) return 'text-lg'
    if (length <= 70) return 'text-base'
    return 'text-sm'
  }
  // For title display below card
  if (length <= 10) return 'text-xl'
  if (length <= 20) return 'text-lg'
  if (length <= 30) return 'text-base'
  if (length <= 40) return 'text-sm'
  return 'text-xs'
}

const Selling = () => {
  const sidebarSystem = useSidebarSystem()
  const trainingVideos = trainingVideosData
  const [dropdownOpen, setDropdownOpen] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showCreateTempMemberModal, setShowCreateTempMemberModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [modalMode, setModalMode] = useState("add") // "add" or "edit"
  const [currentProduct, setCurrentProduct] = useState(null)
  const [activeTab, setActiveTab] = useState("products") // "products" or "services"
  const [sellWithoutMember, setSellWithoutMember] = useState(false)

  // Sort states - Bulletin Board style
  const [sortBy, setSortBy] = useState("custom")
  const [sortDirection, setSortDirection] = useState("desc")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)

  const [showHistoryModalMain, setShowHistoryModalMain] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    articalNo: "",
    paymentOption: "",
    brandName: "",
    link: "",
    vatRate: "19",
    vatSelectable: false,
  })

  // New temporary member form state
  const [tempMemberForm, setTempMemberForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    dateOfBirth: "",
    autoArchivePeriod: "4",
    about: "",
    note: "",
    noteImportance: "unimportant",
    noteStartDate: "",
    noteEndDate: "",
  })
  const [tempMemberModalTab, setTempMemberModalTab] = useState("details")
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Shopping cart state
  const [cart, setCart] = useState([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash")
  const [discount, setDiscount] = useState("")
  const [selectedVat, setSelectedVat] = useState(19)
  const [selectedMemberMain, setSelectedMemberMain] = useState("")
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [showMemberResults, setShowMemberResults] = useState(false)

  const [products, setProducts] = useState(productsMainData)
  const [services, setServices] = useState(serviceMainData)
  const [salesHistory, setSalesHistory] = useState(sellingMainData)

  const [salesFilter, setSalesFilter] = useState({
    type: "all",
    member: "",
    dateFrom: "",
    dateTo: "",
  })

  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", type: "Full Member" },
    { id: 2, name: "Jane Smith", type: "Full Member" },
    { id: 3, name: "Mike Johnson", type: "Full Member" },
  ])

  // DnD sensors - same as Bulletin Board
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Sort options - Bulletin Board style (Custom Order at bottom)
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    ...(activeTab === 'products' ? [{ value: 'articalNo', label: 'Article No.' }] : []),
    { value: 'custom', label: 'Custom Order' }
  ]

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountValue = discount === "" ? 0 : Number.parseFloat(discount)
  const discountAmount = subtotal * (discountValue / 100)
  const afterDiscount = subtotal - discountAmount
  const vatAmount = afterDiscount * (selectedVat / 100)
  const total = afterDiscount

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
      if (showMemberResults && !event.target.closest(".member-search-container")) {
        setShowMemberResults(false)
      }
      if (dropdownOpen !== null && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(null)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [showMemberResults, dropdownOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsRightSidebarOpen(true)
      } else {
        setIsRightSidebarOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return
      
      // Ignore if Ctrl/Cmd is pressed (for Ctrl+C copy, etc.)
      if (e.ctrlKey || e.metaKey) return
      
      // ESC key - Close modals
      if (e.key === 'Escape') {
        if (isModalOpen) {
          setIsModalOpen(false)
          return
        }
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false)
          return
        }
        if (showHistoryModalMain) {
          setShowHistoryModalMain(false)
          return
        }
        if (showCreateTempMemberModal) {
          setShowCreateTempMemberModal(false)
          return
        }
      }
      
      // C key - Create new product/service
      if (e.key === 'c' || e.key === 'C') {
        if (!isModalOpen && !isDeleteModalOpen && !showHistoryModalMain && !showCreateTempMemberModal) {
          e.preventDefault()
          openAddModal()
        }
      }
      
      // J key - Open Journal
      if (e.key === 'j' || e.key === 'J') {
        if (!isModalOpen && !isDeleteModalOpen && !showHistoryModalMain && !showCreateTempMemberModal) {
          e.preventDefault()
          setShowHistoryModalMain(true)
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, isDeleteModalOpen, showHistoryModalMain, showCreateTempMemberModal])

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  // Handle drag end for reordering - Bulletin Board style
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (active.id !== over?.id) {
      const items = activeTab === "services" ? services : products
      const setItems = activeTab === "services" ? setServices : setProducts
      
      if (sortBy !== 'custom') {
        const currentOrder = getFilteredAndSortedItems()
        const oldIndex = currentOrder.findIndex((item) => item.id === active.id)
        const newIndex = currentOrder.findIndex((item) => item.id === over.id)
        const newOrder = arrayMove(currentOrder, oldIndex, newIndex)
        const filteredOutItems = items.filter(p => !currentOrder.find(cp => cp.id === p.id))
        setItems([...newOrder, ...filteredOutItems])
        setSortBy('custom')
      } else {
        setItems((prevItems) => {
          const oldIndex = prevItems.findIndex((item) => item.id === active.id)
          const newIndex = prevItems.findIndex((item) => item.id === over.id)
          return arrayMove(prevItems, oldIndex, newIndex)
        })
      }
    }
  }

  const handleSortOptionClick = (newSortBy) => {
    if (newSortBy === 'custom') {
      setSortBy('custom')
      setShowSortDropdown(false)
    } else if (sortBy === newSortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortDirection('desc')
    }
  }

  const getSortIcon = () => {
    if (sortBy === 'custom') {
      return <ArrowUpDown size={14} className="text-gray-400" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
  }

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Custom Order'

  const openAddModal = () => {
    setModalMode("add")
    setFormData({
      name: "",
      price: "",
      articalNo: "",
      paymentOption: "",
      brandName: "",
      link: "",
      vatRate: "19",
      vatSelectable: false,
    })
    setSelectedImage(null)
    setCurrentProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = useCallback((item) => {
    setModalMode("edit")
    setFormData({
      name: item.name,
      price: item.price.toString(),
      articalNo: item.articalNo || "",
      paymentOption: item.paymentOption || "",
      brandName: item.brandName || "",
      link: item.link || "",
      vatRate: item.vatRate || "19",
      vatSelectable: item.vatSelectable || false,
    })
    setSelectedImage(null)
    setCurrentProduct(item)
    setIsModalOpen(true)
    setDropdownOpen(null)
  }, [])

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleTempMemberInputChange = (e) => {
    const { name, value } = e.target
    setTempMemberForm({
      ...tempMemberForm,
      [name]: value,
    })
  }

  const handleCreateTempMember = (e) => {
    e.preventDefault()
    const newMember = {
      id: Date.now(),
      name: `${tempMemberForm.firstName} ${tempMemberForm.lastName}`,
      email: tempMemberForm.email,
      phone: tempMemberForm.phone,
      street: tempMemberForm.street,
      zipCode: tempMemberForm.zipCode,
      city: tempMemberForm.city,
      dateOfBirth: tempMemberForm.dateOfBirth,
      autoArchivePeriod: tempMemberForm.autoArchivePeriod,
      about: tempMemberForm.about,
      note: tempMemberForm.note,
      noteImportance: tempMemberForm.noteImportance,
      noteStartDate: tempMemberForm.noteStartDate,
      noteEndDate: tempMemberForm.noteEndDate,
      isTemp: true,
      type: "Temporary Member",
    }
    setMembers([...members, newMember])
    setSelectedMemberMain(newMember.id)
    setMemberSearchQuery(newMember.name)
    setShowMemberResults(false)
    setTempMemberForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      zipCode: "",
      city: "",
      dateOfBirth: "",
      autoArchivePeriod: "4",
      about: "",
      note: "",
      noteImportance: "unimportant",
      noteStartDate: "",
      noteEndDate: "",
    })
    setTempMemberModalTab("details")
    setShowCreateTempMemberModal(false)
  }

  const handleInputChangeMain = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    const isService = activeTab === "services"
    if (modalMode === "add") {
      const newItem = {
        id: Date.now(),
        name: formData.name,
        brandName: isService ? undefined : formData.brandName,
        price: Number.parseFloat(formData.price) || 0,
        image: selectedImage || null,
        articalNo: isService ? undefined : formData.articalNo,
        paymentOption: formData.paymentOption,
        type: isService ? "service" : "product",
        position: isService ? services.length : products.length,
        link: formData.link,
        vatRate: formData.vatRate,
        vatSelectable: formData.vatSelectable,
      }
      if (isService) {
        setServices([newItem, ...services])
      } else {
        setProducts([newItem, ...products])
      }
    } else {
      const updateItems = (items) =>
        items.map((item) => {
          if (item.id === currentProduct.id) {
            return {
              ...item,
              name: formData.name,
              price: Number.parseFloat(formData.price) || item.price,
              articalNo: isService ? undefined : formData.articalNo,
              paymentOption: formData.paymentOption,
              image: selectedImage || currentProduct?.image || null,
              brandName: isService ? undefined : formData.brandName,
              link: formData.link,
              vatRate: formData.vatRate,
              vatSelectable: formData.vatSelectable,
            }
          }
          return item
        })
      if (isService) {
        setServices(updateItems(services))
      } else {
        setProducts(updateItems(products))
      }
    }
    closeModal()
  }

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)
    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
    // Only open sidebar on desktop (768px = md breakpoint)
    if (window.innerWidth >= 768) {
      setIsRightSidebarOpen(true)
    }
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
      return
    }
    setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const openDeleteModal = useCallback((item) => {
    setProductToDelete(item)
    setIsDeleteModalOpen(true)
    setDropdownOpen(null)
  }, [])

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      if (productToDelete.type === "service") {
        setServices(services.filter((service) => service.id !== productToDelete.id))
      } else {
        setProducts(products.filter((product) => product.id !== productToDelete.id))
      }
      if (cart.some((item) => item.id === productToDelete.id)) {
        removeFromCart(productToDelete.id)
      }
      closeDeleteModal()
      if (isModalOpen && currentProduct && currentProduct.id === productToDelete.id) {
        closeModal()
      }
    }
  }

  const handleDuplicateItem = useCallback((item) => {
    const duplicatedItem = {
      ...item,
      id: Date.now(),
      name: `${item.name} (Copy)`,
    }
    if (item.type === "service") {
      setServices(prev => [duplicatedItem, ...prev])
    } else {
      setProducts(prev => [duplicatedItem, ...prev])
    }
    setDropdownOpen(null)
    toast.success(`${item.type === "service" ? "Service" : "Product"} duplicated`)
  }, [])

  const cancelSale = (saleId) => {
    setSalesHistory((prev) => prev.filter((sale) => sale.id !== saleId))
    toast.success("Sale cancelled successfully")
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    const selectedMemberData = selectedMemberMain ? members.find((m) => m.id === selectedMemberMain) : null
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(salesHistory.length + 1).padStart(3, "0")}`

    const newSale = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      member: sellWithoutMember ? "No Member" : selectedMemberData?.name || "No Member Selected",
      memberType: sellWithoutMember ? "N/A" : selectedMemberData?.type || "N/A",
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        type: item.type === "service" ? "Service" : "Product",
        articalNo: item.articalNo,
        brandName: item.brandName,
      })),
      totalAmount: total,
      subtotal: subtotal,
      discountApplied: discountAmount,
      vatApplied: vatAmount,
      paymentMethod: selectedPaymentMethod,
      soldBy: sellWithoutMember ? "No Member" : selectedMemberData?.name || "No Member Selected",
      invoiceNumber: invoiceNumber,
      canCancel: true,
    }

    setSalesHistory((prevHistory) => [newSale, ...prevHistory])
    setCart([])
    setSelectedMemberMain("")
    setMemberSearchQuery("")
    setSellWithoutMember(false)
    setDiscount("")
    setSelectedPaymentMethod("Cash")
    setIsRightSidebarOpen(false)

    setTimeout(
      () => {
        setSalesHistory((prev) => prev.map((sale) => (sale.id === newSale.id ? { ...sale, canCancel: false } : sale)))
      },
      24 * 60 * 60 * 1000,
    )
  }

  const downloadInvoice = (sale) => {
    const invoiceData = {
      studioName: "Fitness Studio Pro",
      studioAddress: "123 Fitness Street, Health City, HC 12345",
      vatNumber: "DE123456789",
      logo: "Studio Logo Here",
      invoiceNumber: sale.invoiceNumber,
      date: sale.date,
      member: sale.member,
      memberType: sale.memberType,
      items: sale.items,
      subtotal: sale.subtotal,
      discount: sale.discountApplied,
      vat: sale.vatApplied,
      total: sale.totalAmount,
      paymentMethod: sale.paymentMethod,
    }

    const invoiceContent = `
INVOICE - ${invoiceData.invoiceNumber}
${invoiceData.studioName}
${invoiceData.studioAddress}
VAT Number: ${invoiceData.vatNumber}

Date: ${invoiceData.date}
Member: ${invoiceData.member} (${invoiceData.memberType})

ITEMS:
${invoiceData.items
        .map((item) => `${item.name} (${item.type}) - Qty: ${item.quantity} - Price: $${item.price.toFixed(2)}`)
        .join("\n")}

Subtotal: $${invoiceData.subtotal?.toFixed(2) || "0.00"}
Discount: -$${invoiceData.discount?.toFixed(2) || "0.00"}
VAT (${selectedVat}%): $${invoiceData.vat?.toFixed(2) || "0.00"}
Total: $${invoiceData.total.toFixed(2)}

Payment Method: ${invoiceData.paymentMethod}
    `

    const blob = new Blob([invoiceContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${invoiceData.invoiceNumber}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()),
  )

  const selectMember = (member) => {
    setSelectedMemberMain(member.id)
    setMemberSearchQuery(member.name)
    setShowMemberResults(false)
    setSellWithoutMember(false)
  }

  const getCurrentItems = () => {
    return activeTab === "services" ? services : products
  }

  const getFilteredItems = () => {
    const items = getCurrentItems()
    return items.filter(
      (item) =>
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.articalNo && item.articalNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.brandName && item.brandName.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  // Get filtered and sorted items - Bulletin Board style
  const getFilteredAndSortedItems = () => {
    const filtered = getFilteredItems()
    
    if (sortBy === 'custom') {
      return filtered
    }
    
    return [...filtered].sort((a, b) => {
      let comparison = 0
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === 'price') {
        comparison = a.price - b.price
      } else if (sortBy === 'articalNo') {
        comparison = (a.articalNo || '').localeCompare(b.articalNo || '')
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }

  const updateItemVatRate = (itemId, newVatRate) => {
    setCart(cart.map((item) => (item.id === itemId ? { ...item, vatRate: newVatRate } : item)))
  }

  const {
    isRightSidebarOpen,
    setIsRightSidebarOpen,
  } = sidebarSystem

  const sortedItems = getFilteredAndSortedItems()
  const itemIds = sortedItems.map(item => item.id)

  return (
    <>
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

      <div
        className={`
          min-h-screen rounded-3xl text-white bg-[#1C1C1C] md:p-6 p-3
          transition-all duration-500 ease-in-out flex-1
          ${isRightSidebarOpen ? "lg:mr-86 mr-0" : "mr-0"}
        `}
      >
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Selling</h1>
              
              {/* Sort Button - Mobile: next to title */}
              <div className="md:hidden relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }}
                  className="px-3 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
                >
                  {getSortIcon()}
                  <span>{currentSortLabel}</span>
                </button>

                {/* Sort Dropdown - Mobile */}
                {showSortDropdown && (
                  <div className="absolute left-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                        Sort by
                      </div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'}`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && option.value !== 'custom' && (
                            <span className="text-gray-400">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* History Button with Tooltip */}
              <div className="relative group">
                <button
                  onClick={() => setShowHistoryModalMain(true)}
                  className="bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 text-sm px-3 py-3 md:py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium"
                >
                  <History size={18} className="md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Journal</span>
                </button>
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">Sales Journal</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                    J
                  </span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                </div>
              </div>

              {/* Add Product/Service Button - Desktop with Tooltip */}
              <div className="hidden md:block relative group">
                <button
                  onClick={openAddModal}
                  className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2.5 rounded-xl flex items-center gap-2 justify-center transition-colors"
                >
                  <Plus size={16} />
                  <span className='hidden sm:inline'>Add {activeTab === "services" ? "Service" : "Product"}</span>
                </button>
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">Add {activeTab === "services" ? "Service" : "Product"}</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                    C
                  </span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                </div>
              </div>

              {/* Add Button - Mobile Only */}
              <button
                onClick={openAddModal}
                className="md:hidden cursor-pointer relative p-3 bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
                aria-label={`Add ${activeTab === "services" ? "Service" : "Product"}`}
              >
                <Plus size={18} className="text-white" />
              </button>

              {/* Cart Icon - Desktop Only */}
              <div onClick={toggleRightSidebar} className="hidden md:block cursor-pointer relative p-3 md:p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl transition-colors">
                <ShoppingCart size={18} className="text-white" />
                {cart.length > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] rounded-full px-[5px] py-[2px] min-w-[18px] h-[18px] flex items-center justify-center absolute -top-1 -right-1">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs - Bulletin Board Style (moved up) */}
          <div className="flex border-b border-gray-800 mb-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 sm:py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "products" 
                  ? "text-white border-b-2 border-orange-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <MdOutlineProductionQuantityLimits size={18} />
              Products
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 sm:py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "services" 
                  ? "text-white border-b-2 border-orange-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <RiServiceFill size={18} />
              Services
            </button>
          </div>

          {/* Search Bar and Sort */}
          <div className="flex gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={activeTab === "products" ? "Search by name, brand or article no..." : "Search by name..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-3 md:py-2.5 pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors [&::placeholder]:text-ellipsis [&::placeholder]:overflow-hidden"
              />
            </div>

            {/* Sort Dropdown - Desktop only */}
            <div className="hidden md:block relative" ref={sortDropdownRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }}
                className="px-4 py-2.5 bg-[#2F2F2F] text-gray-300 rounded-xl text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {getSortIcon()}
                <span>{currentSortLabel}</span>
              </button>
              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                  <div className="py-1">
                    <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'}`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && option.value !== 'custom' && (
                          <span className="text-gray-400">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products/Services Grid with Drag and Drop */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={itemIds} strategy={rectSortingStrategy}>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                  ${isRightSidebarOpen ? "lg:grid-cols-3 xl:grid-cols-3" : "lg:grid-cols-4 xl:grid-cols-5"} 
                  gap-4 md:gap-6 auto-rows-fr`}
              >
                {sortedItems.map((item) => (
                  <SortableItemCard key={item.id} item={item} isDragDisabled={false}>
                    <div className="w-full h-full bg-[#181818] rounded-2xl overflow-hidden relative group select-none">
                      {/* IMAGE / ORANGE BOX - 16:9 aspect ratio */}
                      <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl">
                        {item.image ? (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover w-full h-full pointer-events-none"
                            draggable="false"
                            onDragStart={(e) => e.preventDefault()}
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-center p-4">
                            <p className={`font-bold leading-tight ${getTextSizeClass(item.name, true)}`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word', userSelect: 'none' }}>
                              {item.name}
                            </p>
                          </div>
                        )}

                        {/* External link button - left aligned with same margin as cart */}
                        {item.link && (
                          <button
                            onClick={() => window.open(item.link, "_blank")}
                            className="absolute bottom-3 left-3 cursor-pointer bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                            aria-label="Open link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}

                        {/* Add to cart button - right aligned */}
                        <div className="absolute bottom-3 right-3">
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-black/50 cursor-pointer hover:bg-black/70 text-white p-2 rounded-lg transition-colors relative"
                            aria-label="Add to cart"
                          >
                            <ShoppingBasket className="w-4 h-4" />
                            {cart.some(cartItem => cartItem.id === item.id) && (
                              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] rounded-full px-[4px] py-[1px] min-w-[16px] h-[16px] flex items-center justify-center border border-white">
                                {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-4 md:p-3">
                        <div className="min-h-[70px] flex flex-col justify-between">
                          <div className="mb-2">
                            {/* Row 1: Product/Service Name - always visible */}
                            <h3 className={`font-medium oxanium_font truncate leading-tight ${getTextSizeClass(item.name)}`}>
                              {item.name}
                            </h3>

                            {/* Row 2: Brand - fixed position for products (shows placeholder if empty) */}
                            {activeTab === "products" && (
                              <p className="text-slate-200 mt-1 open_sans_font truncate text-sm h-5">
                                {item.brandName || <span className="text-transparent">-</span>}
                              </p>
                            )}

                            {/* Row 3: Article No - fixed position for products (shows placeholder if empty) */}
                            {activeTab === "products" && (
                              <p className="text-slate-400 mt-1 open_sans_font truncate text-xs h-4">
                                {item.articalNo ? `Art. No: ${item.articalNo}` : <span className="text-transparent">-</span>}
                              </p>
                            )}
                          </div>

                          {/* Price row with 3-dot menu */}
                          <div className="flex items-center justify-between mt-auto">
                            <p className="text-lg font-bold text-white whitespace-nowrap">
                              ${item.price.toFixed(2)}
                            </p>
                            
                            {/* 3-dot menu - Bulletin Board style */}
                            <div className="relative dropdown-container">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDropdownOpen(dropdownOpen === item.id ? null : item.id)
                                }}
                                className="text-gray-400 hover:text-orange-400 p-2 md:p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                              >
                                <svg className="w-5 h-5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                              </button>
                              {dropdownOpen === item.id && (
                                <div className="absolute right-0 bottom-full mb-2 bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-lg py-1 z-30 min-w-[140px]">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openEditModal(item)
                                    }} 
                                    className="w-full text-left px-3 py-2.5 md:py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                  >
                                    <Edit size={14} /> Edit
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDuplicateItem(item)
                                    }} 
                                    className="w-full text-left px-3 py-2.5 md:py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                                  >
                                    <Copy size={14} /> Duplicate
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openDeleteModal(item)
                                    }} 
                                    className="w-full text-left px-3 py-2.5 md:py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SortableItemCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Empty State */}
          {sortedItems.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-6">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-3">No {activeTab} found</h3>
              <p className="text-gray-500 mb-6">{searchQuery ? "Try adjusting your search" : `Create a new ${activeTab === "services" ? "service" : "product"} to get started`}</p>
              <button
                onClick={openAddModal}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Add {activeTab === "services" ? "Service" : "Product"}
              </button>
            </div>
          )}
        </main>

        <CreateTempMemberModal
          show={showCreateTempMemberModal}
          onClose={() => setShowCreateTempMemberModal(false)}
          onSubmit={handleCreateTempMember}
          tempMemberModalTab={tempMemberModalTab}
          setTempMemberModalTab={setTempMemberModalTab}
          tempMemberForm={tempMemberForm}
          handleTempMemberInputChange={handleTempMemberInputChange}
          setTempMemberForm={setTempMemberForm}
        />

        <DeleteConfirmationModal
          show={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          productToDelete={productToDelete}
        />

        {/* Edit/Add Modal */}
        <ProductServiceModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          modalMode={modalMode}
          activeTab={activeTab}
          formData={formData}
          handleSubmit={handleSubmit}
          handleInputChangeMain={handleInputChangeMain}
          selectedImage={selectedImage}
          currentProduct={currentProduct}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          onRemoveImage={() => {
            setSelectedImage(null)
            if (currentProduct) {
              setCurrentProduct({ ...currentProduct, image: null })
            }
          }}
          onCroppedImage={(croppedImage) => {
            setSelectedImage(croppedImage)
          }}
        />

        {/* History Modal */}
        {showHistoryModalMain && (
          <SalesJournalModal
            salesHistory={salesHistory}
            onClose={() => setShowHistoryModalMain(false)}
            cancelSale={cancelSale}
            downloadInvoice={downloadInvoice}
            salesFilter={salesFilter}
            setSalesFilter={setSalesFilter}
          />
        )}

        {/* Sidebar Component */}
        <SidebarAreaSelling
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          discount={discount}
          setDiscount={setDiscount}
          selectedVat={selectedVat}
          setSelectedVat={setSelectedVat}
          selectedMemberMain={selectedMemberMain}
          setSelectedMemberMain={setSelectedMemberMain}
          memberSearchQuery={memberSearchQuery}
          setMemberSearchQuery={setMemberSearchQuery}
          showMemberResults={showMemberResults}
          setShowMemberResults={setShowMemberResults}
          members={members}
          sellWithoutMember={sellWithoutMember}
          setSellWithoutMember={setSellWithoutMember}
          setIsTempMemberModalOpen={() => setShowCreateTempMemberModal(true)}
          filteredMembers={filteredMembers}
          selectMember={selectMember}
          subtotal={subtotal}
          discountValue={discountValue}
          discountAmount={discountAmount}
          afterDiscount={afterDiscount}
          vatAmount={vatAmount}
          total={total}
          handleCheckout={handleCheckout}
          updateItemVatRate={updateItemVatRate}
        />

        {isRightSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden block cursor-pointer"
            onClick={() => setIsRightSidebarOpen(false)}
          ></div>
        )}
      </div>

      {/* Floating Action Button - Mobile Only - Shopping Cart (hidden when sidebar is open) */}
      {!isRightSidebarOpen && (
        <button
          onClick={toggleRightSidebar}
          className="md:hidden fixed bottom-4 right-4 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white p-4 rounded-xl shadow-2xl transition-all active:scale-95 z-[100]"
          aria-label="Open Shopping Cart"
        >
          <ShoppingCart size={22} />
          {cart.length > 0 && (
            <span className="bg-orange-500 text-white text-[10px] rounded-full px-[5px] py-[2px] min-w-[18px] h-[18px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-[#1C1C1C]">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      )}
    </>
  )
}

export default Selling
