"use client"

/* eslint-disable no-unused-vars */
import { useState, useRef } from "react"
import { X, Plus, Upload } from "lucide-react"
import ProductImage from "../../public/product.svg"

function App() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add") // "add" or "edit"
  const [currentProduct, setCurrentProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    price: "",
    sku: "",
    paymentOption: "",
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
    {
      id: 2,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
  ])

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Snickers Off-White 2024",
      brand: "NIKE",
      price: 38.0,
      image: ProductImage,
      details: "",
      sku: "SKU123",
      paymentOption: "Card",
    },
    {
      id: 2,
      name: "Snickers Off-White 2024",
      brand: "NIKE",
      price: 38.0,
      image: ProductImage,
      details: "",
      sku: "SKU456",
      paymentOption: "Card",
    },
  ])

  const removeNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const openAddModal = () => {
    setModalMode("add")
    setFormData({
      name: "",
      details: "",
      price: "",
      sku: "",
      paymentOption: "",
    })
    setSelectedImage(null)
    setCurrentProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setModalMode("edit")
    setFormData({
      name: product.name,
      details: product.details || "",
      price: product.price.toString(),
      sku: product.sku || "",
      paymentOption: product.paymentOption || "",
    })
    setSelectedImage(null)
    setCurrentProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = () => {
    if (modalMode === "add") {
      // Add new product
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        brand: "NIKE", // Default brand
        price: Number.parseFloat(formData.price) || 0,
        image: selectedImage || ProductImage,
        details: formData.details,
        sku: formData.sku,
        paymentOption: formData.paymentOption,
      }
      setProducts([...products, newProduct])
    } else {
      // Edit existing product
      const updatedProducts = products.map((product) => {
        if (product.id === currentProduct.id) {
          return {
            ...product,
            name: formData.name,
            price: Number.parseFloat(formData.price) || product.price,
            details: formData.details,
            sku: formData.sku,
            paymentOption: formData.paymentOption,
            image: selectedImage || product.image,
          }
        }
        return product
      })
      setProducts(updatedProducts)
    }
    closeModal()
  }

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] text-white min-h-screen relative">
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg open_sans_font_700">
                  {modalMode === "add" ? "Add Product" : "Edit Product"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }} 
                className="space-y-3 custom-scrollbar overflow-y-auto max-h-[70vh]"
              >
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                    <img
                      src={selectedImage || (currentProduct?.image || ProductImage)}
                      alt="Product"
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
                    Product name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    Details
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Enter SKU"
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    Payment option
                  </label>
                  <select
                    name="paymentOption"
                    value={formData.paymentOption}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    required
                  >
                    <option value="">Select payment option</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value="NIKE"
                    disabled
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-gray-400 outline-none border border-transparent"
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl md:text-2xl font-bold oxanium_font">Selling</h1>

            <div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 w-full sm:w-auto bg-[#FF843E] text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#FF843E]/90 transition-colors duration-200"
              >
                <Plus size={16} />
                Add Products
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {products.map((product) => (
              <div key={product.id} className="w-full bg-[#181818] p-6 rounded-2xl overflow-hidden">
                <div className="">
                  <img
                    src={product.image || ProductImage}
                    alt={product.name}
                    className="object-cover h-full w-full rounded-2xl"
                  />
                </div>
                <div className="p-4 flex justify-between">
                  <div className="">
                    <h3 className="text-lg font-medium mb-1 oxanium_font">{product.name}</h3>
                    <p className="text-sm text-slate-200 mb-1 open_sans_font">{product.brand}</p>
                    <p className="text-lg font-bold text-gray-400 ">${product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-black text-white rounded-xl py-1.5 px-7 border border-slate-600 text-sm cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
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
          <h2 className="text-xl md:text-2xl font-bold oxanium_font">Notification</h2>
          <button
            onClick={toggleRightSidebar}
            className="lg:hidden p-2 hover:bg-zinc-700 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#1C1C1C] rounded-lg p-4 relative transform transition-all duration-200 hover:scale-[1.02]"
            >
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors duration-200"
              >
                <X size={16} />
              </button>
              <h3 className="mb-2 oxanium_font">{notification.heading}</h3>
              <p className="text-sm open_sans_font text-zinc-400">{notification.description}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default App