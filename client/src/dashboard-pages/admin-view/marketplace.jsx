/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { IoIosMenu } from 'react-icons/io';
import { FaInfoCircle, FaThumbtack, FaPlus } from 'react-icons/fa';
import { HiInformationCircle } from 'react-icons/hi';

import WebsiteLinkModal from '../../components/admin-dashboard-components/myarea-components/website-link-modal';
import WidgetSelectionModal from '../../components/admin-dashboard-components/myarea-components/widgets';
import ConfirmationModal from '../../components/admin-dashboard-components/myarea-components/confirmation-modal';
import Sidebar from '../../components/admin-dashboard-components/central-sidebar';
import ProductModal from '../../components/admin-dashboard-components/marketplace-components/ProductModal';
import DeleteConfirmationModal from '../../components/admin-dashboard-components/marketplace-components/DeleteConfirmationModal';
import ProductInfoModal from '../../components/admin-dashboard-components/marketplace-components/ProductInfoModal';

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
      infoText: '',
      isActive: true
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
      infoText: 'Latest iPhone model with titanium design and advanced camera system',
      isActive: true
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
      infoText: 'Industry-leading noise cancellation with 30-hour battery life',
      isActive: false
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
    infoText: '',
    isActive: true
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
      infoText: '',
      isActive: true
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
      infoText: product.infoText || '',
      isActive: product.isActive
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

  const toggleProductStatus = (productId) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, isActive: !product.isActive }
        : product
    ));
    
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(product.isActive ? 'Product deactivated' : 'Product activated!');
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
        setFormData(prev => ({
          ...prev,
          picture: file,
          picturePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePicture = () => {
    setFormData(prev => ({
      ...prev,
      picture: null,
      picturePreview: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      brandName: formData.brandName,
      productName: formData.productName,
      articleNo: formData.articleNo,
      price: formData.price,
      link: formData.link,
      picture: formData.picturePreview || (editingProduct ? editingProduct.picture : ''),
      infoText: formData.infoText,
      isPinned: editingProduct ? editingProduct.isPinned : false,
      isActive: formData.isActive
    };

    if (editingProduct) {
      setProducts(products.map(product =>
        product.id === editingProduct.id
          ? { ...productData, id: editingProduct.id }
          : product
      ));
      toast.success('Product updated successfully!');
    } else {
      const newProduct = {
        ...productData,
        id: Date.now().toString()
      };
      setProducts([...products, newProduct]);
      toast.success('Product added successfully!');
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(product => product.id !== productToDelete.id));
      closeDeleteModal();
      toast.success('Product deleted successfully!');
    }
  };

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
          
          <img
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="h-5 w-5 mr-5 lg:hidden md:hidden block  cursor-pointer"
              src="/icon.svg"
              alt=""
            />
        </div>

        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-2 cursor-pointer rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <FaPlus size={14} />
            <span>Add Product</span>
          </button>
          <img
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="h-5 w-5 mr-5 lg:block md:block hidden cursor-pointer"
              src="/icon.svg"
              alt=""
            />
        </div>
      </div>

      <button
        onClick={openAddModal}
        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 lg:hidden md:hidden flex justify-center items-center w-full mb-3 text-sm text-white px-6 py-2 cursor-pointer rounded-lg font-medium transition-colors duration-200 gap-2"
      >
        <FaPlus size={14} />
        <span>Add Product</span>
      </button>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-sm mb-4">No products added yet</div>
          <button
            onClick={openAddModal}
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-sm text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <FaPlus size={14} />
            <span>Add Product</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <div 
              key={product.id} 
              className={`
                bg-[#1C1C1C] rounded-lg border-slate-400/40 overflow-hidden border transition-colors duration-200 relative
                ${!product.isActive ? 'opacity-60' : ''}
              `}
            >


              {/* Pin Badge */}
              {product.isPinned && (
                <div className="absolute top-3 left-2 bg-[#FF6B35] text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
                  <FaThumbtack size={10} className="text-white" />
                  <span className="text-white">Pinned</span>
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
                {/* Pin Button */}
                <button
                  onClick={() => togglePinProduct(product.id)}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    product.isPinned 
                      ? 'bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                  title={product.isPinned ? 'Unpin Product' : 'Pin Product'}
                >
                  <FaThumbtack size={14} className={product.isPinned ? 'text-white' : ''} />
                </button>
                
                {/* Info Button */}
                <button
                  onClick={() => openInfoModal(product)}
                  className="bg-blue-600 text-white p-2 rounded-full transition-colors duration-200 hover:bg-blue-700"
                  title="View Info"
                >
                  <FaInfoCircle size={14} />
                </button>
                
                {/* Edit Button */}
                <button
                  onClick={() => openEditModal(product)}
                  className="bg-gray-600 text-white p-2 rounded-full transition-colors duration-200 hover:bg-gray-700"
                  title="Edit Product"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                {/* Delete Button */}
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
                      <HiInformationCircle size={18} />
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

                {/* Active/Inactive Toggle - Added below View Product link */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <span className="text-sm text-gray-300">Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      onChange={() => toggleProductStatus(product.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        handleRemovePicture={handleRemovePicture}
        handleSubmit={handleSubmit}
        triggerFileInput={triggerFileInput}
        fileInputRef={fileInputRef}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        productToDelete={productToDelete}
      />

      {/* Product Info Modal */}
      <ProductInfoModal
        isOpen={isInfoModalOpen}
        onClose={closeInfoModal}
        productForInfo={productForInfo}
        onEditClick={openEditModal}
      />

      {/* Sidebar */}
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
        onToggleEditing={()=>{ setIsEditing(!isEditing);}}
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