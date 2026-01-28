/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from '../components/admin-dashboard-components/sidebar'
import { Globe, History, X } from "lucide-react";

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false)

  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)

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

  const toggleDropdownMain = () => setIsDropdownOpen(!isDropdownOpen)

  const handleActivityLogClick = () => {
    setIsActivityLogModalOpen(true)
  }

  const fullName = "Admin Panel"
  const role = "Trainer"

  const handleAccountManagement = () => {
    setIsDropdownOpen(false);
    navigate("/admin-dashboard/configuration?tab=account-management");
  };

  const handleLogout = () => {
    setIsDropdownOpen(false)
    window.location.href = "/login"
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅'
      case 'member':
        return '👤'
      case 'contract':
        return '📝'
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

  return (
    <div className="bg-[#111111] min-h-screen">
      <div className="flex flex-col md:flex-row h-full">
        <Sidebar />
        <main className={`
    flex-1 md:h-screen h-[calc(100vh-4rem)] overflow-y-auto 
    lg:pt-5    /* large screens ke liye chhota padding */
    md:pt-16   /* tablets ke liye 80px padding */
    sm:pt-16   /* small screens ke liye 96px padding */
    pt-20     /* extra-small (mobile) screens ke liye 112px padding */
    pb-10 p-2
  `}>
          <div
            className="lg:flex hidden rounded-md justify-start bg-[#1f1e1e] z-10 p-2 mb-2 items-center gap-2"
          >
            <div className="flex gap-1 items-center">
              <div>
                <div className="flex items-center gap-2">
                  {/* Activity Log Button */}
                  <button
                    onClick={handleActivityLogClick}
                    className="p-2 px-3 rounded-xl text-gray-400 bg-[#161616] cursor-pointer flex items-center gap-1"
                    aria-label="Activity Log"
                  >
                    <History size={20} />
                  </button>
                  <div className="flex items-center gap-1">
                    <h2 className="font-semibold text-white text-md leading-tight">
                      {fullName}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="relative mr-2">
                <button
                  onClick={toggleLanguageDropdown}
                  className="p-2 px-3 rounded-xl text-gray-500 bg-[#1C1C1C] cursor-pointer flex items-center gap-1"
                >
                  <Globe size={20} />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute -right-6 top-12 w-40 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-[90]">
                    <div className="py-2" role="menu">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageSelect(language)}
                          className={`w-full px-4 py-2 text-sm text-left hover:bg-zinc-700 flex items-center gap-3 ${selectedLanguage === language.name
                            ? "text-white bg-zinc-600"
                            : "text-zinc-300"
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

              <div className="relative">
                <div
                  onClick={toggleDropdownMain}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <img
                    src="/gray-avatar-fotor-20250912192528.png"
                    alt="Profile"
                    className="w-9 h-9 rounded-lg"
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-46 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-[999]">
                    <div className="py-2" role="menu">
                      <button
                        onClick={handleAccountManagement}
                        className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700 text-left"
                      >
                        Account Management
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

          <div className="lg:pt-0 pt-6">
            <Outlet />
          </div>
        </main>
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
                  className={`border-l-4 ${getActivityColor(activity.type)} pl-4 py-3 bg-[#222222] rounded-r-lg`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
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
    </div>
  );
};

export default AdminDashboardLayout;