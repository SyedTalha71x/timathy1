/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect } from "react"
import {
  X,
  Plus,
  ShoppingBasket,
  MoreVertical,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Edit,
  Check,
  Move,
  ExternalLink,
  Info,
  History,
} from "lucide-react"
import ProductImage from "../../../public/default-avatar.avif"
import { RiServiceFill } from "react-icons/ri"
import SidebarAreaSelling from "../../components/selling-components/custom-sidebar-selling"
import Avatar from "../../../public/avatar.png"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { IoIosMenu } from "react-icons/io"
import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { toast } from "react-hot-toast"
import CreateTempMemberModal from "../../components/selling-components/create-temp-member-modal"
import DeleteConfirmationModal from "../../components/selling-components/delete-confirmation-modal"
import SalesJournalModal from "../../components/selling-components/sales-journal-modal"

function App() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showCreateTempMemberModal, setShowCreateTempMemberModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [modalMode, setModalMode] = useState("add") // "add" or "edit"
  const [currentProduct, setCurrentProduct] = useState(null)
  const [activeTab, setActiveTab] = useState("products") // "products" or "services"
  const [sellWithoutMember, setSellWithoutMember] = useState(false)
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
  const [selectedMember, setSelectedMember] = useState("")
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [showMemberResults, setShowMemberResults] = useState(false)

  // Sidebar state
  const [customLinks, setCustomLinks] = useState([
    { id: "link1", title: "Google", url: "https://google.com" },
    { id: "link2", title: "GitHub", url: "https://github.com" },
  ])
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  // Mock data for sidebar
  const communications = [
    { id: 1, name: "John Doe", message: "Hello, how are you?", time: "2 min ago", avatar: Rectangle1 },
    { id: 2, name: "Jane Smith", message: "Meeting at 3 PM", time: "5 min ago", avatar: Rectangle1 },
  ]
  const todos = [
    { id: 1, title: "Review proposals", description: "Check new member applications", assignee: "Admin" },
    { id: 2, title: "Update website", description: "Add new features", assignee: "Dev" },
  ]
  const birthdays = [
    { id: 1, name: "Alice Johnson", date: "Tomorrow", avatar: Avatar },
    { id: 2, name: "Bob Wilson", date: "Next week", avatar: Avatar },
  ]

  // Members list (example)
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", type: "Full Member" },
    { id: 2, name: "Jane Smith", type: "Full Member" },
    { id: 3, name: "Mike Johnson", type: "Full Member" },
  ])
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Orange Sneakers",
      brandName: "ORANGEWEAR",
      price: 129.99,
      image: "https://placehold.co/600x400/blue/white?text=Premium+Sneakers",
      articalNo: "ORG-001",
      paymentOption: "Card",
      type: "product",
      position: 0,
      link: "https://example.com/product1",
      vatRate: "19",
      vatSelectable: false,
    },
    {
      id: 2,
      name: "Orange Athletic Shoes",
      brandName: "ORANGEFIT",
      price: 189.5,
      image: "https://placehold.co/600x400/blue/white?text=Athletic+Shoes",
      articalNo: "ORG-002",
      paymentOption: "Card",
      type: "product",
      position: 1,
      link: "",
      vatRate: "7",
      vatSelectable: true,
    },
  ])

  const [services, setServices] = useState([
    {
      id: 101,
      name: "Personal Training Session",
      price: 75.0,
      image: "https://placehold.co/600x400/blue/white?text=Personal+Training",
      paymentOption: "Card",
      type: "service",
      position: 0,
      link: "https://example.com/training",
      vatRate: "19",
      vatSelectable: false,
    },
    {
      id: 102,
      name: "Nutrition Consultation",
      price: 50.0,
      image: "https://placehold.co/600x400/blue/white?text=Nutrition+Advice",
      paymentOption: "Cash",
      type: "service",
      position: 1,
      link: "",
      vatRate: "7",
      vatSelectable: true,
    },
  ])

  // New state for sales history
  const [salesHistory, setSalesHistory] = useState([
    {
      id: 1,
      date: "2024-01-15 14:30:22",
      member: "John Doe",
      memberType: "Full Member",
      items: [
        { name: "Premium Orange Sneakers", quantity: 2, price: 129.99, type: "Product" },
        { name: "Personal Training Session", quantity: 1, price: 75.0, type: "Service" },
      ],
      totalAmount: 334.98,
      paymentMethod: "Credit Card",
      soldBy: "John Smith",
      invoiceNumber: "INV-2024-001",
      canCancel: true,
    },
    {
      id: 2,
      date: "2024-01-14 09:15:45",
      member: "No Member",
      memberType: "N/A",
      items: [{ name: "Orange Athletic Shoes", quantity: 1, price: 189.5, type: "Product" }],
      totalAmount: 189.5,
      paymentMethod: "Cash",
      soldBy: "Sarah Johnson",
      invoiceNumber: "INV-2024-002",
      canCancel: false,
    },
    {
      id: 3,
      date: "2024-01-13 16:45:12",
      member: "Jane Smith",
      memberType: "Temporary Member",
      items: [
        { name: "Nutrition Consultation", quantity: 3, price: 50.0, type: "Service" },
        { name: "Premium Orange Sneakers", quantity: 1, price: 129.99, type: "Product" },
      ],
      totalAmount: 279.99,
      paymentMethod: "Debit Card",
      soldBy: "Mike Davis",
      invoiceNumber: "INV-2024-003",
      canCancel: true,
    },
  ])

  const [salesFilter, setSalesFilter] = useState({
    type: "all", // all, service, product
    member: "",
    dateFrom: "",
    dateTo: "",
  })

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }
  const toggleDropdown = (id) => {
    setOpenDropdownIndex(openDropdownIndex === id ? null : id)
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

  // Updated temporary member functions
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
    setSelectedMember(newMember.id)
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
  const handleInputChange = (e) => {
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
        image: selectedImage || ProductImage,
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

  // Shopping cart functions
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

  // Checkout function to record sales history
  const handleCheckout = () => {
    if (cart.length === 0) return

    const selectedMemberData = selectedMember ? members.find((m) => m.id === selectedMember) : null
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
    setSelectedMember("")
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

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountValue = discount === "" ? 0 : Number.parseFloat(discount)
  const discountAmount = subtotal * (discountValue / 100)
  const afterDiscount = subtotal - discountAmount
  // VAT is calculated but NOT added to total as per requirements
  const vatAmount = afterDiscount * (selectedVat / 100)
  const total = afterDiscount // Only discount affects final price

  const cancelSale = (saleId) => {
    setSalesHistory((prev) => prev.filter((sale) => sale.id !== saleId))
    toast.success("Sale cancelled successfully")
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
    setSelectedMember(member.id)
    setMemberSearchQuery(member.name)
    setShowMemberResults(false)
    setSellWithoutMember(false)
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId !== null && !event.target.closest(".dropdown-container")) {
        setOpenDropdownId(null)
      }
      if (showMemberResults && !event.target.closest(".member-search-container")) {
        setShowMemberResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdownId, showMemberResults])

  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isEditModeActive, setIsEditModeActive] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  const sortItems = (items, sortBy, sortDirection) => {
    if (sortBy === "custom") {
      // Sort by position for custom ordering
      return [...items].sort((a, b) => a.position - b.position)
    }

    const sortedItems = [...items].sort((a, b) => {
      let comparison
      if (sortBy === "articalNo") {
        comparison = (a.articalNo || "").localeCompare(b.articalNo || "")
      } else {
        comparison = a[sortBy] > b[sortBy] ? 1 : a[sortBy] < b[sortBy] ? -1 : 0
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
    return sortedItems
  }

  const handleDragStart = (e, item, index) => {
    e.dataTransfer.setData("itemId", item.id)
    e.dataTransfer.setData("itemIndex", index)
    e.dataTransfer.setData("itemType", activeTab)
    e.currentTarget.classList.add("dragging")
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add("drag-over")
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over")
  }

  const handleDrop = (e, targetIndex) => {
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

  const moveItem = (fromIndex, direction, isService = false) => {
    const items = isService ? services : products
    const setItems = isService ? setServices : setProducts
    const newItems = [...items]
    let columns = 1
    const width = window.innerWidth
    if (width >= 1280) columns = 6
    else if (width >= 1024) columns = 4
    else if (width >= 768) columns = 3
    else if (width >= 640) columns = 2
    let toIndex
    switch (direction) {
      case "left":
        if (fromIndex % columns !== 0) {
          toIndex = fromIndex - 1
        }
        break
      case "right":
        if ((fromIndex + 1) % columns !== 0 && fromIndex < items.length - 1) {
          toIndex = fromIndex + 1
        }
        break
      default:
        return
    }
    if (toIndex !== undefined && toIndex !== fromIndex) {
      const [movedItem] = newItems.splice(fromIndex, 1)
      newItems.splice(toIndex, 0, movedItem)
      newItems.forEach((item, index) => {
        item.position = index
      })
      setItems(newItems)
    }
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

  return (
    <div
      className={`
      min-h-screen rounded-3xl text-white bg-[#1C1C1C]
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen
          ? "lg:mr-[35%] md:mr-96 sm:mr-96" // Adjust right margin when sidebar is open on larger screens
          : "mr-0" // No margin when closed
        }
    `}
    >
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
      {isModalOpen && (
        <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg open_sans_font_700">
                  {modalMode === "add"
                    ? `Add ${activeTab === "services" ? "Service" : "Product"}`
                    : `Edit ${activeTab === "services" ? "Service" : "Product"}`}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit()
                }}
                className="space-y-3 custom-scrollbar overflow-y-auto max-h-[70vh]"
              >
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                    <img
                      src={selectedImage || currentProduct?.image || ProductImage}
                      alt={activeTab === "services" ? "Service" : "Product"}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-upload"
                    ref={fileInputRef}
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
                  >
                    Upload picture
                  </label>
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    {activeTab === "services" ? "Service" : "Product"} name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={`Enter ${activeTab === "services" ? "service" : "product"} name`}
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    required
                  />
                </div>
                <div className={"grid grid-cols-2 gap-4"}>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Price *</label>
                    <div className="flex items-center rounded-xl bg-[#101010] border border-transparent focus-within:border-[#3F74FF] transition-colors">
                      <span className="px-3 text-white text-sm">€</span>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="w-full bg-transparent text-sm py-3 pr-4 text-white placeholder-gray-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                  {activeTab === "products" && (
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Article Number</label>
                      <input
                        type="text"
                        name="articalNo"
                        value={formData.articalNo}
                        onChange={handleInputChange}
                        placeholder="Enter article no"
                        className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="text-sm text-gray-200 block mb-2">VAT Rate (%)</label>
    <select
      name="vatRate"
      value={formData.vatRate}
      onChange={handleInputChange}
      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
    >
      <option value="0">0%</option>
      <option value="7">7%</option>
      <option value="19">19%</option>
      <option value="custom">Custom</option>
    </select>
  </div>
  {formData.vatRate === "custom" && (
    <div>
      <label className="text-sm text-gray-200 block mb-2">Custom VAT Rate</label>
      <input
        type="number"
        name="customVatRate"
        value={formData.customVatRate || ""}
        onChange={handleInputChange}
        placeholder="Enter VAT rate"
        min="0"
        max="100"
        
        className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
      />
    </div>
  )}
</div>

<div className="flex items-center space-x-2">
  <input
    type="checkbox"
    id="vatSelectable"
    name="vatSelectable"
    checked={formData.vatSelectable}
    onChange={handleInputChange}
    className="rounded border-gray-300 text-[#3F74FF] focus:ring-[#3F74FF] focus:ring-2"
  />
  <label htmlFor="vatSelectable" className="text-sm text-gray-200">
    Allow VAT rate selection during checkout
  </label>
</div>
                {activeTab === "products" && (
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Brand</label>
                    <input
                      type="text"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-gray-400 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Link (Optional)</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  />
                </div>
                <div className="flex flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-2.5 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:w-auto px-8 py-2.5 bg-transparent text-sm text-white rounded-xl border border-[#333333] hover:bg-[#101010] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-8">
          {/* Main Header Row */}
          <div className="flex items-center justify-between gap-3 mb-6">
            {/* Left side - Title and Tab Buttons */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-bold oxanium_font whitespace-nowrap">Selling</h1>
              {/* Tab Buttons */}
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
                  onClick={() => setShowHistoryModal(true)}
                  className="text-white md:w-12 w-full  bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                  title="View Sales Journal"
                >
                  <History size={25} />
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
              <button
                onClick={toggleRightSidebar}
                className="cursor-pointer rounded-md text-sm hover:bg-white hover:text-black transition-colors flex items-center gap-2 p-2 relative"
                title="Open Shopping Cart"
              >
                <IoIosMenu size={25} />
                {cart.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center absolute -top-1 -right-1">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="hidden lg:flex items-center mb-3 justify-end gap-2">
            <label htmlFor="sort" className="text-sm text-gray-200 whitespace-nowrap">
              Sort:
            </label>
            <select
              id="sort"
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split("-")
                setSortBy(field)
                setSortDirection(direction)
              }}
              className="md:w-auto w-full flex cursor-pointer items-center justify-center  gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] "
            >
              <option value="custom-asc">Custom</option>
              <option value="name-asc">Name ↑</option>
              <option value="name-desc">Name ↓</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              {activeTab === "products" && (
                <>
                  <option value="articalNo-asc">Article No. ↑</option>
                  <option value="articalNo-desc">Article No. ↓</option>
                </>
              )}
            </select>
          </div>
          <div className="flex gap-2 items-center mb-4">
            <div className="relative flex-1">
              <input
                type="search"
                placeholder={`Search by name${activeTab === "products" ? ", brand or article number..." : ""}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#181818] text-white rounded-xl px-4 py-2 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
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
            {/* Desktop Menu button */}
          </div>
          <div className="md:hidden block mb-5 w-full">
            <label htmlFor="sort" className="text-sm text-gray-200 hidden whitespace-nowrap">
              Sort:
            </label>
            <div className="flex flex-col gap-3">
              <select
                id="sort"
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split("-")
                  setSortBy(field)
                  setSortDirection(direction)
                }}
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              >
                <option value="custom-asc">Custom</option>
                <option value="name-asc">Name ↑</option>
                <option value="name-desc">Name ↓</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                {activeTab === "products" && (
                  <>
                    <option value="articalNo-asc">Article No. ↑</option>
                    <option value="articalNo-desc">Article No. ↓</option>
                  </>
                )}
              </select>
            </div>
          </div>
          {isEditModeActive && (
            <div className="bg-[#101010] p-3 rounded-xl mb-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <Move size={16} className="text-[#3F74FF]" />
                <span>
                  Drag and drop {activeTab} to reorder them, or use the arrow buttons to move in specific directions
                </span>
              </div>
            </div>
          )}

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
  ${isRightSidebarOpen ? "lg:grid-cols-3 xl:grid-cols-3" : "lg:grid-cols-4 xl:grid-cols-5"} 
  gap-3`}
          >
            {sortItems(getFilteredItems(), sortBy, sortDirection).map((item, index) => (
              <div
                key={item.id}
                className={`w-full bg-[#181818] rounded-2xl overflow-visible relative draggable-item ${isEditModeActive ? "animate-wobble" : ""
                  }`}
                draggable={isEditModeActive}
                onDragStart={(e) => handleDragStart(e, item, index)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                {isEditModeActive && (
                  <div className="absolute top-2 left-2 z-10 bg-black/70 rounded-lg p-1 flex flex-col gap-1">
                    <button
                      onClick={() => moveItem(index, "left", activeTab === "services")}
                      className="p-1.5 rounded-md hover:bg-[#333333] text-white"
                      title="Move Left"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      onClick={() => moveItem(index, "right", activeTab === "services")}
                      className="p-1.5 rounded-md hover:bg-[#333333] text-white"
                      title="Move Right"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
                {isEditModeActive && (
                  <div className="absolute top-2 right-2 z-10 bg-[#3F74FF] text-white rounded-full p-1.5">
                    <Move size={16} />
                  </div>
                )}
                <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
                  <img src={item.image || ProductImage} alt={item.name} className="object-cover w-full h-full" />
                  {!isEditModeActive && (
                    <button
                      onClick={() => addToCart(item)}
                      className="absolute bottom-3 right-3 bg-[#3F74FF] hover:bg-[#3F74FF]/90 text-white p-2 rounded-full transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingBasket size={16} />
                    </button>
                  )}
                  {item.link && !isEditModeActive && (
                    <button
                      onClick={() => window.open(item.link, "_blank")}
                      className="absolute bottom-3 left-3 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                      aria-label="Open link"
                    >
                      <ExternalLink size={16} />
                    </button>
                  )}
                </div>
                <div className="p-3">
                  <div className="">
                    <h3 className="text-base font-medium mb-1 oxanium_font truncate">{item.name}</h3>
                    {activeTab === "products" && item.brandName && (
                      <p className="text-xs text-slate-200 mb-1 open_sans_font">{item.brandName}</p>
                    )}
                    {activeTab === "products" && item.articalNo && (
                      <p className="text-xs text-slate-400 mb-1 open_sans_font">Art. No: {item.articalNo}</p>
                    )}
                    <p className="text-lg font-bold text-white mb-2">${item.price.toFixed(2)}</p>
                  </div>
                  {isEditModeActive && (
                    <div className="mt-2 relative">
                      {" "}
                      {/* Added relative positioning here */}
                      <div className="flex justify-end items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                          }}
                          className="bg-black text-white rounded-xl py-1.5 px-3 border border-slate-600 text-sm cursor-pointer"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openDropdownId === item.id && (
                          <div className="absolute top-full right-0 mt-1 w-36 bg-[#101010] rounded-xl shadow-lg z-[60] border border-[#333333] dropdown-container">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditModal(item)
                                setOpenDropdownId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-[#181818] transition-colors rounded-t-xl"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openDeleteModal(item)
                                setOpenDropdownId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#181818] transition-colors rounded-b-xl"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Sidebar Component */}
      <SidebarAreaSelling
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        communications={communications}
        todos={todos}
        birthdays={birthdays}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        redirectToCommunication={() => console.log("Redirect to communication")}
        redirectToTodos={() => console.log("Redirect to todos")}
        toggleDropdown={toggleDropdown}
        openDropdownIndex={openDropdownIndex}
        setEditingLink={() => { }}
        isEditing={false}
        // Shopping cart props
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        discount={discount}
        setDiscount={setDiscount}
        selectedVat={selectedVat}
        setSelectedVat={setSelectedVat}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
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
      />
      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-pointer"
          onClick={() => setIsRightSidebarOpen(false)}
        ></div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <SalesJournalModal
          salesHistory={salesHistory}
          onClose={() => setShowHistoryModal(false)}
          cancelSale={cancelSale}
          downloadInvoice={downloadInvoice}
          salesFilter={salesFilter}
          setSalesFilter={setSalesFilter}
        />
      )}
      <style jsx>{`
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
      `}</style>
    </div>
  )
}



export default App
