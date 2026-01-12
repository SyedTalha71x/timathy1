/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { X, Plus, ShoppingBasket, Edit, Check, Move, ExternalLink, History, Search, Trash2, ShoppingCart } from "lucide-react"
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
import ThreeDotsDropdown from "../../components/user-panel-components/selling-components/three-drop-down"
import ProductServiceModal from "../../components/user-panel-components/selling-components/product-service-modal"


const Selling = () => {
  const sidebarSystem = useSidebarSystem()
  const trainingVideos = trainingVideosData
  const [threeDotsDropdown, setThreeDotsDropdown] = useState({
    isOpen: false,
    item: null,
    position: { x: 0, y: 0 }
  });

  //
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showCreateTempMemberModal, setShowCreateTempMemberModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [modalMode, setModalMode] = useState("add") // "add" or "edit"
  const [currentProduct, setCurrentProduct] = useState(null)
  const [activeTab, setActiveTab] = useState("products") // "products" or "services"
  const [sellWithoutMember, setSellWithoutMember] = useState(false)

  // const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [sortBy, setSortBy] = useState("custom-asc");

  const [isEditModeActive, setIsEditModeActive] = useState(false)
  //
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
  const [openDropdownId, setOpenDropdownId] = useState(null)

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

  const handleThreeDotsClick = (e, item) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setThreeDotsDropdown({
      isOpen: true,
      item: item,
      position: { x: rect.right - 150, y: rect.bottom + 5 }
    });
  };

  const handleEditFromDropdown = () => {
    if (threeDotsDropdown.item) {
      openEditModal(threeDotsDropdown.item);
      setThreeDotsDropdown({ isOpen: false, item: null, position: { x: 0, y: 0 } });
    }
  };

  const handleDeleteFromDropdown = () => {
    if (threeDotsDropdown.item) {
      openDeleteModal(threeDotsDropdown.item);
      setThreeDotsDropdown({ isOpen: false, item: null, position: { x: 0, y: 0 } });
    }
  };

  const closeThreeDotsDropdown = () => {
    setThreeDotsDropdown({ isOpen: false, item: null, position: { x: 0, y: 0 } });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountValue = discount === "" ? 0 : Number.parseFloat(discount)
  const discountAmount = subtotal * (discountValue / 100)
  const afterDiscount = subtotal - discountAmount
  // VAT is calculated but NOT added to total as per requirements
  const vatAmount = afterDiscount * (selectedVat / 100)
  const total = afterDiscount // Only discount affects final price

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId !== null && !event.target.closest(".dropdown-container")) {
        setOpenDropdownId(null)
      }
      if (showMemberResults && !event.target.closest(".member-search-container")) {
        setShowMemberResults(false)
      }
      if (threeDotsDropdown.isOpen && !event.target.closest(".three-dots-dropdown")) {
        closeThreeDotsDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdownId, showMemberResults])

  useEffect(() => {
    const handleResize = () => {
      setProducts([...products])
      setServices([...services])
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [products, services])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // Desktop
        setIsRightSidebarOpen(true)
      } else { // Mobile
        setIsRightSidebarOpen(false)
      }
    }

    // Initial check
    handleResize()

    // Add resize listener
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Update the toggle function to handle mobile specifically
  // Update the toggle function
  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

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
  const openEditModal = (item) => {
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
  }
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
    // Reset form
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
        setServices([...services, newItem])
      } else {
        setProducts([...products, newItem])
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
              image: selectedImage || item.image,
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
    setIsRightSidebarOpen(true)
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
  const openDeleteModal = (item) => {
    setProductToDelete(item)
    setIsDeleteModalOpen(true)
  }
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
      canCancel: true, // Can cancel within 24 hours
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
    ) // 24 hours in milliseconds
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

    // Create downloadable invoice content
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
  const sortItems = (items, sortValue) => {
    const [field, direction] = sortValue.split("-");

    if (field === "custom") {
      // Sort by position for custom ordering
      return [...items].sort((a, b) => a.position - b.position);
    }

    const sortedItems = [...items].sort((a, b) => {
      let comparison;
      if (field === "articalNo") {
        comparison = (a.articalNo || "").localeCompare(b.articalNo || "");
      } else if (field === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (field === "price") {
        comparison = a.price - b.price;
      } else {
        comparison = a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
      }
      return direction === "asc" ? comparison : -comparison;
    });
    return sortedItems;
  };
  const handleDragStart = (e, item, index) => {
    if (!isEditModeActive) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData("itemId", item.id)
    e.dataTransfer.setData("itemIndex", index)
    e.dataTransfer.setData("itemType", activeTab)
    e.currentTarget.classList.add("dragging")
  }
  const handleDragOver = (e) => {
    if (!isEditModeActive) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    e.currentTarget.classList.add("drag-over")
  }
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over")
  }
  const handleDrop = (e, targetIndex) => {
    if (!isEditModeActive) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    e.currentTarget.classList.remove("drag-over")

    const draggedItemId = Number.parseInt(e.dataTransfer.getData("itemId"))
    const draggedItemIndex = Number.parseInt(e.dataTransfer.getData("itemIndex"))
    const itemType = e.dataTransfer.getData("itemType")

    if (itemType !== activeTab || draggedItemIndex === targetIndex) return

    const items = activeTab === "services" ? services : products
    const setItems = activeTab === "services" ? setServices : setProducts

    const newItems = [...items]
    const [movedItem] = newItems.splice(draggedItemIndex, 1)
    newItems.splice(targetIndex, 0, movedItem)

    // Update positions
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      position: index,
    }))

    setItems(updatedItems)

    // Automatically switch to custom sorting
    setSortBy("custom")
  }
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging")
    const allItems = document.querySelectorAll(".draggable-item")
    allItems.forEach((item) => item.classList.remove("drag-over"))
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
        (item.articalNo && item.articalNo.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  const updateItemVatRate = (itemId, newVatRate) => {
    setCart(cart.map((item) => (item.id === itemId ? { ...item, vatRate: newVatRate } : item)))
  }

  // Extract all states and functions from the hook
  const {
    isRightSidebarOpen,
    setIsRightSidebarOpen,

  } = sidebarSystem

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
          border: 2px dashed #3F74FF;
          background-color: rgba(63, 116, 255, 0.1);
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

      <div
        className={`
      min-h-screen rounded-3xl text-white bg-[#1C1C1C]
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen
            ? "lg:mr-86 mr-0" // Adjust right margin when sidebar is open on larger screens
            : "mr-0" // No margin when closed
          }
    `}
      >

        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl font-bold oxanium_font whitespace-nowrap">Selling</h1>
                <div className="flex bg-[#000000] rounded-xl border border-slate-300/30 p-1">
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`px-3 md:px-4 py-2 rounded-lg text-sm flex justify-center items-center transition-colors ${activeTab === "products" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                      }`}
                  >
                    <MdOutlineProductionQuantityLimits size={16} className="inline mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Products</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("services")}
                    className={`px-3 md:px-4 py-2 rounded-lg text-sm flex justify-center items-center transition-colors ${activeTab === "services" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                      }`}
                  >
                    <RiServiceFill size={16} className="inline mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Services</span>
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setShowHistoryModalMain(true)}
                    className="text-white md:w-13 w-full  bg-black rounded-xl border border-slate-600 p-2 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                    title="View Sales Journal"
                  >
                    <History size={18} />
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setIsEditModeActive(!isEditModeActive)}
                    className={`p-2 cursor-pointer rounded-xl text-sm ${isEditModeActive
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-[#333333] hover:bg-[#555555] text-gray-300"
                      } transition-colors flex items-center gap-2 whitespace-nowrap`}
                  >
                    {isEditModeActive ? (
                      <>
                        <Check size={16} />
                        <span className="hidden sm:inline">Done</span>
                      </>
                    ) : (
                      <>
                        <Edit size={16} />
                        <span className="hidden sm:inline">Edit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* <div onClick={toggleRightSidebar} className="cursor-pointer relative ">
                  {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className=" ">
                    <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                  ) : (<div onClick={toggleRightSidebar} className=" ">
                    <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                  )}

                  {cart.length > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] rounded-full px-[5px] py-[2px] min-w-[18px] h-[18px] flex items-center justify-center absolute -top-2 -right-2">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div> */}
                <div onClick={toggleRightSidebar} className="cursor-pointer relative">
                  <ShoppingCart size={20} className="text-white" />

                  {cart.length > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] rounded-full px-[5px] py-[2px] min-w-[18px] h-[18px] flex items-center justify-center absolute -top-2 -right-2">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-3 justify-end gap-2">
              <label htmlFor="sort" className="text-sm text-gray-200 whitespace-nowrap">
                Sort:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[200px]"
              >
                <option value="custom-asc">Custom Order</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                {activeTab === "products" && (
                  <>
                    <option value="articalNo-asc">Article No. (Ascending)</option>
                    <option value="articalNo-desc">Article No. (Descending)</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex gap-2 items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="search"
                  placeholder={`Search by name${activeTab === "products" ? ", brand or article number..." : ""}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#181818] text-white rounded-xl pl-10 pr-4 py-2 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                />
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#FF843E]/90 transition-colors duration-200 whitespace-nowrap"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add {activeTab === "services" ? "Service" : "Product"}</span>
                <span className="sm:hidden">Add</span>
              </button>

            </div>

            {/* {isEditModeActive && (
              <div className="bg-[#101010] p-3 rounded-xl mb-4 text-sm text-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <Move size={16} className="text-[#3F74FF]" />
                  <span>
                    Drag and drop {activeTab} to reorder them, or use the arrow buttons to move in specific directions
                  </span>
                </div>
              </div>
            )} */}

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
  ${isRightSidebarOpen ? "lg:grid-cols-3 xl:grid-cols-3" : "lg:grid-cols-4 xl:grid-cols-5"} 
  gap-3`}
            >
              {sortItems(getFilteredItems(), sortBy, sortDirection).map((item, index) => (
                <div
                  key={item.id}
                  className={`w-full bg-[#181818] rounded-2xl overflow-hidden relative draggable-item group ${isEditModeActive ? "animate-wobble" : ""
                    }`}
                  draggable={isEditModeActive}
                  onDragStart={(e) => handleDragStart(e, item, index)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  {/* IMAGE / BLUE BOX */}
                  <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
                    {item.image ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-center p-4">
                        <p
                          className={`font-medium line-clamp-3 ${item.name.length <= 20 ? "text-lg" :
                            item.name.length <= 40 ? "text-base" :
                              item.name.length <= 60 ? "text-sm" :
                                item.name.length <= 80 ? "text-xs" :
                                  "text-[10px]"
                            }`}
                        >
                          {item.name}
                        </p>
                      </div>
                    )}

                    {!isEditModeActive && (
                      <div className="absolute bottom-3 right-3">
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-blue-800 cursor-pointer hover:bg-[#3F74FF]/90 text-white p-2 rounded-full transition-colors relative"
                          aria-label="Add to cart"
                        >
                          <ShoppingBasket size={16} />
                          {/* Add number indicator for this specific item if it's in cart */}
                          {cart.some(cartItem => cartItem.id === item.id) && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] rounded-full px-[4px] py-[1px] min-w-[16px] h-[16px] flex items-center justify-center border border-white">
                              {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                            </span>
                          )}
                        </button>
                      </div>
                    )}
                    {isEditModeActive && (
                      <button
                        onClick={(e) => handleThreeDotsClick(e, item)}
                        className="absolute top-2 right-2 bg-[#333333] hover:bg-[#444444] text-white p-2 rounded-full transition-colors z-10"
                        aria-label="More options"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="6" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="18" r="2" />
                        </svg>
                      </button>
                    )}
                    {item.link && !isEditModeActive && (
                      <button
                        onClick={() => window.open(item.link, "_blank")}
                        className="absolute bottom-3 left-3 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                        aria-label="Open link"
                      >
                        <ExternalLink size={16} />
                      </button>
                    )}

                    {isEditModeActive && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                          aria-label="Delete item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-3">
                    <div className="min-h-[80px] flex flex-col justify-between">
                      <div className="mb-2">
                        {/* Responsive title based on text length */}
                        <h3 className={`font-medium oxanium_font truncate leading-tight ${item.name.length <= 10 ? 'text-xl' :
                          item.name.length <= 20 ? 'text-lg' :
                            item.name.length <= 30 ? 'text-base' :
                              item.name.length <= 40 ? 'text-sm' :
                                'text-xs'
                          }`}>
                          {item.name}
                        </h3>

                        {activeTab === "products" && item.brandName && (
                          <p className={`text-slate-200 mt-1 open_sans_font truncate ${item.brandName.length <= 15 ? 'text-sm' :
                            item.brandName.length <= 25 ? 'text-xs' :
                              'text-[10px]'
                            }`}>
                            {item.brandName}
                          </p>
                        )}

                        {activeTab === "products" && item.articalNo && (
                          <p className={`text-slate-400 mt-1 open_sans_font truncate ${item.articalNo.length <= 15 ? 'text-xs' :
                            'text-[10px]'
                            }`}>
                            Art. No: {item.articalNo}
                          </p>
                        )}
                      </div>

                      {/* Price - always at the bottom */}
                      <p className="text-lg font-bold text-white whitespace-nowrap mt-auto">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

        <ThreeDotsDropdown
          isOpen={threeDotsDropdown.isOpen}
          onClose={closeThreeDotsDropdown}
          position={threeDotsDropdown.position}
          onEdit={handleEditFromDropdown}
          onDelete={handleDeleteFromDropdown}
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
          // SHOPPING TAB LOGIC - Cart and payment related props
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
    </>
  )
}

export default Selling