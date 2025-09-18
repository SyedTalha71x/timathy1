/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import {
  X,
  Plus,
  ShoppingBasket,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  Edit,
  Check,
  Move,
  ExternalLink,
  History,
} from "lucide-react"
import ProductImage from "../../../public/default-avatar.avif"
import { RiServiceFill } from "react-icons/ri"
import SidebarAreaSelling from "../../components/selling-components/custom-sidebar-selling"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { IoIosMenu } from "react-icons/io"
import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { toast, Toaster } from "react-hot-toast"
import CreateTempMemberModal from "../../components/selling-components/create-temp-member-modal"
import DeleteConfirmationModal from "../../components/selling-components/delete-confirmation-modal"
import SalesJournalModal from "../../components/selling-components/sales-journal-modal"
import { productsMainData, sellingMainData, serviceMainData } from "../../utils/user-panel-states/selling-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"


// sidebar related import
import EditTaskModal from "../../components/task-components/edit-task-modal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import EditAppointmentModal from "../../components/appointments-components/selected-appointment-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import AppointmentActionModal from "../../components/appointments-components/appointment-action-modal"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import Sidebar from "../../components/central-sidebar"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'
import { MemberOverviewModal } from "../../components/myarea-components/MemberOverviewModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"

function App() {

  const sidebarSystem = useSidebarSystem();
  const trainingVideos = trainingVideosData
  //
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showCreateTempMemberModal, setShowCreateTempMemberModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [modalMode, setModalMode] = useState("add") // "add" or "edit"
  const [currentProduct, setCurrentProduct] = useState(null)
  const [activeTab, setActiveTab] = useState("products") // "products" or "services"
  const [sellWithoutMember, setSellWithoutMember] = useState(false)

  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
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
      appointmentTypes
    } = sidebarSystem;
  
    // more sidebar related functions
  
    // Chart configuration
    const chartSeries = [
      { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
      { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
    ];
  
    const chartOptions = {
      chart: {
        type: "line",
        height: 180,
        toolbar: { show: false },
        background: "transparent",
        fontFamily: "Inter, sans-serif",
      },
      colors: ["#FF6B1A", "#2E5BFF"],
      stroke: { curve: "smooth", width: 4, opacity: 1 },
      markers: {
        size: 1,
        strokeWidth: 0,
        hover: { size: 6 },
      },
      xaxis: {
        categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { colors: "#999999", fontSize: "12px" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 600,
        tickAmount: 6,
        labels: {
          style: { colors: "#999999", fontSize: "12px" },
          formatter: (value) => Math.round(value),
        },
      },
      grid: {
        show: true,
        borderColor: "#333333",
        position: "back",
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
        row: { opacity: 0.1 },
        column: { opacity: 0.1 },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        offsetY: -30,
        offsetX: -10,
        labels: { colors: "#ffffff" },
        itemMargin: { horizontal: 5 },
      },
      title: {
        text: memberTypes[selectedMemberType].title,
        align: "left",
        style: { fontSize: "16px", fontWeight: "bold", color: "#ffffff" },
      },
      subtitle: {
        text: `↑ ${memberTypes[selectedMemberType].growth} more in 2024`,
        align: "left",
        style: { fontSize: "12px", color: "#ffffff", fontWeight: "bolder" },
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
        custom: ({ series, seriesIndex, dataPointIndex, w }) =>
          '<div class="apexcharts-tooltip-box" style="background: white; color: black; padding: 8px;">' +
          '<span style="color: black;">' +
          series[seriesIndex][dataPointIndex] +
          "</span></div>",
      },
    };
  
  
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
  
    const getMemberAppointmentsWrapper = (memberId) => {
      return getMemberAppointments(memberId, appointments);
    };
  
    const handleAddBillingPeriodWrapper = () => {
      handleAddBillingPeriod(memberContingentData, setMemberContingentData);
    };
  
    const handleSaveContingentWrapper = () => {
      handleSaveContingent(memberContingentData, setMemberContingentData);
    };
  
    const handleEditSubmitWrapper = (e) => {
      handleEditSubmit(e, appointments, setAppointments);
    };
  
    const handleAddRelationWrapper = () => {
      handleAddRelation(memberRelations, setMemberRelations);
    };
  
    const handleDeleteRelationWrapper = (category, relationId) => {
      handleDeleteRelation(category, relationId, memberRelations, setMemberRelations);
    };
  
    const handleArchiveMemberWrapper = (memberId) => {
      handleArchiveMember(memberId, appointments, setAppointments);
    };
  
    const handleUnarchiveMemberWrapper = (memberId) => {
      handleUnarchiveMember(memberId, appointments, setAppointments);
    };
  
    const getBillingPeriodsWrapper = (memberId) => {
      return getBillingPeriods(memberId, memberContingentData);
    };
  
    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case "Beginner":
          return "bg-green-600"
        case "Intermediate":
          return "bg-yellow-600"
        case "Advanced":
          return "bg-red-600"
        default:
          return "bg-gray-600"
      }
    }
  
    const getVideoById = (id) => {
      return trainingVideos.find((video) => video.id === id)
    }



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

    
    <div
      className={`
      min-h-screen rounded-3xl text-white bg-[#1C1C1C]
      transition-all duration-500 ease-in-out flex-1
      ${
        isRightSidebarOpen
          ? "lg:mr-[37%] mr-0" // Adjust right margin when sidebar is open on larger screens
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
                    {selectedImage || currentProduct?.image ? (
                      <img
                        src={selectedImage || currentProduct?.image || ProductImage}
                        alt={activeTab === "services" ? "Service" : "Product"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium text-center p-2">
                        {currentProduct?.name || "New Item"}
                      </div>
                    )}
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
                    onChange={handleInputChangeMain}
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
                        onChange={handleInputChangeMain}
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
                        onChange={handleInputChangeMain}
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
                      onChange={handleInputChangeMain}
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
                        onChange={handleInputChangeMain}
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
                    onChange={handleInputChangeMain}
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
                      onChange={handleInputChangeMain}
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
                    onChange={handleInputChangeMain}
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
                  className={`px-3 md:px-4 py-2 rounded-lg text-sm flex justify-center items-center transition-colors ${
                    activeTab === "products" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <MdOutlineProductionQuantityLimits size={16} className="inline mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Products</span>
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`px-3 md:px-4 py-2 rounded-lg text-sm flex justify-center items-center transition-colors ${
                    activeTab === "services" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <RiServiceFill size={16} className="inline mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Services</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => setShowHistoryModalMain(true)}
                  className="text-white md:w-12 w-full  bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                  title="View Sales Journal"
                >
                  <History size={25} />
                </button>
              </div>
              <div>
                <button
                  onClick={() => setIsEditModeActive(!isEditModeActive)}
                  className={`p-2 cursor-pointer rounded-xl text-sm ${
                    isEditModeActive
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
                className={`w-full bg-[#181818] rounded-2xl overflow-visible relative draggable-item ${
                  isEditModeActive ? "animate-wobble" : ""
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
                  {item.image ? (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium text-center p-4">
                      {item.name}
                    </div>
                  )}
                  {!isEditModeActive && (
                    <button
                      onClick={() => addToCart(item)}
                      className="absolute bottom-3 right-3 bg-blue-800 cursor-pointer hover:bg-[#3F74FF]/90 text-white p-2 rounded-full transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingBasket size={16} />
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
          // WIDGETS TAB LOGIC - Widget system integration
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
          chartOptions={chartOptions}
          chartSeries={chartSeries}
          expiringContracts={expiringContracts}
          getWidgetPlacementStatus={getWidgetPlacementStatus}
          onSaveSpecialNote={handleSaveSpecialNoteWrapper}
          // NOTIFICATIONS TAB LOGIC - Notification system
          notifications={notifications}
          hasUnreadNotifications={notifications?.length > 0}
        />
        
      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden block cursor-pointer"
          onClick={() => setIsRightSidebarOpen(false)}
        ></div>
      )}

       {/* Sidebar related modals */}
       <TrainingPlanModal
        isOpen={isTrainingPlanModalOpen}
        onClose={() => setIsTrainingPlanModalOpen(false)}
        user={selectedUserForTrainingPlan}
        trainingPlans={mockTrainingPlans}
        getDifficultyColor={getDifficultyColor}
        getVideoById={getVideoById}
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

      <MemberOverviewModal
        isOpen={isMemberOverviewModalOpen}
        onClose={() => {
          setIsMemberOverviewModalOpen(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        calculateAge={calculateAge}
        isContractExpiringSoon={isContractExpiringSoon}
        handleCalendarFromOverview={handleCalendarFromOverview}
        handleHistoryFromOverview={handleHistoryFromOverview}
        handleCommunicationFromOverview={handleCommunicationFromOverview}
        handleViewDetailedInfo={handleViewDetailedInfo}
        handleEditFromOverview={handleEditFromOverview}
      />

      <AppointmentModal
        show={showAppointmentModal}
        member={selectedMember}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedMember(null);
        }}
        getMemberAppointments={getMemberAppointmentsWrapper}
        appointmentTypes={appointmentTypes}
        handleEditAppointment={handleEditAppointment}
        handleCancelAppointment={handleCancelAppointment}
        currentBillingPeriod={currentBillingPeriod}
        memberContingentData={memberContingentData}
        handleManageContingent={handleManageContingent}
        handleCreateNewAppointment={handleCreateNewAppointment}
      />

      <HistoryModal
        show={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        historyTab={historyTab}
        setHistoryTab={setHistoryTab}
        memberHistory={memberHistory}
      />

      <MemberDetailsModal
        isOpen={isMemberDetailsModalOpen}
        onClose={() => {
          setIsMemberDetailsModalOpen(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        memberRelations={memberRelations}
        DefaultAvatar={DefaultAvatar}
        calculateAge={calculateAge}
        isContractExpiringSoon={isContractExpiringSoon}
        redirectToContract={redirectToContract}
      />

      <ContingentModal
        show={showContingentModal}
        setShow={setShowContingentModal}
        selectedMember={selectedMember}
        getBillingPeriods={getBillingPeriodsWrapper}
        selectedBillingPeriod={selectedBillingPeriod}
        handleBillingPeriodChange={setSelectedBillingPeriod}
        setShowAddBillingPeriodModal={setShowAddBillingPeriodModal}
        tempContingent={tempContingent}
        setTempContingent={setTempContingent}
        currentBillingPeriod={currentBillingPeriod}
        handleSaveContingent={handleSaveContingentWrapper}
      />

      <AddBillingPeriodModal
        show={showAddBillingPeriodModal}
        setShow={setShowAddBillingPeriodModal}
        newBillingPeriod={newBillingPeriod}
        setNewBillingPeriod={setNewBillingPeriod}
        handleAddBillingPeriod={handleAddBillingPeriodWrapper}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        editModalTab={editModalTab}
        setEditModalTab={setEditModalTab}
        editForm={editForm}
        handleInputChange={handleInputChange}
        handleEditSubmit={handleEditSubmitWrapper}
        editingRelations={editingRelations}
        setEditingRelations={setEditingRelations}
        newRelation={newRelation}
        setNewRelation={setNewRelation}
        availableMembersLeads={availableMembersLeads}
        relationOptions={relationOptions}
        handleAddRelation={handleAddRelationWrapper}
        memberRelations={memberRelations}
        handleDeleteRelation={handleDeleteRelationWrapper}
        handleArchiveMember={handleArchiveMemberWrapper}
        handleUnarchiveMember={handleUnarchiveMemberWrapper}
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
    </>
  )
}

export default App
