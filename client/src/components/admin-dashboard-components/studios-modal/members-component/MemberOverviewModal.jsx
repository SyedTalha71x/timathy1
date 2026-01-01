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
    handleTrainingPlanFromOverview // Add this new prop
}) => {
    if (!isOpen || !studio) return null

    return (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                            {studio.name} - Members ({studioMembers[studio.id]?.length || 0})
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X size={20} className="cursor-pointer" />
                        </button>
                    </div>

                    {/* Add Create Temporary Member button */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative flex-1 mr-4">
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
                            className="bg-gray-700 px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
                        >
                            <Plus size={16} />
                            Create Temporary Member
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {getFilteredMembers().map((member) => (
                            <div
                                key={member.id}
                                className="bg-[#161616] rounded-xl lg:p-4 p-3 flex justify-between flex-col md:flex-row gap-2 md:items-center items-start"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-medium text-white">{member.firstName}</h3>
                                        <h3 className="font-medium text-white">{member.lastName}</h3>
                                        {/* Add temporary member indicator */}
                                        {member.isTemporary && (
                                            <span className="ml-2 px-2 py-0.5 bg-yellow-900 text-yellow-300 text-xs rounded-full">
                                                Temporary
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-2">
                                        <p className="flex gap-1">
                                            <span className="font-bold text-gray-200">Email:</span>
                                            {member.email}
                                        </p>
                                        <p className="flex gap-1">
                                            <span className="font-bold text-gray-200">Phone:</span> {member.phone}
                                        </p>
                                        <p className="flex gap-1">
                                            <span className="font-bold text-gray-200">Joined:</span> {member.joinDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto justify-end flex-col">
                                    <div className="grid grid-cols-2 gap-2"> {/* Changed from grid-cols-3 to grid-cols-4 */}
                                        {/* Training Plan Button - Added as first icon */}
                                        <button
                                            onClick={() => handleTrainingPlanFromOverview(member)}
                                            className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                            title="Manage Training Plans"
                                        >
                                            <Dumbbell size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleCalendarFromOverview(member)}
                                            className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                            title="View Appointments"
                                        >
                                            <Calendar size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleHistoryFromOverview(member)}
                                            className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                            title="View History"
                                        >
                                            <History size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDocumentFromOverview(member)}
                                            className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                            title="Document Management"
                                        >
                                            <FileText size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => onViewMember(member)}
                                        className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => onEditMember(member)}
                                        className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
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