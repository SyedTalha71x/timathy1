/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Search, Plus, Eye, Edit, FileText, History } from "lucide-react"
import { useState } from "react"
import VacationContingentModal from "./VacationContigentModal"
import { TbPlusMinus } from "react-icons/tb"

const StudioStaffModal = ({
  isOpen,
  studio,
  studioStaffs,
  staffSearchQuery,
  setStaffSearchQuery,
  getFilteredStaff,
  onClose,
  onAddStaff,
  onViewStaff,
  onEditStaff,
  handleDocumentFromOverview,
  handleHistoryFromOverview
}) => {
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false)
  const [selectedStaffForVacation, setSelectedStaffForVacation] = useState(null)

  if (!isOpen || !studio) return null

  const handleOpenVacationModal = (staff) => {
    setSelectedStaffForVacation(staff)
    setIsVacationModalOpen(true)
  }

  const handleUpdateContingent = (staffId, contingent, notes) => {
    console.log(`Updating staff ${staffId} with ${contingent} vacation days`)
  }

  return (
    <>
      <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
          <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col md:block">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold md:text-lg">
                  {studio.name} - Staff ({studioStaffs[studio.id]?.length || 0})
                </h2>
                <p className="text-gray-400 text-sm mt-1 md:hidden">
                  Studio Staff
                </p>
              </div>

              <div className="flex gap-2">
                <div className="md:block hidden">
                  <button
                    onClick={onAddStaff}
                    className="bg-[#FF843E] cursor-pointer text-white px-3 py-2.5 rounded-xl text-sm flex items-center gap-2"
                  >
                    <Plus size={18} />
                    <span className="open_sans_font">Add Staff</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>
            </div>

            {/* Mobile Add Staff Button */}
            <div className="md:hidden flex justify-end items-center mb-3">
              <button
                onClick={onAddStaff}
                className="bg-[#FF843E] cursor-pointer text-white px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 w-full justify-center sm:w-auto"
              >
                <Plus size={18} />
                <span className="open_sans_font">Add Staff</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search staff by name, email, phone, or role..."
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  className="w-full bg-[#101010] pl-10 pr-4 py-2 text-sm outline-none rounded-lg text-white placeholder-gray-500 border border-slate-600"
                />
              </div>
            </div>

            {/* Staff List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {getFilteredStaff().map((staff) => (
                <div
                  key={staff.id}
                  className="bg-[#161616] rounded-xl p-4 flex justify-between flex-col sm:flex-row gap-3 items-start"
                >
                  {/* Staff Info - Stacked on mobile */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      <h3 className="font-medium text-white text-sm md:text-base">{staff.firstName}</h3>
                      <h3 className="font-medium text-white text-sm md:text-base">{staff.lastName}</h3>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p className="flex flex-col sm:flex-row sm:gap-1 mb-1 sm:mb-0">
                        <span className="font-bold text-gray-200 min-w-[45px]">Email:</span>
                        <span className="break-all sm:break-normal">{staff.email}</span>
                      </p>
                      <p className="flex flex-col sm:flex-row sm:gap-1 mb-1 sm:mb-0">
                        <span className="font-bold text-gray-200 min-w-[45px]">Phone:</span>
                        <span>{staff.phone}</span>
                      </p>
                      <p className="flex flex-col sm:flex-row sm:gap-1">
                        <span className="font-bold text-gray-200 min-w-[45px]">Role:</span>
                        <span>{staff.role}</span>
                      </p>
                      
                      {/* Vacation Days Display */}
                      {staff.vacationDays !== undefined && (
                        <p className="text-orange-400 mt-1 sm:mt-0">
                          <span className="font-bold">Vacation Days:</span> {staff.vacationDays}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons - Modified for mobile */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Icon Buttons Row */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Vacation Contingent Button */}
                      <button
                        onClick={() => handleOpenVacationModal(staff)}
                        className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                        title="Manage Vacation Contingent"
                      >
                        <TbPlusMinus size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleHistoryFromOverview(staff)}
                        className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                        title="View History"
                      >
                        <History size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleDocumentFromOverview(staff)}
                        className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                        title="Document Management"
                      >
                        <FileText size={16} />
                      </button>
                    </div>
                    
                    {/* View and Edit Buttons - Horizontal on mobile */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewStaff(staff)}
                        className="flex-1 text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        <span className="hidden xs:inline">View Details</span>
                        <span className="xs:hidden">View</span>
                      </button>
                      
                      <button
                        onClick={() => onEditStaff(staff)}
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

      {/* Vacation Contingent Modal */}
      <VacationContingentModal
        isOpen={isVacationModalOpen}
        onClose={() => {
          setIsVacationModalOpen(false)
          setSelectedStaffForVacation(null)
        }}
        staff={selectedStaffForVacation}
        onUpdateContingent={handleUpdateContingent}
      />
    </>
  )
}

export default StudioStaffModal