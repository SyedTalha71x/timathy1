/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Users, DollarSign, Target, TrendingUp, BarChart3, PieChart, Calendar, ArrowUpRight, ArrowDownRight, Eye, ShoppingCart, UserCheck, Clock, ChartBar } from "lucide-react";
import { IoIosMenu } from "react-icons/io";
import Sidebar from "../../components/admin-dashboard-components/central-sidebar";
import ConfirmationModal from "../../components/admin-dashboard-components/myarea-components/confirmation-modal";
import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets";
import toast from "react-hot-toast";
import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal";

export default function Analytics() {
  const [selectedMetric, setSelectedMetric] = useState("Studios Acquired");

  //sidebar related logic - EXACTLY SAME AS BEFORE
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

  // ENHANCED ANALYTICS DATA - Only this part changed
  const analyticsData = {
    "Studios Acquired": {
      data: [30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195],
      growth: "12%",
      title: "Studios Acquired",
      icon: Users,
      color: "#FF6B1A",
      description: "Total studios in network",
      conversionRate: "85%",
      topPerformer: "Downtown Fitness"
    },
    Finance: {
      data: [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000, 175000, 190000, 210000],
      growth: "8%",
      title: "Revenue",
      icon: DollarSign,
      color: "#10B981",
      description: "Monthly revenue",
      profitMargin: "32%",
      topSource: "Membership Fees"
    },
    Leads: {
      data: [120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450],
      growth: "15%",
      title: "Leads Generated",
      icon: Target,
      color: "#3B82F6",
      description: "New leads per month",
      conversionRate: "17%",
      topSource: "Website"
    },
    Franchises: {
      data: [10, 15, 22, 28, 35, 42, 50, 58, 65, 73, 82, 90],
      growth: "10%",
      title: "Franchises Acquired",
      icon: TrendingUp,
      color: "#8B5CF6",
      description: "Active franchises",
      successRate: "92%",
      topPerformer: "Fit Nation Group"
    },
  };

  // Lead Conversion Data
  const leadConversionData = {
    totalLeads: 2450,
    converted: 420,
    conversionRate: 17.1,
    stages: [
      { name: "Generated", count: 2450, percentage: 100 },
      { name: "Contacted", count: 1890, percentage: 77 },
      { name: "Qualified", count: 1250, percentage: 51 },
      { name: "Converted", count: 420, percentage: 17 }
    ]
  };

  // Financial Insights Data
  const financialInsights = {
    revenue: 1250000,
    expenses: 845000,
    profit: 405000,
    profitMargin: 32.4,
    topStudios: [
      { name: "Downtown Fitness", revenue: 185000, growth: 12.5 },
      { name: "Elite Training", revenue: 162000, growth: 8.3 },
      { name: "Peak Performance", revenue: 148000, growth: 15.2 }
    ]
  };

  // Top Performers Data
  const topPerformers = {
    studios: [
      { name: "Downtown Fitness", revenue: 185000, members: 420, location: "NY" },
      { name: "Elite Training", revenue: 162000, members: 380, location: "LA" },
      { name: "Peak Performance", revenue: 148000, members: 350, location: "CHI" }
    ],
    franchises: [
      { name: "Fit Nation Group", studios: 28, revenue: 2850000 },
      { name: "Elite Fitness Partners", studios: 22, revenue: 2340000 },
      { name: "Urban Wellness Collective", studios: 19, revenue: 1980000 }
    ]
  };

  const KPICard = ({ metric, data }) => {
    const IconComponent = data.icon;
    const currentValue = data.data[8]; // December value
    const previousValue = data.data[7]; // November value
    const monthlyGrowth = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
    
    return (
      <div 
        className={`p-6 rounded-xl transition-all duration-300 bg-[#161616] cursor-pointer hover:bg-[#1e1e1e]`}
        onClick={() => setSelectedMetric(metric)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${data.color}20` }}>
              <IconComponent size={24} style={{ color: data.color }} />
            </div>
            <div>
              <span className="text-lg font-medium">{data.title}</span>
              <div className="text-sm text-zinc-400">{data.description}</div>
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
        <div className="p-3 bg-black rounded-lg mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Monthly Growth</span>
            <span className={`text-lg font-semibold ${monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {monthlyGrowth >= 0 ? '↑' : '↓'} {Math.abs(monthlyGrowth)}%
            </span>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="text-xs text-zinc-400">
          {data.conversionRate && `Conversion: ${data.conversionRate}`}
          {data.profitMargin && `Profit Margin: ${data.profitMargin}`}
          {data.successRate && `Success Rate: ${data.successRate}`}
          {data.topPerformer && `Top: ${data.topPerformer}`}
          {data.topSource && `Top Source: ${data.topSource}`}
        </div>
      </div>
    );
  };

  // New Components for Enhanced Analytics
  const LeadConversionFunnel = () => (
    <div className="bg-[#161616] rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <BarChart3 size={20} />
        Lead Conversion Funnel
      </h3>
      
      <div className="space-y-4">
        {leadConversionData.stages.map((stage, index) => (
          <div key={stage.name} className="flex items-center justify-between p-4 bg-black rounded-lg">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${index === 0 ? 'bg-blue-500' : 
                  index === 1 ? 'bg-green-500' : 
                  index === 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
              >
                {index + 1}
              </div>
              <div>
                <div className="font-medium">{stage.name}</div>
                <div className="text-sm text-zinc-400">{stage.count.toLocaleString()} leads</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{stage.percentage}%</div>
              <div className="text-xs text-zinc-400">Conversion</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-black rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-zinc-400">Overall Conversion Rate</div>
            <div className="text-2xl font-bold text-green-500">{leadConversionData.conversionRate}%</div>
          </div>
          <div className="text-right">
            <div className="text-zinc-400">Total Leads</div>
            <div className="text-xl font-bold">{leadConversionData.totalLeads.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const FinancialInsights = () => (
    <div className="bg-[#161616] rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <DollarSign size={20} />
        Financial Insights
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-black rounded-lg">
          <div className="text-zinc-400 text-sm">Total Revenue</div>
          <div className="text-2xl font-bold text-green-500">${(financialInsights.revenue / 1000).toFixed(0)}K</div>
        </div>
        <div className="p-4 bg-black rounded-lg">
          <div className="text-zinc-400 text-sm">Total Expenses</div>
          <div className="text-2xl font-bold text-orange-500">${(financialInsights.expenses / 1000).toFixed(0)}K</div>
        </div>
        <div className="p-4 bg-black rounded-lg">
          <div className="text-zinc-400 text-sm">Profit Margin</div>
          <div className="text-2xl font-bold text-blue-500">{financialInsights.profitMargin}%</div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-4">Top Performing Studios</h4>
        <div className="space-y-3">
          {financialInsights.topStudios.map((studio, index) => (
            <div key={studio.name} className="flex items-center justify-between p-3 bg-black rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="font-medium">{studio.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${(studio.revenue / 1000).toFixed(0)}K</div>
                <div className="text-sm text-green-500">↑ {studio.growth}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TopPerformersSection = () => (
    <div className="bg-[#161616] rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <TrendingUp size={20} />
        Top Performers
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-4 text-zinc-400">Top Studios by Revenue</h4>
          <div className="space-y-3">
            {topPerformers.studios.map((studio, index) => (
              <div key={studio.name} className="flex items-center justify-between p-3 bg-black rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{studio.name}</div>
                    <div className="text-xs text-zinc-400">{studio.members} members • {studio.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${(studio.revenue / 1000).toFixed(0)}K</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-zinc-400">Top Franchises</h4>
          <div className="space-y-3">
            {topPerformers.franchises.map((franchise, index) => (
              <div key={franchise.name} className="flex items-center justify-between p-3 bg-black rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{franchise.name}</div>
                    <div className="text-xs text-zinc-400">{franchise.studios} studios</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${(franchise.revenue / 1000000).toFixed(1)}M</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
          <div>
            <h1 className="text-2xl font-bold mb-2">Analytics</h1>
          </div>
         
          <img
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="h-5 w-5 mr-5   cursor-pointer"
              src="/icon.svg"
              alt=""
            />
        </div>

        {/* Enhanced KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {Object.entries(analyticsData).map(([metric, data]) => (
            <div key={metric} onClick={() => setSelectedMetric(metric)}>
              <KPICard metric={metric} data={data} />
            </div>
          ))}
        </div>

        {/* New Analytics Sections */}
        <LeadConversionFunnel />
        <FinancialInsights />
        <TopPerformersSection />

        {/* Growth Trends Section */}
        <div className="bg-[#161616] rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ChartBar size={20} />
            Growth Trends
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-blue-500" />
                <span className="text-zinc-400 text-sm">Member Growth</span>
              </div>
              <div className="text-2xl font-bold">+18%</div>
              <div className="text-sm text-green-500">↑ 320 new members</div>
            </div>
            <div className="p-4 bg-black rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <UserCheck size={20} className="text-green-500" />
                <span className="text-zinc-400 text-sm">Retention Rate</span>
              </div>
              <div className="text-2xl font-bold">94%</div>
              <div className="text-sm text-green-500">↑ 3% from last month</div>
            </div>
            <div className="p-4 bg-black rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-purple-500" />
                <span className="text-zinc-400 text-sm">Avg Revenue/Studio</span>
              </div>
              <div className="text-2xl font-bold">$12.5K</div>
              <div className="text-sm text-green-500">↑ 8% growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR CODE - EXACTLY SAME AS BEFORE */}
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
        onToggleEditing={handleToggleEditing}
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