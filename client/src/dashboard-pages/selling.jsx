/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect } from "react"
import {
  X,
  Plus,
  ShoppingBasket,
  Minus,
  Trash2,
  MoreVertical,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Edit,
  Check,
  Move,
  Search,
  ExternalLink,
  UserPlus,
} from "lucide-react"
import ProductImage from "../../public/1_55ce827a-2b63-4b1d-aa55-2c2b6dc6c96e.webp"
import MenJordanShows from "../../public/jd_product_list.webp"
import { FaProductHunt } from "react-icons/fa6"
import { RiServiceFill } from "react-icons/ri"

function App() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isTempMemberModalOpen, setIsTempMemberModalOpen] = useState(false)
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
  })
  const [tempMemberData, setTempMemberData] = useState({
    name: "",
    email: "",
    phone: "",
  })
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

  // Members list (example)
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Mike Johnson" },
  ])

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Snickers Off-White 2024",
      brandName: "NIKE",
      price: 38.0,
      image: ProductImage,
      articalNo: "123",
      paymentOption: "Card",
      type: "product",
      position: 0,
      link: "https://example.com/product1",
    },
    {
      id: 2,
      name: "Mens Jordan Trainer",
      brandName: "JORDAN",
      price: 48.0,
      image: MenJordanShows,
      articalNo: "456",
      paymentOption: "Card",
      type: "product",
      position: 1,
      link: "",
    },
  ])

  const [services, setServices] = useState([
    {
      id: 101,
      name: "Personal Training Session",
      price: 75.0,
      image: "https://cdn.prod.website-files.com/64649432a9fa6bf423043c60/65d3674df1397c34b67e7e9a_IMG_8049.jpg", // Added image support
      paymentOption: "Card",
      type: "service",
      position: 0,
      link: "https://example.com/training",
    },
    {
      id: 102,
      name: "Nutrition Consultation",
      price: 50.0,
      image: "https://foodandfitnesspro.com/wp-content/uploads/2022/08/iStock-1160789077-768x512.jpg", // Added image support
      paymentOption: "Cash",
      type: "service",
      position: 1,
      link: "",
    },
  ])

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
    })
    setSelectedImage(null)
    setCurrentProduct(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const closeTempMemberModal = () => {
    setIsTempMemberModalOpen(false)
    setTempMemberData({ name: "", email: "", phone: "" })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "price") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleTempMemberChange = (e) => {
    const { name, value } = e.target
    setTempMemberData({
      ...tempMemberData,
      [name]: value,
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
        image: selectedImage || ProductImage, // Services now support images
        articalNo: isService ? undefined : formData.articalNo,
        paymentOption: formData.paymentOption,
        type: isService ? "service" : "product",
        position: isService ? services.length : products.length,
        link: formData.link,
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
              image: selectedImage || item.image, // Services now support images
              brandName: isService ? undefined : formData.brandName,
              link: formData.link,
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

  const createTempMember = () => {
    const newMember = {
      id: Date.now(),
      name: tempMemberData.name,
      email: tempMemberData.email,
      phone: tempMemberData.phone,
      isTemp: true,
    }
    setMembers([...members, newMember])
    setSelectedMember(newMember.id)
    setMemberSearchQuery(newMember.name)
    setShowMemberResults(false)
    closeTempMemberModal()
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

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountValue = discount === "" ? 0 : Number.parseFloat(discount)
  const discountAmount = subtotal * (discountValue / 100)
  const afterDiscount = subtotal - discountAmount
  const vatAmount = afterDiscount * (selectedVat / 100)
  const total = afterDiscount + vatAmount

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

  const sortItems = (items, sortBy, sortDirection) => {
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

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()),
  )

  const selectMember = (member) => {
    setSelectedMember(member.id)
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
    <div className="flex rounded-3xl bg-[#1C1C1C] text-white min-h-screen relative">
      {/* Temporary Member Modal */}
      {isTempMemberModalOpen && (
        <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg open_sans_font_700">Create Temporary Member</h2>
                <button onClick={closeTempMemberModal} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  createTempMember()
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={tempMemberData.name}
                    onChange={handleTempMemberChange}
                    placeholder="Enter member name"
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={tempMemberData.email}
                    onChange={handleTempMemberChange}
                    placeholder="Enter email address"
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={tempMemberData.phone}
                    onChange={handleTempMemberChange}
                    placeholder="Enter phone number"
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  />
                </div>
                <div className="flex flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-2.5 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                  >
                    Create Member
                  </button>
                  <button
                    type="button"
                    onClick={closeTempMemberModal}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-red-500/20 p-3 rounded-full mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-white text-lg open_sans_font_700 text-center">
                  Delete {productToDelete?.type === "service" ? "Service" : "Product"}
                </h2>
                <p className="text-gray-400 text-center mt-2">
                  Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex flex-row justify-center items-center gap-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="w-full sm:w-auto px-8 py-2.5 bg-red-500 text-sm text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="w-full sm:w-auto px-8 py-2.5 bg-transparent text-sm text-white rounded-xl border border-[#333333] hover:bg-[#101010] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                {/* Image upload section - now available for both products and services */}
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
                <div className={` ${activeTab === "services" ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4"} `}>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Price *</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full bg-[#101010]  text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      required
                    />
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
          <div className="flex md:items-center items-start gap-2 md:flex-row flex-col md:justify-between justify-start md:mb-8 mb-3">
            <h1 className="text-xl md:text-2xl font-bold oxanium_font">Selling</h1>
            <div className="flex md:flex-row flex-col gap-3  items-center">
              <div className=" flex bg-[#000000] rounded-xl border border-slate-300/30 p-1">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`px-4 py-2 rounded-lg text-sm flex justify-center items-center transition-colors ${
                    activeTab === "products" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <FaProductHunt size={16} className="inline mr-2" />
                  Products
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`px-4 py-2 rounded-lg text-sm flex justify-center items-center transition-colors ${
                    activeTab === "services" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <RiServiceFill size={16} className="inline mr-2" />
                  Services
                </button>
              </div>
              <div className="flex w-full items-center gap-1">
                <button
                  onClick={openAddModal}
                  className="flex items-center justify-center gap-2 w-full md:w-auto bg-[#FF843E] text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#FF843E]/90 transition-colors duration-200"
                >
                  <Plus size={16} />
                  Add {activeTab === "services" ? "Service" : "Product"}
                </button>
                <button
                  onClick={() => setIsEditModeActive(!isEditModeActive)}
                  className={`p-2 cursor-pointer rounded-xl text-sm ${
                    isEditModeActive
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-[#333333] hover:bg-[#555555] text-gray-300"
                  } transition-colors flex items-center gap-2`}
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
          </div>

          <div className="flex justify-end md:flex-row flex-col gap-1 items-center mb-3">
            <label htmlFor="sort-by" className="mr-2 text-sm text-gray-200 lg:block hidden">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#101010] text-sm rounded-xl px-4 md:w-auto w-full py-2 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              {activeTab === "products" && <option value="articalNo">Article Number</option>}
            </select>
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              className="bg-[#101010] text-sm rounded-xl px-4 py-2 md:w-auto w-full text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors md:ml-2 ml-0"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="relative mb-4">
            <input
              type="search"
              placeholder={`Search by name${activeTab === "products" ? " or article number" : ""}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#181818] text-white rounded-xl px-4 py-2 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
            />
          </div>

          {isEditModeActive && (
            <div className="bg-[#101010] p-3 rounded-xl mb-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <Move size={16} className="text-[#3F74FF]" />
                <span>Use the arrow buttons to move {activeTab} in specific directions</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
            {sortItems(getFilteredItems(), sortBy, sortDirection).map((item, index) => (
              <div key={item.id} className="w-full bg-[#181818] rounded-2xl overflow-hidden relative">
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
                <div className="relative w-full h-48 overflow-hidden">
                  {/* Services now display images */}
                  <img
                    src={item.image || ProductImage}
                    alt={item.name}
                    className="object-cover w-full h-full rounded-t-2xl"
                  />
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
                    <p className="text-base font-bold text-gray-400">{item.price.toFixed(2)} $</p>
                    {item.link && !isEditModeActive && (
                      <button
                        onClick={() => window.open(item.link, "_blank")}
                        className="mt-2 flex items-center gap-1 text-xs text-[#3F74FF] hover:text-[#3F74FF]/80 transition-colors"
                      >
                        <ExternalLink size={12} />
                        View Link
                      </button>
                    )}
                  </div>
                  {/* Services now have the same edit/delete functionality as products */}
                  {isEditModeActive && (
                    <div className="mt-2">
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
                          <div className="absolute top-60 right-12 w-36 bg-[#101010] rounded-xl shadow-lg z-50 border border-[#333333] overflow-visible dropdown-container">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditModal(item)
                                setOpenDropdownId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-[#181818] transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openDeleteModal(item)
                                setOpenDropdownId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#181818] transition-colors"
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

      <aside
        className={`
          fixed top-0 right-0 bottom-0 w-[320px] bg-[#181818] p-6 z-50 
          lg:static lg:w-80 lg:block lg:rounded-3xl
          transform ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          transition-all duration-500 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold oxanium_font">Shopping Basket</h2>
          <button
            onClick={toggleRightSidebar}
            className="lg:hidden p-2 hover:bg-zinc-700 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Member selection with search */}
        <div className="mb-4 relative member-search-container">
          <label className="text-sm text-gray-200 block mb-2">Search Member</label>
          <div className="relative">
            <input
              type="text"
              value={memberSearchQuery}
              onChange={(e) => {
                setMemberSearchQuery(e.target.value)
                setShowMemberResults(true)
                setSellWithoutMember(false)
              }}
              onFocus={() => setShowMemberResults(true)}
              placeholder="Search for a member..."
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              disabled={sellWithoutMember}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          {showMemberResults && !sellWithoutMember && (
            <div className="absolute z-10 mt-1 w-full bg-[#101010] rounded-xl shadow-lg border border-[#333333] max-h-48 overflow-y-auto">
              <div
                onClick={() => setIsTempMemberModalOpen(true)}
                className="px-4 py-2 hover:bg-[#181818] cursor-pointer text-sm border-b border-[#333333] text-[#3F74FF] flex items-center gap-2"
              >
                <UserPlus size={16} />
                Create Temporary Member
              </div>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => selectMember(member)}
                    className="px-4 py-2 hover:bg-[#181818] cursor-pointer text-sm flex items-center justify-between"
                  >
                    <span>{member.name}</span>
                    {member.isTemp && <span className="text-xs bg-orange-500 px-2 py-1 rounded">Temp</span>}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400 text-sm">No members found</div>
              )}
            </div>
          )}
          {/* Sell without member option */}
          <div className="mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={sellWithoutMember}
                onChange={(e) => {
                  setSellWithoutMember(e.target.checked)
                  if (e.target.checked) {
                    setSelectedMember("")
                    setMemberSearchQuery("")
                    setShowMemberResults(false)
                  }
                }}
                className="rounded border-gray-300"
              />
              Sell without member
            </label>
          </div>
        </div>

        {/* Cart items */}
        <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-4">
          {cart.length === 0 ? (
            <div className="text-center py-6 text-gray-400">Your basket is empty</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-[#1C1C1C] rounded-lg p-4 relative">
                <div className="flex gap-3">
                  {/* Services now display images in cart */}
                  {item.image && (
                    <img
                      src={item.image || ProductImage}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="mb-1 oxanium_font">{item.name}</h3>
                    {item.type === "product" && item.articalNo && (
                      <p className="text-xs text-zinc-400 mb-1">Art. No: {item.articalNo}</p>
                    )}
                    <p className="text-sm font-bold">${item.price.toFixed(2)}</p>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                      {item.type === "service" ? "Service" : "Product"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-[#101010] rounded-md hover:bg-[#333333]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-[#101010] rounded-md hover:bg-[#333333]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-500 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment options */}
        {cart.length > 0 && (
          <>
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-1">
                  {["Cash", "Card", "Pay Later"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`py-2 px-3 text-sm rounded-lg border ${
                        selectedPaymentMethod === method
                          ? "border-[#3F74FF] bg-[#3F74FF]/20"
                          : "border-[#333333] hover:bg-[#101010]"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Discount (%)</label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === "" || (/^\d*\.?\d*$/.test(value) && Number.parseFloat(value) <= 100)) {
                        setDiscount(value)
                      }
                    }}
                    placeholder="0"
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">VAT (%)</label>
                  <select
                    value={selectedVat}
                    onChange={(e) => setSelectedVat(Number(e.target.value))}
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  >
                    <option value="19">19%</option>
                    <option value="7">7%</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="border-t border-[#333333] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Discount ({discountValue}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">VAT ({selectedVat}%):</span>
                <span>${vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-[#333333]">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Member/No member indicator */}
            <div className="mt-4 p-3 bg-[#101010] rounded-xl">
              <div className="text-sm text-gray-300">
                {sellWithoutMember ? (
                  <span className="text-orange-400">Selling without member</span>
                ) : selectedMember ? (
                  <span className="text-green-400">Member: {members.find((m) => m.id === selectedMember)?.name}</span>
                ) : (
                  <span className="text-gray-400">No member selected</span>
                )}
              </div>
            </div>

            {/* Checkout button */}
            <button className="w-full mt-4 bg-[#FF843E] text-sm text-white py-3 rounded-xl hover:bg-[#FF843E]/90 transition-colors">
              Checkout
            </button>
          </>
        )}
      </aside>
    </div>
  )
}

export default App
