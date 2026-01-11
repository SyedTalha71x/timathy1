/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { Building2, Globe, X, History } from "lucide-react";
import { useSidebarSystem } from "../hooks/useSidebarSystem";

const Dashboardlayout = () => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false)
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false)

  // Refs for dropdown containers
  const languageDropdownRef = useRef(null)
  const profileDropdownRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close language dropdown if clicked outside
      if (isLanguageDropdownOpen && 
          languageDropdownRef.current && 
          !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false)
      }
      
      // Close profile dropdown if clicked outside
      if (isDropdownOpen && 
          profileDropdownRef.current && 
          !profileDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    // Close other dropdown when one opens
    const handleCloseOtherDropdown = () => {
      if (isLanguageDropdownOpen && isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    handleCloseOtherDropdown()

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLanguageDropdownOpen, isDropdownOpen])

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
    // Close profile dropdown when opening language dropdown
    if (!isLanguageDropdownOpen && isDropdownOpen) {
      setIsDropdownOpen(false)
    }
  }

  const toggleDropdownMain = () => {
    setIsDropdownOpen(!isDropdownOpen)
    // Close language dropdown when opening profile dropdown
    if (!isDropdownOpen && isLanguageDropdownOpen) {
      setIsLanguageDropdownOpen(false)
    }
  }

  const languages = [
    { code: "en", name: "English", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Flag_of_the_United_States.png/1024px-Flag_of_the_United_States.png" },
    { code: "de", name: "German", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png" },
    { code: "fr", name: "French", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png" },
    { code: "es", name: "Spanish", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png" },
    { code: "it", name: "Italian", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png" },
  ]

  // Sample activity log data
  const activityLogs = [
    {
      id: 1,
      action: "Appointment Created",
      description: "Created new appointment for John Doe - Personal Training",
      timestamp: "2024-12-15 14:30",
      type: "appointment"
    },
    {
      id: 2,
      action: "Member Updated",
      description: "Updated profile information for Sarah Smith",
      timestamp: "2024-12-15 13:15",
      type: "member"
    },
    {
      id: 3,
      action: "Contract Created",
      description: "Created new 12-month contract for Mike Johnson",
      timestamp: "2024-12-15 11:45",
      type: "contract"
    },
    {
      id: 4,
      action: "Appointment Rescheduled",
      description: "Rescheduled yoga class from 3 PM to 4 PM",
      timestamp: "2024-12-15 10:20",
      type: "appointment"
    },
    {
      id: 5,
      action: "Payment Processed",
      description: "Processed monthly payment for Emily Brown",
      timestamp: "2024-12-15 09:30",
      type: "payment"
    },
    {
      id: 6,
      action: "Member Added",
      description: "Added new member: Robert Wilson",
      timestamp: "2024-12-14 16:45",
      type: "member"
    },
    {
      id: 7,
      action: "Class Created",
      description: "Created new HIIT class schedule",
      timestamp: "2024-12-14 15:20",
      type: "class"
    },
    {
      id: 8,
      action: "Contract Renewed",
      description: "Renewed contract for Lisa Garcia",
      timestamp: "2024-12-14 14:10",
      type: "contract"
    }
  ]

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name)
    setIsLanguageDropdownOpen(false)
    console.log("Language selected:", language)
  }

  const handleActivityLogClick = () => {
    setIsActivityLogModalOpen(true)
  }

  const studioName = "Studio One"
  const fullName = "Samantha Jerry"
  const role = "Trainer"

  const handleEditProfile = () => {
    setIsDropdownOpen(false)
    window.location.href = "/dashboard/edit-profile"
  }

  const handlePrivacyPolicy = () => {
    setIsDropdownOpen(false)
    setIsPrivacyModalOpen(true)
  }
  const handleTermsOfUse = () => {
    setIsDropdownOpen(false)
    setIsTermsModalOpen(true)
  }
  const handleChangelog = () => {
    setIsDropdownOpen(false)
    setIsChangelogModalOpen(true)
  }

  const handleLogout = () => {
    setIsDropdownOpen(false)
    window.location.href = "/login"
  }

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
        <div className="bg-[#1a1a1a] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-zinc-700">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
              <X size={20} className="text-white" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">{children}</div>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅'
      case 'member':
        return '👤'
      case 'contract':
        return '📄'
      case 'payment':
        return '💳'
      case 'class':
        return '🏋️'
      default:
        return '📋'
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'border-blue-500'
      case 'member':
        return 'border-green-500'
      case 'contract':
        return 'border-purple-500'
      case 'payment':
        return 'border-yellow-500'
      case 'class':
        return 'border-orange-500'
      default:
        return 'border-gray-500'
    }
  }

  return (
    <>

      <div className="bg-[#111111] min-h-screen">
        <div className="flex flex-col md:flex-row h-full">
          <Sidebar />

          <main
            className={`
    flex-1 md:h-screen h-[calc(100vh-4rem)] overflow-y-auto 
    lg:pt-5    /* large screens ke liye chhota padding */
    md:pt-16   /* tablets ke liye 80px padding */
    sm:pt-16   /* small screens ke liye 96px padding */
    pt-16     /* extra-small (mobile) screens ke liye 112px padding */
    pb-10 p-2
   
    
  `}
          >
            <div
              className="lg:flex hidden rounded-md justify-start bg-[#1f1e1e] z-10 p-2 mb-2 items-center gap-2"
            >
              <div className="flex gap-1 items-center">
                <div className="">
                  <div className="flex items-center gap-2 ">

                    {/* Studio Name */}
                    <div className="flex items-center bg-[#161616]  gap-1 p-2 px-3 rounded-xl w-fit">
                      <Building2 size={14} className="text-white" />
                      <p className="text-sm font-bold text-white">{studioName}</p>
                    </div>
                    {/* Activity Log Icon */}
                    <button
                      onClick={handleActivityLogClick}
                      className="p-2 px-3 rounded-xl text-gray-400 bg-[#161616] hover:bg-[#252525] transition-colors cursor-pointer flex items-center gap-1"
                      aria-label="Activity Log"
                    >
                      <History size={20} />
                    </button>


                  </div>
                </div>

                {/* Language Dropdown */}
                <div className="relative mr-2" ref={languageDropdownRef}>
                  <button
                    onClick={toggleLanguageDropdown}
                    className="p-2 px-3 rounded-xl text-gray-400 bg-[#161616] hover:bg-[#252525] transition-colors cursor-pointer flex items-center gap-1"
                    aria-label="Language Selection"
                  >
                    <Globe size={20} />
                  </button>
                  {isLanguageDropdownOpen && (
                    <div className="absolute right-0 top-12 w-40 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-[90]">
                      <div className="py-2" role="menu">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => handleLanguageSelect(language)}
                            className={` w-full px-4 py-2 text-sm text-left hover:bg-zinc-700 flex items-center gap-3 ${selectedLanguage === language.name ? "text-white bg-zinc-600" : "text-zinc-300"
                              }`}
                          >
                            <img src={language.flag} className="h- rounded-sm w-8" />
                            <span>{language.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <div 
                    onClick={toggleDropdownMain} 
                    className="flex items-center gap-2 p-2 px-3 rounded-xl bg-[#161616] hover:bg-[#252525] transition-colors cursor-pointer"
                  >
                    <img src="/gray-avatar-fotor-20250912192528.png" alt="Profile" className="w-7 h-7 rounded-lg" />
                    <h2 className="font-semibold text-white text-sm leading-tight">{fullName}</h2>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-[90]">
                      <div className="py-2" role="menu">
                        <button
                          onClick={handleEditProfile}
                          className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                        >
                          Edit Profile
                        </button>
                        <hr className="border-zinc-600 my-1" />
                        <button
                          onClick={handlePrivacyPolicy}
                          className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                        >
                          Privacy Policy
                        </button>
                        <button
                          onClick={handleTermsOfUse}
                          className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                        >
                          Terms & Conditions
                        </button>
                        <button
                          onClick={handleChangelog}
                          className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                        >
                          Changelog
                        </button>
                        <hr className="border-zinc-600 my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-xs text-white hover:bg-zinc-700 text-left"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
            <Outlet />
          </main>
        </div>


      </div>

      {/* Activity Log Modal */}
      <Modal isOpen={isActivityLogModalOpen} onClose={() => setIsActivityLogModalOpen(false)} title="Activity Log">
        <div className="text-zinc-300">
          <div className="mb-6">
            <p className="text-zinc-400 mb-4">Recent activities and actions performed on the platform</p>

            <div className="space-y-4">
              {activityLogs.map((activity) => (
                <div
                  key={activity.id}
                  className={` pl-4 py-3 bg-[#222222] rounded-r-lg`}
                >
                  <div className="flex items-start gap-3">
                    {/* <span className="text-lg">{getActivityIcon(activity.type)}</span> */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">{activity.action}</h4>
                        <span className="text-xs text-zinc-400 bg-[#2a2a2a] px-2 py-1 rounded">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 mt-1">{activity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-700">
            <p className="text-sm text-zinc-400">
              Showing {activityLogs.length} recent activities
            </p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
              Load More
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} title="Terms & Conditions">
        <div className="text-zinc-300 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h3>
            <p className="leading-relaxed">
              By accessing and using this fitness studio management platform, you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to abide by the above, please do not use this
              service.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">2. Use License</h3>
            <p className="leading-relaxed mb-3">
              Permission is granted to temporarily download one copy of the materials on Studio One's platform for
              personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the platform</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">3. Disclaimer</h3>
            <p className="leading-relaxed">
              The materials on Studio One's platform are provided on an 'as is' basis. Studio One makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">4. Limitations</h3>
            <p className="leading-relaxed">
              In no event shall Studio One or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on Studio One's platform, even if Studio One or a Studio One authorized
              representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">5. Privacy Policy</h3>
            <p className="leading-relaxed">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
              information when you use our service. By using our service, you agree to the collection and use of
              information in accordance with our Privacy Policy.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">6. Governing Law</h3>
            <p className="leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably
              submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} title="Privacy Policy">
        <div className="text-zinc-300 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Information We Collect</h3>
            <p className="leading-relaxed mb-3">
              We collect information you provide directly to us, such as when you create an account, update your
              profile, or contact us for support. This may include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name, email address, and contact information</li>
              <li>Profile information and preferences</li>
              <li>Fitness goals and health information</li>
              <li>Payment and billing information</li>
              <li>Communications with our support team</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">How We Use Your Information</h3>
            <p className="leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Personalize your experience</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Information Sharing</h3>
            <p className="leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent, except as described in this policy. We may share your information with trusted third parties who
              assist us in operating our platform, conducting our business, or serving our users.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Data Security</h3>
            <p className="leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet or
              electronic storage is 100% secure.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of certain communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@studioone.com or through
              our support channels.
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isChangelogModalOpen} onClose={() => setIsChangelogModalOpen(false)} title="Changelog">
        <div className="text-zinc-300 space-y-8">
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-white">Version 2.1.0</h3>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Latest</span>
            </div>
            <p className="text-sm text-zinc-400 mb-3">Released on December 15, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-white mb-2">🎉 New Features</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Enhanced member analytics dashboard</li>
                  <li>Real-time class capacity tracking</li>
                  <li>Automated membership renewal notifications</li>
                  <li>Mobile app push notifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">🔧 Improvements</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Faster loading times for member profiles</li>
                  <li>Improved search functionality</li>
                  <li>Better mobile responsiveness</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">🐛 Bug Fixes</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fixed calendar sync issues</li>
                  <li>Resolved payment processing errors</li>
                  <li>Fixed member check-in duplicates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold text-white mb-3">Version 2.0.5</h3>
            <p className="text-sm text-zinc-400 mb-3">Released on November 28, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-white mb-2">🔧 Improvements</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Enhanced security measures</li>
                  <li>Improved data backup system</li>
                  <li>Updated user interface elements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">🐛 Bug Fixes</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fixed trainer schedule conflicts</li>
                  <li>Resolved email notification delays</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold text-white mb-3">Version 2.0.0</h3>
            <p className="text-sm text-zinc-400 mb-3">Released on October 15, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-white mb-2">🎉 Major Release</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Complete UI/UX redesign</li>
                  <li>New member management system</li>
                  <li>Advanced reporting and analytics</li>
                  <li>Integration with popular fitness apps</li>
                  <li>Multi-language support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">🔧 Performance</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>50% faster page load times</li>
                  <li>Improved database optimization</li>
                  <li>Enhanced mobile performance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-6">
            <h3 className="text-lg font-semibold text-white mb-3">Version 1.9.2</h3>
            <p className="text-sm text-zinc-400 mb-3">Released on September 20, 2024</p>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-white mb-2">🐛 Critical Fixes</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fixed critical security vulnerability</li>
                  <li>Resolved data synchronization issues</li>
                  <li>Fixed membership expiration notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Dashboardlayout;