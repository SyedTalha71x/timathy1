/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { IoIosMenu } from 'react-icons/io';
import { FaInfoCircle, FaThumbtack } from 'react-icons/fa';

import WebsiteLinkModal from '../../components/admin-dashboard-components/myarea-components/website-link-modal';
import WidgetSelectionModal from '../../components/admin-dashboard-components/myarea-components/widgets';
import ConfirmationModal from '../../components/admin-dashboard-components/myarea-components/confirmation-modal';
import Sidebar from '../../components/admin-dashboard-components/central-sidebar';

const Marketplace = () => {
  const sampleProducts = [
    {
      id: '1',
      brandName: 'Nike',
      productName: 'Air Jordan 1 Retro High',
      articleNo: '555088-101',
      price: '180.00',
      link: 'https://nike.com/air-jordan-1',
      picture: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
      isPinned: false,
      infoText: ''
    },
    {
      id: '2',
      brandName: 'Apple',
      productName: 'iPhone 15 Pro',
      articleNo: 'MPXN3LL/A',
      price: '999.00',
      link: 'https://apple.com/iphone-15',
      picture: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
      isPinned: true,
      infoText: 'Latest iPhone model with titanium design and advanced camera system'
    },
    {
      id: '3',
      brandName: 'Sony',
      productName: 'WH-1000XM5 Headphones',
      articleNo: 'WH1000XM5/B',
      price: '399.99',
      link: 'https://sony.com/wh-1000xm5',
      picture: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      isPinned: false,
      infoText: 'Industry-leading noise cancellation with 30-hour battery life'
    }
  ];

  const [products, setProducts] = useState(sampleProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productForInfo, setProductForInfo] = useState(null);
  const [formData, setFormData] = useState({
    brandName: '',
    productName: '',
    articleNo: '',
    price: '',
    link: '',
    picture: null,
    picturePreview: '',
    infoText: ''
  });

  const fileInputRef = useRef(null);

  //sidebar related logic and states 
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
  const [editingLink, setEditingLink] = useState(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "sidebar-chart", type: "chart", position: 0 },
    { id: "sidebar-todo", type: "todo", position: 1 },
    { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
    { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
    { id: "sidebar-notes", type: "notes", position: 4 },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
      dueDate: "2024-12-15",
      dueTime: "14:30",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
      dueDate: "2024-12-16",
      dueTime: "10:00",
    },
  ])

  const memberTypes = {
    "Studios Acquired": {
      data: [
        [30, 45, 60, 75, 90, 105, 120, 135, 150],
        [25, 40, 55, 70, 85, 100, 115, 130, 145],
      ],
      growth: "12%",
      title: "Studios Acquired",
    },
    Finance: {
      data: [
        [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
        [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
      ],
      growth: "8%",
      title: "Finance Statistics",
    },
    Leads: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "15%",
      title: "Leads Statistics",
    },
    Franchises: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "10%",
      title: "Franchises Acquired",
    },
  }

  const [customLinks, setCustomLinks] = useState([
    {
      id: "link1",
      url: "https://fitness-web-kappa.vercel.app/",
      title: "Timathy Fitness Town",
    },
    { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
    { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
  ])

  const [expiringContracts, setExpiringContracts] = useState([
    {
      id: 1,
      title: "Oxygen Gym Membership",
      expiryDate: "June 30, 2025",
      status: "Expiring Soon",
    },
    {
      id: 2,
      title: "Timathy Fitness Equipment Lease",
      expiryDate: "July 15, 2025",
      status: "Expiring Soon",
    },
    {
      id: 3,
      title: "Studio Space Rental",
      expiryDate: "August 5, 2025",
      status: "Expiring Soon",
    },
    {
      id: 4,
      title: "Insurance Policy",
      expiryDate: "September 10, 2025",
      status: "Expiring Soon",
    },
    {
      id: 5,
      title: "Software License",
      expiryDate: "October 20, 2025",
      status: "Expiring Soon",
    },
  ])

  // -------------- end of sidebar logic

  // Sort products: pinned products first
  const sortedProducts = [...products].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      brandName: '',
      productName: '',
      articleNo: '',
      price: '',
      link: '',
      picture: null,
      picturePreview: '',
      infoText: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      brandName: product.brandName,
      productName: product.productName,
      articleNo: product.articleNo,
      price: product.price,
      link: product.link,
      picture: null,
      picturePreview: product.picture || '',
      infoText: product.infoText || ''
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (product) => {
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
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, isPinned: !product.isPinned }
        : product
    ));
    
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(product.isPinned ? 'Product unpinned' : 'Product pinned!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          picture: file,
          picturePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Remove picture
  const handleRemovePicture = () => {
    setFormData(prev => ({
      ...prev,
      picture: null,
      picturePreview: ''
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create product data
    const productData = {
      brandName: formData.brandName,
      productName: formData.productName,
      articleNo: formData.articleNo,
      price: formData.price,
      link: formData.link,
      picture: formData.picturePreview || (editingProduct ? editingProduct.picture : ''),
      infoText: formData.infoText,
      isPinned: editingProduct ? editingProduct.isPinned : false
    };

    if (editingProduct) {
      // Update existing product
      setProducts(products.map(product =>
        product.id === editingProduct.id
          ? { ...productData, id: editingProduct.id }
          : product
      ));
      toast.success('Product updated successfully!');
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: Date.now().toString()
      };
      setProducts([...products, newProduct]);
      toast.success('Product added successfully!');
    }

    setIsModalOpen(false);
  };

  // Confirm and delete product
  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(product => product.id !== productToDelete.id));
      closeDeleteModal();
      toast.success('Product deleted successfully!');
    }
  };

  // continue sidebar logic
  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

    return { canAdd: true, location: null }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  return (
    <div className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen
        ? 'lg:mr-86 mr-0'
        : 'mr-0'
      }
    `}>
      <div className="mb-8 flex items-center justify-between">
        <div className='flex justify-between items-center gap-2 md:w-auto w-full'>

          <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
          <div onClick={toggleRightSidebar} className="cursor-pointer lg:hidden md:hidden block text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
            <IoIosMenu size={26} />
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="bg-blue-600 lg:block md:block hidden text-sm hover:bg-blue-700 text-white px-6 py-2 cursor-pointer rounded-lg font-medium transition-colors duration-200"
          >
            Add New Product
          </button>
          <div onClick={toggleRightSidebar} className="cursor-pointer lg:block md:block hidden text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
            <IoIosMenu size={26} />
          </div>
        </div>
      </div>

      <button
        onClick={openAddModal}
        className="bg-blue-600 lg:hidden md:hidden flex justify-center items-center w-full mb-3 text-sm hover:bg-blue-700 text-white px-6 py-2 cursor-pointer rounded-lg font-medium transition-colors duration-200"
      >
        Add New Product
      </button>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-sm mb-4">No products added yet</div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-sm text-white px-6 py-2 rounded-lg"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <div 
              key={product.id} 
              className={`
                bg-[#1C1C1C] rounded-lg border-slate-400/40 overflow-hidden border transition-colors duration-200 relative
                
              `}
            >
              {/* Pin Badge */}
              {product.isPinned && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
                  <FaThumbtack size={10} />
                  Pinned
                </div>
              )}

              <div className="h-48 bg-[#101010] flex items-center justify-center overflow-hidden">
                {product.picture ? (
                  <img
                    src={product.picture}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500 text-4xl">📷</div>
                )}
              </div>

              {/* Action Icons */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => togglePinProduct(product.id)}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    product.isPinned 
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                  title={product.isPinned ? 'Unpin Product' : 'Pin Product'}
                >
                  <FaThumbtack size={14} />
                </button>
                
                {product.infoText && (
                  <button
                    onClick={() => openInfoModal(product)}
                    className="bg-blue-600 text-white p-2 rounded-full transition-colors duration-200 hover:bg-blue-700"
                    title="View Info"
                  >
                    <FaInfoCircle size={14} />
                  </button>
                )}
                
                <button
                  onClick={() => openEditModal(product)}
                  className="bg-gray-600 text-white p-2 rounded-full transition-colors duration-200 hover:bg-gray-700"
                  title="Edit Product"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => openDeleteModal(product)}
                  className="bg-gray-600 text-white p-2 rounded-full transition-colors duration-200 hover:bg-gray-700"
                  title="Delete Product"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white truncate flex-1 mr-2">
                    {product.productName}
                  </h3>
                  {!product.infoText && (
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      title="Add Info"
                    >
                      <FaInfoCircle size={16} />
                    </button>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-1 truncate">Brand: {product.brandName}</p>
                <p className="text-gray-400 text-sm mb-1">Article No: {product.articleNo}</p>
                <p className="text-white font-medium text-lg mb-3">${product.price}</p>

                {product.link && (
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm block mb-4 truncate"
                  >
                    View Product
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C1C] rounded-lg w-full max-w-md mx-auto max-h-[80vh] custom-scrollbar overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Picture Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Product Picture
                  </label>
                  <div className="flex flex-col items-start space-y-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2  border-gray-600/40 flex items-center justify-center">
                      {formData.picturePreview ? (
                        <img
                          src={formData.picturePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-500 text-2xl">📷</div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="product-image-upload"
                        ref={fileInputRef}
                      />
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
                      >
                        Upload Picture
                      </button>

                      {formData.picturePreview && (
                        <button
                          type="button"
                          onClick={handleRemovePicture}
                          className="bg-gray-600 hover:bg-gray-700 transition-colors text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Article No
                    </label>
                    <input
                      type="text"
                      name="articleNo"
                      value={formData.articleNo}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      placeholder="Enter article number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Link
                    </label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      placeholder="https://example.com/product"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Info
                    </label>
                    <textarea
                      name="infoText"
                      value={formData.infoText}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors resize-none"
                      placeholder="Add additional information about the product..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-600 text-sm hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-sm hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C1C] rounded-lg w-full max-w-md mx-auto">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <strong>"{productToDelete.productName}"</strong>? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 bg-gray-600 text-sm hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-sm hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Info Modal */}
      {isInfoModalOpen && productForInfo && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C1C] rounded-lg w-full max-w-md mx-auto">
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
                <h3 className="text-lg font-semibold text-white mb-2">{productForInfo.productName}</h3>
                <p className="text-gray-400 text-sm mb-1">Brand: {productForInfo.brandName}</p>
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
                  onClick={() => {
                    closeInfoModal();
                    openEditModal(productForInfo);
                  }}
                  className="flex-1 bg-blue-600 text-sm hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Edit Product
                </button>
                <button
                  onClick={closeInfoModal}
                  className="flex-1 bg-gray-600 text-sm hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* sidebar related modals */}

      <Sidebar
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        widgets={sidebarWidgets}
        setWidgets={setSidebarWidgets}
        isEditing={isEditing}
        todos={todos}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        expiringContracts={expiringContracts}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        onAddWidget={() => setIsRightWidgetModalOpen(true)}
        updateCustomLink={updateCustomLink}
        removeCustomLink={removeCustomLink}
        editingLink={editingLink}
        setEditingLink={setEditingLink}
        openDropdownIndex={openDropdownIndex}
        setOpenDropdownIndex={setOpenDropdownIndex}
        onToggleEditing={()=>{ setIsEditing(!isEditing);}} // Add this line
        setTodos={setTodos}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
        onConfirm={confirmRemoveLink}
        title="Delete Website Link"
        message="Are you sure you want to delete this website link? This action cannot be undone."
      />

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddSidebarWidget}
        getWidgetStatus={getSidebarWidgetStatus}
        widgetArea="sidebar"
      />

      {editingLink && (
        <WebsiteLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          updateCustomLink={updateCustomLink}
          setCustomLinks={setCustomLinks}
        />
      )}
    </div>
  );
};

export default Marketplace;