/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Users, DollarSign, Target, TrendingUp } from "lucide-react";
import { IoIosMenu } from "react-icons/io";
import Sidebar from "../../components/admin-dashboard-components/central-sidebar";
import ConfirmationModal from "../../components/admin-dashboard-components/myarea-components/confirmation-modal";
import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets";
import toast from "react-hot-toast";
import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal";

export default function Analytics() {
  const [selectedMetric, setSelectedMetric] = useState("Studios Acquired");

  //sidebar related logic
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

  const handleToggleEditing = () => {
    setIsEditing(!isEditing);
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


  const analyticsData = {
    "Studios Acquired": {
      data: [30, 45, 60, 75, 90, 105, 120, 135, 150],
      growth: "12%",
      title: "Studios Acquired",
      icon: Users,
      color: "#FF6B1A"
    },
    Finance: {
      data: [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
      growth: "8%",
      title: "Finance Statistics",
      icon: DollarSign,
      color: "#10B981"
    },
    Leads: {
      data: [120, 150, 180, 210, 240, 270, 300, 330, 360],
      growth: "15%",
      title: "Leads Statistics",
      icon: Target,
      color: "#3B82F6"
    },
    Franchises: {
      data: [10, 15, 22, 28, 35, 42, 50, 58, 65],
      growth: "10%",
      title: "Franchises Acquired",
      icon: TrendingUp,
      color: "#8B5CF6"
    },
  };

  const KPICard = ({ metric, data }) => {
    const IconComponent = data.icon;
    const currentValue = data.data[8]; // December value
    const previousValue = data.data[7]; // November value
    const monthlyGrowth = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
    
    return (
      <div 
        className={`p-6 rounded-xl transition-all duration-300 bg-[#161616]`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${data.color}20` }}>
              <IconComponent size={24} style={{ color: data.color }} />
            </div>
            <div>
              <span className="text-lg font-medium">{metric}</span>
              <div className="text-sm text-zinc-400">2024 Performance</div>
            </div>
          </div>
          <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${data.color}20`, color: data.color }}>
            ↑ {data.growth}
          </span>
        </div>
        
        {/* Main Metric */}
        <div className="mb-4">
          <div className="text-2xl font-bold mb-1">
            {metric === "Finance" ? `$${currentValue.toLocaleString()}` : currentValue.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400">Current Value (Dec 2024)</div>
        </div>

        {/* Growth Indicator */}
        <div className="p-3 bg-black rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Monthly Growth</span>
            <span className={`text-lg font-semibold ${monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {monthlyGrowth >= 0 ? '↑' : '↓'} {Math.abs(monthlyGrowth)}%
            </span>
          </div>
        </div>

       
      </div>
    );
  };

  return (
    <div className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen
      ? 'lg:mr-86 mr-0' 
      : 'mr-0' 
    }
    `}>
      <div className="">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-2">Analytics</h1>
          <div onClick={toggleRightSidebar} className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
            <IoIosMenu size={26}/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {Object.entries(analyticsData).map(([metric, data]) => (
            <div key={metric} onClick={() => setSelectedMetric(metric)}>
              <KPICard metric={metric} data={data} />
            </div>
          ))}
        </div>

      
      </div>

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
          onToggleEditing={handleToggleEditing} // Add this line
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
}