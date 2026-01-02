/* eslint-disable react/prop-types */
import { X, Search, Eye, Edit, Plus, ChevronDown } from "lucide-react"
import { useState } from "react"

const StudioLeadsModal = ({
    isOpen,
    studio,
    studioLeads,
    leadSearchQuery,
    setLeadSearchQuery,
    getFilteredLeads,
    onClose,
    onViewLead,
    onEditLead,
    onAddLead
}) => {
    // Prospect category colors and options from reference code
    const prospectCategories = [
        { id: "active", title: "Active prospect", color: "#10b981" },
        { id: "passive", title: "Passive prospect", color: "#f59e0b" },
        { id: "uninterested", title: "Uninterested", color: "#ef4444" },
        { id: "missed", title: "Missed Call", color: "#8b5cf6" },
        { id: "trial", title: "Trial Training Arranged", color: "#3b82f6" },
    ]

    // State for filter - MUST be declared before any conditional returns
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all")
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Early return must be AFTER all hooks
    if (!isOpen || !studio) return null

    // Get category color and title for a lead
    const getLeadCategoryInfo = (lead) => {
        const category = prospectCategories.find(cat => cat.id === lead.prospectCategory)
        return category || { title: "Uncategorized", color: "#6b7280" }
    }

    // Filter leads by category
    const getFilteredLeadsByCategory = () => {
        const filteredBySearch = getFilteredLeads()
        
        if (selectedCategoryFilter === "all") {
            return filteredBySearch
        }
        
        return filteredBySearch.filter(lead => lead.prospectCategory === selectedCategoryFilter)
    }

    // Handle category filter selection
    const handleCategorySelect = (categoryId) => {
        setSelectedCategoryFilter(categoryId)
        setIsFilterOpen(false)
    }

    return (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative md:max-h-[90vh]">
                <div className="p-6 md:p-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col md:block">
                            <h2 className="text-white open_sans_font_700 text-lg font-semibold md:text-lg">
                                {studio.name} - Leads ({studioLeads[studio.id]?.length || 0})
                            </h2>
                            <p className="text-gray-400 text-sm mt-1 md:hidden">
                                Studio Leads
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={onAddLead}
                                className="bg-[#FF843E] hover:bg-[#FF843E]/90 px-4 text-white py-2 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap"
                            >
                                <Plus size={16} />
                                <span className="hidden sm:inline">Create Lead</span>
                                <span className="sm:hidden">Add Lead</span>
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-white">
                                <X size={20} className="cursor-pointer" />
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter Bar - Improved for mobile */}
                    <div className="mb-4 flex flex-col sm:flex-row gap-3">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search leads..."
                                    value={leadSearchQuery}
                                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                                    className="w-full bg-[#101010] pl-10 pr-4 py-2 text-sm outline-none rounded-lg text-white placeholder-gray-500 border border-slate-600"
                                />
                            </div>
                        </div>
                        
                        {/* Category Filter Dropdown */}
                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm border border-slate-600 text-white transition-colors w-full sm:w-[190px]"
                            >
                                <span className="truncate text-left">
                                    {selectedCategoryFilter === "all" 
                                        ? "All Categories" 
                                        : prospectCategories.find(cat => cat.id === selectedCategoryFilter)?.title || "Filter"}
                                </span>
                                <ChevronDown 
                                    size={16} 
                                    className={`transform transition-transform flex-shrink-0 ${isFilterOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            
                            {/* Category Filter Options */}
                            {isFilterOpen && (
                                <>
                                    {/* Backdrop for mobile */}
                                    <div 
                                        className="fixed inset-0 z-40 md:hidden"
                                        onClick={() => setIsFilterOpen(false)}
                                    />
                                    
                                    <div className="absolute right-0 mt-2 w-full rounded-lg bg-[#2F2F2F] shadow-lg z-50 border border-slate-300/30 md:w-full">
                                        <button
                                            onClick={() => handleCategorySelect("all")}
                                            className={`w-full px-4 py-3 text-left text-sm hover:bg-[#3F3F3F] text-white ${selectedCategoryFilter === "all" ? "" : ""}`}
                                        >
                                            All Categories
                                        </button>
                                        {prospectCategories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategorySelect(category.id)}
                                                className={`w-full px-4 py-3 text-left text-sm hover:bg-[#3F3F3F] flex items-center gap-3 text-white ${selectedCategoryFilter === category.id ? "" : ""}`}
                                            >
                                                <div 
                                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                <span className="truncate">{category.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Leads List */}
                    <div className="space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto custom-scrollbar">
                        {getFilteredLeadsByCategory().map((lead) => {
                            const categoryInfo = getLeadCategoryInfo(lead)
                            return (
                                <div
                                    key={lead.id}
                                    className="bg-[#161616] rounded-xl lg:p-4 p-3 flex justify-between flex-col sm:flex-row gap-3 md:gap-2 md:items-center items-start"
                                >
                                    {/* Lead Info */}
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h3 className="font-medium text-white text-sm md:text-base">{lead.firstName}</h3>
                                            <h3 className="font-medium text-white text-sm md:text-base">{lead.surname}</h3>
                                            
                                            {/* Prospect Category with Colored Circle */}
                                            {lead.prospectCategory && (
                                                <div className="flex items-center gap-1">
                                                    <div 
                                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: categoryInfo.color }}
                                                    />
                                                  
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="text-sm text-gray-400">
                                            <p className="flex flex-col sm:flex-row sm:gap-1 mb-1 sm:mb-0">
                                                <span className="font-bold text-gray-200 min-w-[45px]">Email:</span>
                                                <span className="break-all sm:break-normal">{lead.email}</span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:gap-1 mb-1 sm:mb-0">
                                                <span className="font-bold text-gray-200 min-w-[45px]">Phone:</span>
                                                <span>{lead.phoneNumber}</span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:gap-1">
                                                <span className="font-bold text-gray-200 min-w-[45px]">Joined:</span>
                                                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onViewLead(lead)}
                                                className="flex-1 sm:flex-none text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                                            >
                                                <Eye size={16} />
                                                <span>View</span>
                                            </button>
                                            <button
                                                onClick={() => onEditLead(lead)}
                                                className="flex-1 sm:flex-none text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudioLeadsModal