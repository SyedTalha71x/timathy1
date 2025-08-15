import { useState } from "react"

const StudioMenu = () => {
  const [activeSection, setActiveSection] = useState("info")

  return (
    <div className=" min-h-screen rounded-3xl bg-[#1C1C1C] p-6">
      {/* Header with Logo and Studio Name */}
      <div className="text-center py-6 md:py-8 border-b border-gray-700">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">FitZone Studio</h1>
            <p className="text-gray-300 text-sm md:text-base">Premium Fitness & Wellness Center</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-800/50 rounded-lg mt-6 overflow-hidden">
        <button
          onClick={() => setActiveSection("info")}
          className={`flex-1 py-3 px-2 md:px-4 text-center font-medium text-sm md:text-base transition-all duration-300 ${
            activeSection === "info" 
              ? "text-green-400 bg-gray-700 border-b-2 border-green-400" 
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          Studio Info
        </button>
        <button
          onClick={() => setActiveSection("data")}
          className={`flex-1 py-3 px-2 md:px-4 text-center font-medium text-sm md:text-base transition-all duration-300 ${
            activeSection === "data" 
              ? "text-green-400 bg-gray-700 border-b-2 border-green-400" 
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          Studio Data
        </button>
      </div>

      {/* Content */}
      <div className="p-2 md:p-4 mt-4">
        {activeSection === "info" && (
          <div className="space-y-6">
            {/* Google Maps Integration */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
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

            {/* Opening Hours */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
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
                  <div key={index} className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                    item.isToday ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-700/50'
                  }`}>
                    <span className={`font-medium ${item.isToday ? 'text-green-400' : 'text-gray-300'}`}>
                      {item.day}
                      {item.isToday && <span className="ml-2 text-xs bg-green-500 px-2 py-1 rounded-full text-white">Today</span>}
                    </span>
                    <span className={`${item.isToday ? 'text-green-300' : 'text-gray-400'}`}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Services */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-3">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    +49 30 1234 5678
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    info@fitzonestudio.de
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-3">Services</h3>
                <div className="space-y-2">
                  <div className="text-gray-300 text-sm">• Personal Training</div>
                  <div className="text-gray-300 text-sm">• Group Classes</div>
                  <div className="text-gray-300 text-sm">• Nutrition Coaching</div>
                  <div className="text-gray-300 text-sm">• Wellness Programs</div>
                </div>
              </div>
            </div>

            {/* Imprint */}
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <button className="flex justify-between items-center w-full group">
                <span className="text-lg font-medium text-white group-hover:text-green-400 transition-colors">Legal Information & Imprint</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeSection === "data" && (
          <div className="space-y-6">
            {/* Contract Data */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Contract Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Contract ID:</span>
                    <span className="font-mono text-green-400">#FZ-2025-001</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Start Date:</span>
                    <span className="text-white">January 15, 2025</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">End Date:</span>
                    <span className="text-white">January 14, 2026</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Data */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
                Payment Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Monthly Fee:</span>
                    <span className="text-2xl font-bold text-green-400">€79.99</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Next Payment:</span>
                    <span className="text-white">February 15, 2025</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Payment Method:</span>
                    <span className="text-white">SEPA Direct Debit</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Up to Date
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Benefits */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                </svg>
                Premium Membership Benefits
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    24/7 Gym Access
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    All Group Classes
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Personal Training Discount
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Wellness Area Access
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Guest Passes (2/month)
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Nutrition Consultation
                  </div>
                </div>
              </div>
            </div>

            {/* Legal & Support Links */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Legal & Support</h3>
              <div className="space-y-3">
                <button className="flex justify-between items-center w-full py-3 px-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">Terms & Conditions</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="flex justify-between items-center w-full py-3 px-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">Privacy Policy</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="flex justify-between items-center w-full py-3 px-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">Contact Support</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="flex justify-between items-center w-full py-3 px-4 bg-red-900/30 rounded-lg hover:bg-red-900/50 transition-colors group border border-red-800/30">
                  <span className="text-red-400 group-hover:text-red-300">Cancel Membership</span>
                  <svg className="w-4 h-4 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudioMenu