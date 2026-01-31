import { useState } from "react"
import { createPortal } from "react-dom"
import toast from "react-hot-toast"
import { Clock, Users, X } from "lucide-react"

const loggedInStaff = {
    id: 1,
    name: "John Smith",
    password: "staff123",
  }
  
  const staffList = [
    { id: 1, name: "John Smith", password: "staff123" },
    { id: 2, name: "Sarah Johnson", password: "sarah456" },
    { id: 3, name: "Mike Wilson", password: "mike789" },
    { id: 4, name: "Emma Davis", password: "emma321" },
  ]

  // Additional Staff Modal Component (integrated)
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
                selectedStaff && password ? "bg-orange-500 hover:bg-orange-600" : "bg-orange-500/50 cursor-not-allowed"
              }`}
            >
              {additionalStaffCheckIns[selectedStaff?.id] ? "Check Out" : "Check In"}
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  function StaffCheckInWidget({ compact = false }) {
    const [isCheckedIn, setIsCheckedIn] = useState(false)
    const [checkInTime, setCheckInTime] = useState(null)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [password, setPassword] = useState("")
    const [showAdditionalStaff, setShowAdditionalStaff] = useState(false)
    const [additionalStaffCheckIns, setAdditionalStaffCheckIns] = useState({})
    const [bookingTimeout, setBookingTimeout] = useState(null)
    const [canCheckOut, setCanCheckOut] = useState(true)
  
    const handleCheckInOut = () => {
      setShowPasswordModal(true)
    }
  
    const handlePasswordSubmit = () => {
      if (password === loggedInStaff.password) {
        if (isCheckedIn) {
          if (!canCheckOut) {
            toast.error("Cannot check out yet. Please wait for the 2-minute timeout.")
            setShowPasswordModal(false)
            setPassword("")
            return
          }
          setIsCheckedIn(false)
          setCheckInTime(null)
          setBookingTimeout(null)
          setCanCheckOut(true)
          toast.success("Checked out successfully")
        } else {
          setIsCheckedIn(true)
          const now = new Date()
          setCheckInTime(now)
          setCanCheckOut(false)
          // Set 2-minute timeout
          const timeoutTime = new Date(now.getTime() + 2 * 60 * 1000)
          setBookingTimeout(timeoutTime)
          setTimeout(
            () => {
              setCanCheckOut(true)
              toast.success("You can now check out")
            },
            2 * 60 * 1000,
          )
          toast.success("Checked in successfully")
        }
        setShowPasswordModal(false)
        setPassword("")
      } else {
        toast.error("Incorrect password")
      }
    }
  
    const handleAdditionalStaffCheckIn = (staffId, staffPassword) => {
      const staff = staffList.find((s) => s.id === staffId)
      if (staff && staffPassword === staff.password) {
        setAdditionalStaffCheckIns((prev) => ({
          ...prev,
          [staffId]: !prev[staffId],
        }))
        toast.success(`${staff.name} ${additionalStaffCheckIns[staffId] ? "checked out" : "checked in"} successfully`)
      } else {
        toast.error("Incorrect password")
      }
    }

    // Password Modal Component
    const PasswordModal = () => (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          zIndex: 9999
        }}
      >
        <div className="bg-[#181818] text-white rounded-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Enter Password</h3>
            <button
              onClick={() => {
                setShowPasswordModal(false)
                setPassword("")
              }}
              className="p-2 hover:bg-zinc-700 rounded-lg text-white"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-black rounded-xl text-sm outline-none text-white"
                placeholder="Enter your password"
                onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPassword("")
                }}
                className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 text-sm rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    )

    // Additional Staff Modal Wrapper
    const AdditionalStaffModalWrapper = () => (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          zIndex: 9999
        }}
      >
        <div className="w-full max-w-md text-white">
          <AdditionalStaffModal
            staffList={staffList}
            additionalStaffCheckIns={additionalStaffCheckIns}
            onCheckIn={handleAdditionalStaffCheckIn}
            onClose={() => setShowAdditionalStaff(false)}
          />
        </div>
      </div>
    )
  
    return (
      <>
        <div className={`p-3 bg-[#2F2F2F] text-white rounded-xl ${compact ? "h-auto" : "md:h-[340px] h-auto"}`}>
          <h2 className="text-lg font-semibold mb-3">Staff Check-In</h2>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm mb-1">Status: {isCheckedIn ? "Checked In" : "Checked Out"}</p>
              {checkInTime && (
                <div className="text-xs text-zinc-400">
                  <p className="flex items-center gap-1">
                    <Clock size={14} />
                    {checkInTime.toLocaleTimeString()}
                  </p>
                  {bookingTimeout && !canCheckOut && (
                    <p className="text-yellow-400 mt-1">Can check out after: {bookingTimeout.toLocaleTimeString()}</p>
                  )}
                </div>
              )}
            </div>
            {!isCheckedIn ? (
              <button
                onClick={handleCheckInOut}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loggedInStaff.name} - Check In
              </button>
            ) : (
              <button
                onClick={handleCheckInOut}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  canCheckOut ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
                disabled={!canCheckOut}
              >
                {loggedInStaff.name} - Check Out
              </button>
            )}
            <button
              onClick={() => setShowAdditionalStaff(true)}
              className="w-full py-2 rounded-xl text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <Users size={16} />
              Check in additional staff
            </button>
          </div>
        </div>

        {/* Render modals using React Portal to ensure they appear at document root */}
        {showPasswordModal && typeof document !== 'undefined' && createPortal(
          <PasswordModal />,
          document.body
        )}

        {showAdditionalStaff && typeof document !== 'undefined' && createPortal(
          <AdditionalStaffModalWrapper />,
          document.body
        )}
      </>
    )
  }

  export default StaffCheckInWidget
