/* eslint-disable react/prop-types */
import { X, Search, Eye, Edit, Calendar, FileText, History, Plus, Dumbbell } from "lucide-react"

const StudioMembersModal = ({
    isOpen,
    studio,
    studioMembers,
    memberSearchQuery,
    setMemberSearchQuery,
    getFilteredMembers,
    onClose,
    onViewMember,
    onEditMember,
    handleHistoryFromOverview,
    handleDocumentFromOverview,
    handleCalendarFromOverview,
    onCreateTempMember,
    handleTrainingPlanFromOverview
}) => {
    if (!isOpen || !studio) return null

    return (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
                <div className="p-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col md:block">
                            <h2 className="text-white open_sans_font_700 text-lg font-semibold md:text-lg">
                                {studio.name} - Members ({studioMembers[studio.id]?.length || 0})
                            </h2>
                            <p className="text-gray-400 text-sm mt-1 md:hidden">
                                Studio Members
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X size={20} className="cursor-pointer" />
                        </button>
                    </div>

                    {/* Search and Create Button Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search members by name, email, or phone..."
                                value={memberSearchQuery}
                                onChange={(e) => setMemberSearchQuery(e.target.value)}
                                className="w-full bg-[#101010] pl-10 pr-4 py-2 text-sm outline-none rounded-lg text-white placeholder-gray-500 border border-slate-600"
                            />
                        </div>
                        
                        <button
                            onClick={onCreateTempMember}
                            className="bg-gray-700 px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto justify-center"
                        >
                            <Plus size={16} />
                            <span className="hidden xs:inline">Create Temporary Member</span>
                            <span className="xs:hidden">Temp Member</span>
                        </button>
                    </div>

                    {/* Members List */}
                    <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {getFilteredMembers().map((member) => (
                            <div
                                key={member.id}
                                className="bg-[#161616] rounded-xl lg:p-4 p-3 flex justify-between flex-col sm:flex-row gap-3 md:gap-2 md:items-center items-start"
                            >
                                {/* Member Info - Stacked on mobile */}
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                                        <h3 className="font-medium text-white text-sm md:text-base">{member.firstName}</h3>
                                        <h3 className="font-medium text-white text-sm md:text-base">{member.lastName}</h3>
                                        {/* Temporary member indicator */}
                                        {member.isTemporary && (
                                            <span className="ml-2 px-2 py-0.5 bg-yellow-900 text-yellow-300 text-xs rounded-full">
                                                Temp
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        <p className="flex flex-col sm:flex-row sm:gap-1 mb-1 sm:mb-0">
                                            <span className="font-bold text-gray-200 min-w-[45px]">Email:</span>
                                            <span className="break-all sm:break-normal">{member.email}</span>
                                        </p>
                                        <p className="flex flex-col sm:flex-row sm:gap-1 mb-1 sm:mb-0">
                                            <span className="font-bold text-gray-200 min-w-[45px]">Phone:</span>
                                            <span>{member.phone}</span>
                                        </p>
                                        <p className="flex flex-col sm:flex-row sm:gap-1">
                                            <span className="font-bold text-gray-200 min-w-[45px]">Joined:</span>
                                            <span>{member.joinDate}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons - Modified for mobile */}
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    {/* Icon Buttons Row */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {/* Training Plan Button */}
                                        <button
                                            onClick={() => handleTrainingPlanFromOverview(member)}
                                            className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                            title="Manage Training Plans"
                                        >
                                            <Dumbbell size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleCalendarFromOverview(member)}
                                            className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                            title="View Appointments"
                                        >
                                            <Calendar size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleHistoryFromOverview(member)}
                                            className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                            title="View History"
                                        >
                                            <History size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDocumentFromOverview(member)}
                                            className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                            title="Document Management"
                                        >
                                            <FileText size={16} />
                                        </button>
                                    </div>
                                    
                                    {/* View and Edit Buttons - Horizontal on mobile */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onViewMember(member)}
                                            className="flex-1 text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                                        >
                                            <Eye size={16} />
                                            <span className="hidden xs:inline">View Details</span>
                                            <span className="xs:hidden">View</span>
                                        </button>
                                        <button
                                            onClick={() => onEditMember(member)}
                                            className="flex-1 text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
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

export default StudioMembersModal