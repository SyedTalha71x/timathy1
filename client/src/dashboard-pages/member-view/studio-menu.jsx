/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"

const StudioMenu = () => {
  const [activeSection, setActiveSection] = useState("info")
  const [showImprintPopup, setShowImprintPopup] = useState(false)
  const [showTermsPopup, setShowTermsPopup] = useState(false)
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false)
  const [showPaymentMethodPopup, setShowPaymentMethodPopup] = useState(false)
  const [showCancelMembershipPopup, setShowCancelMembershipPopup] = useState(false)
  const [showIdlePeriodForm, setShowIdlePeriodForm] = useState(false)
  const [expandedMemberSection, setExpandedMemberSection] = useState("")

  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [checkInHistory, setCheckInHistory] = useState([
    { date: "2025-01-26", time: "09:15", status: "success" },
    { date: "2025-01-25", time: "18:30", status: "success" },
    { date: "2025-01-24", time: "07:45", status: "success" },
  ])

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const scannerRef = useRef(null)

  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isEditingContact, setIsEditingContact] = useState(false)

  const [personalData, setPersonalData] = useState({
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "01/01/1990",
    gender: "Male",
  })

  const [addressData, setAddressData] = useState({
    street: "Musterstraße",
    houseNumber: "123",
    zipCode: "10117",
    city: "Berlin",
    country: "Germany",
  })

  const [contactData, setContactData] = useState({
    email: "john.doe@email.com",
    phone: "+49 30 1234 5678",
  })

  const startScanning = async () => {
    try {
      setCameraError(null)
      setIsScanning(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        // Start QR code detection
        scanForQRCode()
      }
    } catch (error) {
      setCameraError("Camera access denied or not available")
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
    if (scannerRef.current) {
      clearInterval(scannerRef.current)
    }
  }

  const scanForQRCode = () => {
    scannerRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current
        const video = videoRef.current
        const context = canvas.getContext("2d")

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        // Simple QR code detection simulation (in real app, use a proper QR library)
        // For demo purposes, we'll simulate a successful scan after 3 seconds
        setTimeout(() => {
          if (isScanning) {
            handleSuccessfulScan("FITZONE_CHECKIN_" + Date.now())
          }
        }, 3000)
      }
    }, 100)
  }

  const handleSuccessfulScan = (qrData) => {
    setScanResult(qrData)
    stopScanning()

    // Add to check-in history
    const now = new Date()
    const newCheckIn = {
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      status: "success",
    }
    setCheckInHistory((prev) => [newCheckIn, ...prev])

    // Show success message
    alert("Check-in successful! Welcome to FitZone Studio!")
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  const handlePersonalDataChange = (field, value) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressDataChange = (field, value) => {
    setAddressData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactDataChange = (field, value) => {
    setContactData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePersonalDataSubmit = () => {
    console.log("Requesting personal data change:", personalData)
    alert("Personal data change request submitted successfully!")
    setIsEditingPersonal(false)
  }

  const handleAddressDataSubmit = () => {
    console.log("Requesting address change:", addressData)
    alert("Address change request submitted successfully!")
    setIsEditingAddress(false)
  }

  const handleContactDataSubmit = () => {
    console.log("Requesting contact data change:", contactData)
    alert("Contact data change request submitted successfully!")
    setIsEditingContact(false)
  }

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] p-6">
      {/* Header with Logo and Studio Name */}
      <div className="text-center py-6 md:py-8 border-b border-gray-700">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white oxanium_font text-xl md:text-2xl">FitZone Studio</h1>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-800/50 rounded-lg mt-6 overflow-hidden">
        <button
          onClick={() => setActiveSection("checkin")}
          className={`flex-1 py-3 px-2 md:px-4 text-center font-medium text-sm md:text-base transition-all duration-300 ${
            activeSection === "checkin"
              ? "text-orange-400 bg-gray-700 border-b-2 border-orange-400"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          Check-in
        </button>
        <button
          onClick={() => setActiveSection("info")}
          className={`flex-1 py-3 px-2 md:px-4 text-center font-medium text-sm md:text-base transition-all duration-300 ${
            activeSection === "info"
              ? "text-orange-400 bg-gray-700 border-b-2 border-orange-400"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          Studio Info
        </button>
        <button
          onClick={() => setActiveSection("data")}
          className={`flex-1 py-3 px-2 md:px-4 text-center font-medium text-sm md:text-base transition-all duration-300 ${
            activeSection === "data"
              ? "text-orange-400 bg-gray-700 border-b-2 border-orange-400"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          Studio Data
        </button>
      </div>

      {/* Content */}
      <div className="p-2 md:p-4 mt-4">
        {activeSection === "checkin" && (
          <div className="space-y-6">
            {/* QR Code Scanner */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                QR Code Check-in
              </h2>

              {!isScanning ? (
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <p className="text-gray-300 mb-2">Scan the QR code at the studio entrance to check in</p>
                    <p className="text-gray-400 text-sm">Make sure to allow camera access when prompted</p>
                  </div>

                  {cameraError && (
                    <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 mb-4">
                      <p className="text-red-400 text-sm">{cameraError}</p>
                    </div>
                  )}

                  <button
                    onClick={startScanning}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center mx-auto"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Start QR Scanner
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                    <video ref={videoRef} className="w-full h-64 object-cover" playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scanner overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-orange-500 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-orange-500"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-orange-500"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-orange-500"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-orange-500"></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">Position the QR code within the frame</p>

                  <button
                    onClick={stopScanning}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancel Scan
                  </button>
                </div>
              )}
            </div>

            {/* <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Check-ins
              </h3>

              <div className="space-y-3">
                {checkInHistory.map((checkIn, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-700/50 rounded-lg p-3">
                    <div>
                      <span className="text-white font-medium">{checkIn.date}</span>
                      <p className="text-gray-400 text-sm">{checkIn.time}</p>
                    </div>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Success
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
                <h4 className="text-lg font-bold text-white mb-2">This Month</h4>
                <div className="text-3xl font-bold text-orange-400 mb-1">12</div>
                <p className="text-gray-400 text-sm">Check-ins</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
                <h4 className="text-lg font-bold text-white mb-2">Current Streak</h4>
                <div className="text-3xl font-bold text-green-400 mb-1">5</div>
                <p className="text-gray-400 text-sm">Days in a row</p>
              </div>
            </div> */}
          </div>
        )}

        {activeSection === "info" && (
          <div className="space-y-6">
            {/* Google Maps Integration */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Our Location
                </h2>
              </div>
              <div className="relative h-48 md:h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.4089999856944!2d13.404953977047!3d52.520008172099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851c655f20989%3A0x26bbfb4e84674c63!2sBrandenburg%20Gate!5e0!3m2!1sen!2sde!4v1642584825542!5m2!1sen!2sde"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-b-xl"
                ></iframe>
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                  <div className="text-sm font-semibold">Pariser Platz 1</div>
                  <div className="text-xs text-gray-300">10117 Berlin, Germany</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Opening Hours */}
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  Opening Hours
                </h2>
                <div className="grid gap-3">
                  {[
                    { day: "Monday", hours: "06:00 - 22:00", isToday: false },
                    { day: "Tuesday", hours: "06:00 - 22:00", isToday: false },
                    { day: "Wednesday", hours: "06:00 - 22:00", isToday: false },
                    { day: "Thursday", hours: "06:00 - 22:00", isToday: false },
                    { day: "Friday", hours: "06:00 - 22:00", isToday: true },
                    { day: "Saturday", hours: "08:00 - 20:00", isToday: false },
                    { day: "Sunday", hours: "09:00 - 18:00", isToday: false },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                        item.isToday ? "bg-orange-500/20 border border-orange-500/30" : "bg-gray-700/50"
                      }`}
                    >
                      <span className={`font-medium ${item.isToday ? "text-orange-400" : "text-gray-300"}`}>
                        {item.day}
                        {item.isToday && (
                          <span className="ml-2 text-xs bg-orange-500 px-2 py-1 rounded-full text-white">Today</span>
                        )}
                      </span>
                      <span className={`${item.isToday ? "text-orange-300" : "text-gray-400"}`}>{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-3">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    +49 30 1234 5678
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    info@fitzonestudio.de
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <div className="space-y-3">
                <button
                  onClick={() => setShowImprintPopup(true)}
                  className="flex justify-between items-center w-full group"
                >
                  <span className="text-lg font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                    Imprint
                  </span>
                  <svg
                    className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => setShowTermsPopup(true)}
                  className="flex justify-between items-center w-full group"
                >
                  <span className="text-lg font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                    Terms & Conditions
                  </span>
                  <svg
                    className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => setShowPrivacyPopup(true)}
                  className="flex justify-between items-center w-full group"
                >
                  <span className="text-lg font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                    Privacy Policy
                  </span>
                  <svg
                    className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "data" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                  </svg>
                  Idle Periods
                </h3>
                <button
                  onClick={() => setShowIdlePeriodForm(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Apply for Idle Period
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium">Current Idle Period</span>
                      <p className="text-gray-400 text-sm">Vacation - Jan 20, 2025 to Feb 5, 2025</p>
                    </div>
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">Active</span>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium">Past Idle Period</span>
                      <p className="text-gray-400 text-sm">Medical - Dec 1, 2024 to Dec 15, 2024</p>
                    </div>
                    <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Contract Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Contract Type:</span>
                    <span className="text-white">Premium Annual</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Start Date:</span>
                    <span className="text-white">January 15, 2025</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Fee:</span>
                    <span className="text-white font-bold">€79.99/month</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Last Cancellation Date:</span>
                    <span className="text-white">December 15, 2025</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Contract Duration:</span>
                    <span className="text-white">12 months</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Period of Notice:</span>
                    <span className="text-white">1 month</span>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      View Contract Document
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCancelMembershipPopup(true)}
                className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 py-3 px-4 rounded-lg transition-colors border border-red-800/30"
              >
                Cancel Membership
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
              <button
                onClick={() => setShowPaymentMethodPopup(true)}
                className="flex justify-between items-center w-full group"
              >
                <h3 className="text-xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                  Payment Method
                </h3>
                <svg
                  className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
                Member Data
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center bg-gray-700/50 rounded-lg p-3">
                  <span className="text-gray-400">Member Number:</span>
                  <span className="text-white font-mono">#FZ-2025-001</span>
                </div>
                <div className="flex justify-between items-center bg-gray-700/50 rounded-lg p-3">
                  <span className="text-gray-400">Member Since:</span>
                  <span className="text-white">January 15, 2025</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setExpandedMemberSection(expandedMemberSection === "personal" ? "" : "personal")}
                  className="flex justify-between items-center w-full py-3 px-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-gray-300 group-hover:text-white">Personal Data</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-all ${expandedMemberSection === "personal" ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {expandedMemberSection === "personal" && (
                  <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                    {!isEditingPersonal ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">First Name:</span>
                          <span className="text-white">{personalData.firstName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Name:</span>
                          <span className="text-white">{personalData.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Date of Birth:</span>
                          <span className="text-white">{personalData.dateOfBirth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gender:</span>
                          <span className="text-white">{personalData.gender}</span>
                        </div>
                        <button
                          onClick={() => setIsEditingPersonal(true)}
                          className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Edit Personal Data
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">First Name</label>
                            <input
                              type="text"
                              value={personalData.firstName}
                              onChange={(e) => handlePersonalDataChange("firstName", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Last Name</label>
                            <input
                              type="text"
                              value={personalData.lastName}
                              onChange={(e) => handlePersonalDataChange("lastName", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Date of Birth</label>
                            <input
                              type="text"
                              value={personalData.dateOfBirth}
                              onChange={(e) => handlePersonalDataChange("dateOfBirth", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Gender</label>
                            <select
                              value={personalData.gender}
                              onChange={(e) => handlePersonalDataChange("gender", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handlePersonalDataSubmit}
                              className="flex-1 bg-orange-500 hover:bg-orange-700 cursor-pointer text-white py-2 px-4 rounded-lg transition-colors"
                            >
                              Request Change
                            </button>
                            <button
                              onClick={() => setIsEditingPersonal(false)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setExpandedMemberSection(expandedMemberSection === "address" ? "" : "address")}
                  className="flex justify-between items-center w-full py-3 px-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-gray-300 group-hover:text-white">Address</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-all ${expandedMemberSection === "address" ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {expandedMemberSection === "address" && (
                  <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                    {!isEditingAddress ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Street:</span>
                          <span className="text-white">{addressData.street}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">House Number:</span>
                          <span className="text-white">{addressData.houseNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Zip Code:</span>
                          <span className="text-white">{addressData.zipCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">City:</span>
                          <span className="text-white">{addressData.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Country:</span>
                          <span className="text-white">{addressData.country}</span>
                        </div>
                        <button
                          onClick={() => setIsEditingAddress(true)}
                          className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Edit Address
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Street</label>
                            <input
                              type="text"
                              value={addressData.street}
                              onChange={(e) => handleAddressDataChange("street", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">House Number</label>
                            <input
                              type="text"
                              value={addressData.houseNumber}
                              onChange={(e) => handleAddressDataChange("houseNumber", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Zip Code</label>
                            <input
                              type="text"
                              value={addressData.zipCode}
                              onChange={(e) => handleAddressDataChange("zipCode", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">City</label>
                            <input
                              type="text"
                              value={addressData.city}
                              onChange={(e) => handleAddressDataChange("city", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Country</label>
                            <input
                              type="text"
                              value={addressData.country}
                              onChange={(e) => handleAddressDataChange("country", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleAddressDataSubmit}
                              className="flex-1 bg-orange-500 hover:bg-orange-700 cursor-pointer text-white py-2 px-4 rounded-lg transition-colors"
                            >
                              Request Change
                            </button>
                            <button
                              onClick={() => setIsEditingAddress(false)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setExpandedMemberSection(expandedMemberSection === "contact" ? "" : "contact")}
                  className="flex justify-between items-center w-full py-3 px-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-gray-300 group-hover:text-white">Contact Details</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-all ${expandedMemberSection === "contact" ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {expandedMemberSection === "contact" && (
                  <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                    {!isEditingContact ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white">{contactData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white">{contactData.phone}</span>
                        </div>
                        <button
                          onClick={() => setIsEditingContact(true)}
                          className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Edit Contact Details
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Email</label>
                            <input
                              type="email"
                              value={contactData.email}
                              onChange={(e) => handleContactDataChange("email", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">Phone</label>
                            <input
                              type="tel"
                              value={contactData.phone}
                              onChange={(e) => handleContactDataChange("phone", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleContactDataSubmit}
                              className="flex-1 bg-orange-500 hover:bg-orange-700 cursor-pointer text-white py-2 px-4 rounded-lg transition-colors"
                            >
                              Request Change
                            </button>
                            <button
                              onClick={() => setIsEditingContact(false)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Imprint Popup */}
      {showImprintPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Imprint</h3>
              <button onClick={() => setShowImprintPopup(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-gray-300 space-y-2">
              <p>
                <strong>FitZone Studio GmbH</strong>
              </p>
              <p>
                Pariser Platz 1<br />
                10117 Berlin, Germany
              </p>
              <p>
                Phone: +49 30 1234 5678
                <br />
                Email: info@fitzonestudio.de
              </p>
              <p>
                Managing Director: Max Mustermann
                <br />
                Commercial Register: HRB 12345 B
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Terms & Conditions</h3>
              <button onClick={() => setShowTermsPopup(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-gray-300 space-y-2">
              <p>These terms and conditions govern your membership at FitZone Studio...</p>
              <p>1. Membership fees are due monthly in advance.</p>
              <p>2. Cancellation requires 1 month notice.</p>
              <p>3. Studio rules must be followed at all times.</p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Popup */}
      {showPrivacyPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Privacy Policy</h3>
              <button onClick={() => setShowPrivacyPopup(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-gray-300 space-y-2">
              <p>We respect your privacy and are committed to protecting your personal data...</p>
              <p>Data collected: Name, address, contact information, payment details.</p>
              <p>Data usage: Membership management, communication, billing.</p>
              <p>Data retention: As long as membership is active plus legal requirements.</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Popup */}
      {showPaymentMethodPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Payment Method</h3>
              <button onClick={() => setShowPaymentMethodPopup(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Account holder*</label>
                <input type="text" className="w-full bg-gray-700 text-white rounded-lg p-3" defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">IBAN*</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  defaultValue="DE89 3704 0044 0532 0130 00"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">BIC*</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  defaultValue="COBADEFFXXX"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Credit institute*</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  defaultValue="Commerzbank AG"
                />
              </div>
              <div className="flex items-start space-x-2">
                <input type="checkbox" className="mt-1" defaultChecked />
                <p className="text-gray-300 text-sm">
                  I allow FitZone Studio to collect payments from my account via direct debit using the creditors id
                  DE02FZS00000123456. I also instruct my credit institute to honour these direct debits for account.
                </p>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-700 cursor-pointer text-white py-3 px-4 rounded-lg transition-colors">
                Request change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Membership Popup */}
      {showCancelMembershipPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Cancel Membership</h3>
              <button onClick={() => setShowCancelMembershipPopup(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-2">Cancellation Information</h4>
                <p className="text-gray-300 text-sm mb-2">
                  <strong>Notice Period:</strong> 1 month
                </p>
                <p className="text-gray-300 text-sm mb-2">
                  <strong>Last Cancellation Date:</strong> December 15, 2025
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Cancellation Effective:</strong> January 15, 2026
                </p>
              </div>
              <p className="text-gray-300 text-sm">
                If you cancel now, your membership will remain active until January 15, 2026. You will continue to have
                access to all facilities and services until that date.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelMembershipPopup(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Keep Membership
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Idle Period Form Popup */}
      {showIdlePeriodForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full overflow-visible">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Apply for Idle Period</h3>
              <button onClick={() => setShowIdlePeriodForm(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Reason dropdown */}
              <div className="relative ">
                <label className="block text-gray-400 text-sm mb-1">Reason for idle period*</label>
                <select className="w-full bg-gray-700  text-white rounded-lg p-3">
                  <option>Select reason...</option>
                  <option>Vacation</option>
                  <option>Medical</option>
                  <option>Business Travel</option>
                  <option>Personal</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Start Date*</label>
                <input type="date" className="w-full bg-gray-700 text-white rounded-lg p-3" />
              </div>

              {/* Duration dropdown */}
              <div className="relative">
                <label className="block text-gray-400 text-sm mb-1">Duration*</label>
                <select className="w-full bg-gray-700 text-white rounded-lg p-3">
                  <option>Select duration...</option>
                  <option>1 week</option>
                  <option>2 weeks</option>
                  <option>1 month</option>
                  <option>2 months</option>
                  <option>3 months</option>
                </select>
              </div>

              {/* Document upload */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Document</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-xs">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              {/* Submit button */}
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition-colors">
                Apply for Idle Period
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioMenu
