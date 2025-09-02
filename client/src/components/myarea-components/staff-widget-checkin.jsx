import { useState } from "react"
import AdditionalStaffModal from "./additional-staff-widget"
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
  
  function StaffCheckInWidget() {
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
  
    return (
      <div className="p-3 bg-[#000000] rounded-xl md:h-[340px] h-auto">
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
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors bg-yellow-400 text-black"
            >
              {loggedInStaff.name} - Check In
            </button>
          ) : (
            <button
              onClick={handleCheckInOut}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                canCheckOut ? "bg-red-600 text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!canCheckOut}
            >
              {loggedInStaff.name} - Check Out
            </button>
          )}
          <button
            onClick={() => setShowAdditionalStaff(true)}
            className="w-full py-2 rounded-xl text-sm font-medium transition-colors bg-blue-600 text-white flex items-center justify-center gap-2"
          >
            <Users size={16} />
            Check in additional staff
          </button>
        </div>
        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Enter Password</h3>
                <button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPassword("")
                  }}
                  className="p-2 hover:bg-zinc-700 rounded-lg"
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
                    className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                    placeholder="Enter your password"
                    onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false)
                      setPassword("")
                    }}
                    className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Additional Staff Modal */}
        {showAdditionalStaff && (
          <AdditionalStaffModal
            staffList={staffList}
            additionalStaffCheckIns={additionalStaffCheckIns}
            onCheckIn={handleAdditionalStaffCheckIn}
            onClose={() => setShowAdditionalStaff(false)}
          />
        )}
      </div>
    )
  }


  export default StaffCheckInWidget