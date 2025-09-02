import { X } from "lucide-react"
import { useState } from "react"

/* eslint-disable react/prop-types */
function AdditionalStaffModal({ staffList, additionalStaffCheckIns, onCheckIn, onClose }) {
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [password, setPassword] = useState("")
  
    const handleSubmit = () => {
      if (selectedStaff && password) {
        onCheckIn(selectedStaff.id, password)
        setPassword("")
        setSelectedStaff(null)
      }
    }
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Additional Staff Check-In</h3>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Select Staff Member</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedStaff(staff)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors ${
                      selectedStaff?.id === staff.id ? "bg-blue-600" : "bg-black hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{staff.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          additionalStaffCheckIns[staff.id]
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {additionalStaffCheckIns[staff.id] ? "Checked In" : "Checked Out"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {selectedStaff && (
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Password for {selectedStaff.name}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                  placeholder="Enter password"
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedStaff || !password}
                className={`px-4 py-2 text-sm rounded-xl ${
                  selectedStaff && password ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600/50 cursor-not-allowed"
                }`}
              >
                {additionalStaffCheckIns[selectedStaff?.id] ? "Check Out" : "Check In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default AdditionalStaffModal