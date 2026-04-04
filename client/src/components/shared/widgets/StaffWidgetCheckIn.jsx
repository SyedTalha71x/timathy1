import { useState } from "react"
import { createPortal } from "react-dom"
import toast from "react-hot-toast"
import { Clock, Users, X } from "lucide-react"
import { useTranslation } from "react-i18next"

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
    const { t } = useTranslation()
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
      <div className="bg-surface-card rounded-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t("myArea.staffCheckInWidget.additionalTitle")}</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-lg">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-content-muted mb-2">{t("myArea.staffCheckInWidget.selectStaff")}</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedStaff?.id === staff.id ? "bg-secondary" : "bg-surface-card hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{staff.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        additionalStaffCheckIns[staff.id]
                          ? "bg-accent-green/20 text-accent-green"
                          : "bg-surface-button text-content-muted"
                      }`}
                    >
                      {additionalStaffCheckIns[staff.id] ? t("myArea.staffCheckInWidget.checkedIn") : t("myArea.staffCheckInWidget.checkedOut")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedStaff && (
            <div>
              <label className="block text-sm text-content-muted mb-1">{t("myArea.staffCheckInWidget.passwordFor", { name: selectedStaff.name })}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-surface-base rounded-xl text-sm outline-none"
                placeholder={t("myArea.staffCheckInWidget.enterPassword")}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl bg-surface-button hover:bg-surface-button-hover text-content-secondary transition-colors">
              {t("common.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedStaff || !password}
              className={`px-4 py-2 text-sm rounded-xl text-white transition-colors ${
                selectedStaff && password ? "bg-primary hover:bg-primary-hover" : "bg-primary/50 cursor-not-allowed"
              }`}
            >
              {additionalStaffCheckIns[selectedStaff?.id] ? t("myArea.staffCheckInWidget.checkOutBtn") : t("myArea.staffCheckInWidget.checkInBtn")}
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  function StaffCheckInWidget({ compact = false, showHeader = true }) {
    const { t, i18n } = useTranslation()
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
            toast.error(t("myArea.staffCheckInWidget.toast.cannotCheckOut"))
            setShowPasswordModal(false)
            setPassword("")
            return
          }
          setIsCheckedIn(false)
          setCheckInTime(null)
          setBookingTimeout(null)
          setCanCheckOut(true)
          toast.success(t("myArea.staffCheckInWidget.toast.checkedOut"))
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
              toast.success(t("myArea.staffCheckInWidget.toast.canCheckOut"))
            },
            2 * 60 * 1000,
          )
          toast.success(t("myArea.staffCheckInWidget.toast.checkedIn"))
        }
        setShowPasswordModal(false)
        setPassword("")
      } else {
        toast.error(t("myArea.staffCheckInWidget.toast.incorrectPassword"))
      }
    }
  
    const handleAdditionalStaffCheckIn = (staffId, staffPassword) => {
      const staff = staffList.find((s) => s.id === staffId)
      if (staff && staffPassword === staff.password) {
        setAdditionalStaffCheckIns((prev) => ({
          ...prev,
          [staffId]: !prev[staffId],
        }))
        toast.success(additionalStaffCheckIns[staffId] ? t("myArea.staffCheckInWidget.toast.staffCheckedOut", { name: staff.name }) : t("myArea.staffCheckInWidget.toast.staffCheckedIn", { name: staff.name }))
      } else {
        toast.error(t("myArea.staffCheckInWidget.toast.incorrectPassword"))
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
        <div className="bg-surface-card text-content-primary rounded-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-content-primary">{t("myArea.staffCheckInWidget.enterPasswordTitle")}</h3>
            <button
              onClick={() => {
                setShowPasswordModal(false)
                setPassword("")
              }}
              className="p-2 hover:bg-surface-hover rounded-lg text-content-muted"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-content-muted mb-1">{t("myArea.staffCheckInWidget.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-surface-base rounded-xl text-sm outline-none text-content-primary"
                placeholder={t("myArea.staffCheckInWidget.enterYourPassword")}
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
                className="px-4 py-2 text-sm rounded-xl bg-surface-button hover:bg-surface-button-hover text-content-secondary transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 text-sm rounded-xl bg-primary hover:bg-primary-hover text-white"
              >
                {t("myArea.staffCheckInWidget.confirm")}
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
        <div className="w-full max-w-md text-content-primary">
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
        <div className={`p-3 bg-surface-button text-content-primary rounded-xl ${compact ? "h-auto" : "h-[320px] md:h-[340px]"}`}>
          {showHeader && <h2 className="text-lg font-semibold mb-3">{t("myArea.staffCheckInWidget.title")}</h2>}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm mb-1">{t("myArea.staffCheckInWidget.status", { status: isCheckedIn ? t("myArea.staffCheckInWidget.checkedIn") : t("myArea.staffCheckInWidget.checkedOut") })}</p>
              {checkInTime && (
                <div className="text-xs text-content-muted">
                  <p className="flex items-center gap-1">
                    <Clock size={14} />
                    {checkInTime.toLocaleTimeString(i18n.language)}
                  </p>
                  {bookingTimeout && !canCheckOut && (
                    <p className="text-accent-yellow mt-1">{t("myArea.staffCheckInWidget.canCheckOutAfter", { time: bookingTimeout.toLocaleTimeString(i18n.language) })}</p>
                  )}
                </div>
              )}
            </div>
            {!isCheckedIn ? (
              <button
                onClick={handleCheckInOut}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors bg-primary hover:bg-primary-hover text-white"
              >
                {loggedInStaff.name} - {t("myArea.staffCheckInWidget.checkInBtn")}
              </button>
            ) : (
              <button
                onClick={handleCheckInOut}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  canCheckOut ? "bg-accent-red hover:bg-accent-red/90 text-white" : "bg-surface-button text-content-secondary cursor-not-allowed"
                }`}
                disabled={!canCheckOut}
              >
                {loggedInStaff.name} - {t("myArea.staffCheckInWidget.checkOutBtn")}
              </button>
            )}
            <button
              onClick={() => setShowAdditionalStaff(true)}
              className="w-full py-2 rounded-xl text-sm font-medium transition-colors bg-secondary hover:bg-secondary/80 text-white flex items-center justify-center gap-2"
            >
              <Users size={16} />
              {t("myArea.staffCheckInWidget.checkInAdditional")}
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
