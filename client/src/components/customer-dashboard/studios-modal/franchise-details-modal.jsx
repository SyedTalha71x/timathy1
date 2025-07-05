/* eslint-disable react/prop-types */
""
import { X, Building, Edit, AlertTriangle, Info } from "lucide-react"

const FranchiseDetailsModal = ({
  isOpen,
  onClose,
  franchise,
  onEditFranchise,
  onArchiveFranchise,
  assignedStudios = [],
}) => {
  if (!isOpen || !franchise) return null

  const handleArchive = () => {
    if (
      window.confirm(
        `Are you sure you want to ${franchise.isArchived ? "unarchive" : "archive"} "${franchise.name}"? ${
          !franchise.isArchived
            ? "All assigned studios will remain assigned."
            : "This will restore the franchise to active status."
        }`,
      )
    ) {
      onArchiveFranchise(franchise.id)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[9999] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative">
        <div className="p-6 custom-scrollbar overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Franchise Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <div className="space-y-4 text-white">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                {franchise.logo ? (
                  <img
                    src={franchise.logo || "/placeholder.svg"}
                    alt={franchise.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building size={32} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{franchise.name}</h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-900 text-purple-300">Franchise</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Owner Name</p>
              <p>
                {franchise.ownerFirstName} {franchise.ownerLastName || "Not provided"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p>{franchise.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p>{franchise.phone}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Website</p>
              <p>{franchise.website}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Country</p>
              <p>{franchise.country || "Not specified"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Address</p>
              <p>{`${franchise.street}, ${franchise.zipCode} ${franchise.city}`}</p>
            </div>

            <div className="bg-[#161616] p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Building size={16} className="text-purple-400" />
                <p className="text-lg font-semibold">{assignedStudios.length}</p>
                <p className="text-sm text-gray-400">Assigned Studios</p>
              </div>
              {assignedStudios.length > 0 && (
                <div className="space-y-1">
                  {assignedStudios.map((studio) => (
                    <p key={studio.id} className="text-sm text-gray-300">
                      • {studio.name}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-400">About</p>
              <p>{franchise.about}</p>
            </div>

            <div className="border border-slate-700 rounded-xl p-4">
              <h4 className="text-sm text-gray-200 font-medium mb-2">Login Credentials</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <p>
                  <span className="text-gray-400">Email:</span> {franchise.loginEmail}
                </p>
                <p>
                  <span className="text-gray-400">Password:</span> ••••••••
                </p>
              </div>
            </div>

            {franchise.specialNote && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  {franchise.noteImportance === "important" ? (
                    <AlertTriangle className="text-red-500" size={18} />
                  ) : (
                    <Info className="text-blue-500" size={18} />
                  )}
                  <h4 className="text-sm text-gray-200 font-medium">Special Note</h4>
                  <span className="text-xs text-gray-400">
                    ({franchise.noteImportance === "important" ? "Important" : "Unimportant"})
                  </span>
                </div>
                <p className="text-sm">{franchise.specialNote}</p>
                {franchise.noteStartDate && franchise.noteEndDate && (
                  <p className="text-xs text-gray-400 mt-2">
                    Valid from {franchise.noteStartDate} to {franchise.noteEndDate}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 md:flex-row flex-col pt-4">
              <button
                onClick={() => onEditFranchise(franchise)}
                className="flex-1 bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit Franchise
              </button>
              <button
                onClick={handleArchive}
                className={`flex-1 ${
                  franchise.isArchived ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"
                } px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2`}
              >
                {franchise.isArchived ? "Unarchive" : "Archive"} Franchise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FranchiseDetailsModal
