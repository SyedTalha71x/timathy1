/* eslint-disable react/prop-types */
import { X, Search, Eye, Edit, Plus } from "lucide-react"

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
    if (!isOpen || !studio) return null

    return (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                            {studio.name} - Leads ({studioLeads[studio.id]?.length || 0})
                        </h2>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={onAddLead}
                                className="bg-[#FF843E] hover:bg-[#FF843E]/90 px-4 text-white py-2 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap"
                            >
                                <Plus size={16} />
                                Add Lead
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-white">
                                <X size={20} className="cursor-pointer" />
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search leads by name, email, or phone..."
                                value={leadSearchQuery}
                                onChange={(e) => setLeadSearchQuery(e.target.value)}
                                className="w-full bg-[#101010] pl-10 pr-4 py-2 text-sm outline-none rounded-lg text-white placeholder-gray-500 border border-slate-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {getFilteredLeads().map((lead) => (
                            <div
                                key={lead.id}
                                className="bg-[#161616] rounded-xl lg:p-4 p-3 flex justify-between flex-col md:flex-row gap-2 md:items-center items-start"
                            >
                                 <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-medium text-white">{lead.firstName}</h3>
                                        <h3 className="font-medium text-white">{lead.surname}</h3>
                                    </div>
                                    <div className="text-sm text-gray-400 mt-2">
                                        <p className="flex gap-1">
                                            <span className="font-bold text-gray-200">Email:</span>
                                            {lead.email}
                                        </p>
                                        <p className="flex gap-1">
                                            <span className="font-bold text-gray-200">Phone:</span> {lead.phoneNumber}
                                        </p>
                                        <p className="flex gap-1">
                                            <span className="font-bold text-gray-200">Joined:</span> {new Date(lead.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto justify-end flex-col">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onViewLead(lead)}
                                            className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => onEditLead(lead)}
                                            className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudioLeadsModal