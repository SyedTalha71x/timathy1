/* eslint-disable react/prop-types */
import { X, Search, Plus, Eye, Edit } from "lucide-react"

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
}) => {
  if (!isOpen || !studio) return null

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">
              {studio.name} - Staff ({studioStaffs[studio.id]?.length || 0})
            </h2>

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

          <div className="md:hidden flex justify-end items-center mb-3">
            <button
              onClick={onAddStaff}
              className="bg-[#FF843E] cursor-pointer text-white px-3 py-2.5 rounded-xl text-sm flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="open_sans_font">Add Staff</span>
            </button>
          </div>

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

          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {getFilteredStaff().map((staff) => (
              <div
                key={staff.id}
                className="bg-[#161616] rounded-xl p-4 flex justify-between md:flex-row flex-col gap-3 items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-medium text-white">{staff.firstName}</h3>
                    <h3 className="font-medium text-white">{staff.lastName}</h3>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    <p>
                      {staff.email} • {staff.phone}
                    </p>
                    <p>
                      Role: {staff.role} • Joined: {staff.joinDate}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto justify-end flex-col">
                  <button
                    onClick={() => onViewStaff(staff)}
                    className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <button
                    onClick={() => onEditStaff(staff)}
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

export default StudioStaffModal
