/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Home,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Users,
  CheckSquare,
  Settings,
  ShoppingCart,
  Bell,
  ChevronLeft,  
  ChevronRight,
  MenuIcon,
  BadgeDollarSign,
  ClipboardList,
  Building2,
} from "lucide-react";
import OrgaGymLogoWihoutText from '../../../public/Orgagym white without text.svg'

import { RiAccountPinCircleLine, RiContractLine, RiStockFill } from "react-icons/ri";
import { MdEmail, MdOutlineHelpCenter, MdOutlineLeaderboard } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";
import { CgGym } from "react-icons/cg";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaCartPlus, FaPeopleLine } from "react-icons/fa6";
import { Globe } from "react-feather";


const CustomerSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
    {
      id: 2,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
  ]);

  const location = useLocation();
  const navigate = useNavigate();

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleNavigation = (to) => {
    navigate(to);
    setIsSidebarOpen(false);
  };

  const redirectToHome = () => {
    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const languages = [
    { code: "en", name: "English", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Flag_of_the_United_States.png/1024px-Flag_of_the_United_States.png" },
    { code: "de", name: "German", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png" },
    { code: "fr", name: "French", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png" },
    { code: "es", name: "Spanish", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png" },
    { code: "it", name: "Italian", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png" },
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    setIsLanguageDropdownOpen(false);
    console.log("Language selected:", language);
  };

  const studioName = "Studio One";
  const fullName = "Samantha";
  const role = "Trainer";

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    window.location.href = "/admin-dashboard/configuration";
  };

  const handlePrivacyPolicy = () => {
    setIsDropdownOpen(false);
    setIsPrivacyModalOpen(true);
  };

  const handleTermsOfUse = () => {
    setIsDropdownOpen(false);
    setIsTermsModalOpen(true);
  };

  const handleChangelog = () => {
    setIsDropdownOpen(false);
    setIsChangelogModalOpen(true);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    window.location.href = "/login";
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

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
    );
  };

  const menuItems = [
    { icon: Home, label: "My Area", to: "/admin-dashboard/my-area" },
    { icon: CheckSquare, label: "To-Do", to: "/admin-dashboard/to-do" },
    { icon: ClipboardList, label: "Notes", to: "/admin-dashboard/notes" },
    { icon: Users, label: "Studios", to: "/admin-dashboard/studios" },
    {
      icon: RiContractLine,
      label: "Contract",
      to: "/admin-dashboard/contract",
    },
    {
      icon: MdOutlineHelpCenter,
      label: "Tickets",
      to: "/admin-dashboard/tickets",
      indicatorCount: 3,
    },
    {
      icon: MdEmail,
      label: "Email",
      to: "/admin-dashboard/email",
      indicatorCount: 3,
    },
    {
      icon: FaPeopleLine,
      label: "Leads",
      to: "/admin-dashboard/leads",
    },
    {
      icon: BadgeDollarSign,
      label: "Finances",
      to: "/admin-dashboard/finances",
    },
    { icon: FaCartPlus, label: "Marketplace", to: "/admin-dashboard/marketplace" },
    {
      icon: CgGym,
      label: "Training",
      to: "/admin-dashboard/training-management",
    },
    {
      icon: TbBrandGoogleAnalytics,
      label: "Analytics",
      to: "/admin-dashboard/analytics",
    },
    {
      icon: RiAccountPinCircleLine,
      label: "Demo Access",
      to: "/admin-dashboard/demo-access",
    },
    {
      icon: Settings,
      label: "Configuration",
      to: "/admin-dashboard/configuration",
    },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-[#111111] border-b border-zinc-800 p-2 flex items-center justify-between lg:hidden z-40">
        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}

        <div className="flex items-center gap-2">
                  <div className="bg-orange-500 p-2 rounded-md">
                    <img src={OrgaGymLogoWihoutText} className="h-6 w-6" alt="Orgagym Logo" />
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg text-white hover:bg-zinc-700"
                    aria-label="Toggle Sidebar"
                  >
                    <Menu size={20} />
                  </button>
                </div>
        <div className="flex gap-1 items-center">
          <div className="relative mr-2">
            <button
              onClick={toggleLanguageDropdown}
              className="p-2 px-3 rounded-xl text-gray-500 bg-[#1C1C1C] cursor-pointer flex items-center gap-1"
              aria-label="Language Selection"
            >
              <Globe size={20} />
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 top-12 w-40 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-50">
                <div className="py-2" role="menu">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-zinc-700 flex items-center gap-3 ${
                        selectedLanguage === language.name ? "text-white bg-zinc-600" : "text-zinc-300"
                      }`}
                    >
                      <img src={language.flag} className="h-5 rounded-sm w-8" alt={language.name} />
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div onClick={toggleDropdown} className="flex items-center gap-1 cursor-pointer">
            <img src="/gray-avatar-fotor-20250912192528.png" alt="Profile" className="w-9 h-9 rounded-lg" />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-5 top-16 w-46 bg-[#222222]/50 backdrop-blur-3xl rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-white text-sm leading-tight">{fullName}</h2>
                    <span className="text-zinc-400 text-xs font-medium">{role}</span>
                  </div>

                  <div className="flex items-center mt-2 gap-1 bg-black py-1 px-3 rounded-md w-fit">
                    <Building2 size={14} className="text-white" />
                    <p className="text-xs font-medium text-white">{studioName}</p>
                  </div>
                </div>
              </div>

              <div className="py-2" role="menu">
                <button
                  onClick={handleEditProfile}
                  className="block w-full px-4 py-2 text-xs text-white hover:bg-zinc-700 text-left"
                >
                  Edit Profile
                </button>
                <hr className="border-zinc-600 my-1" />
                <button
                  onClick={handlePrivacyPolicy}
                  className="block w-full px-4 py-2 text-xs text-white hover:bg-zinc-700 text-left"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={handleTermsOfUse}
                  className="block w-full px-4 py-2 text-xs text-white hover:bg-zinc-700 text-left"
                >
                  Terms & Conditions
                </button>
                <button
                  onClick={handleChangelog}
                  className="block w-full px-4 py-2 text-xs text-white hover:bg-zinc-700 text-left"
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

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-[#111111] transition-all duration-500 ease-in-out overflow-hidden 
         lg:relative lg:block 
         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
         ${isCollapsed ? "lg:w-20" : "lg:w-64 w-64"}
        `}
      >
        <div className="absolute top-4 right-4 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-white hover:bg-zinc-700 rounded-lg"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="hidden md:block absolute right-0 top-20 bg-[#222222] rounded-full p-2 cursor-pointer z-50"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-white" />
          ) : (
            <ChevronLeft size={20} className="text-white" />
          )}
        </div>

        <div className="flex flex-col h-full overflow-y-auto">
          <div className="hidden lg:block">
                      <div className={`flex ${isCollapsed ? "justify-center" : "justify-center"} items-center w-full`}>
                        {isCollapsed ? (
                          <div className="w-full bg-orange-500 flex items-center justify-center p-4">
                            <img src={OrgaGymLogoWihoutText} className="h-auto w-auto max-w-full" alt="Orgagym Logo" />
                          </div>
                        ) : (
                          <div className="w-full bg-orange-500 flex items-center justify-center p-4">
                            <img src="/Orgagym white.svg" className="h-20 w-auto max-w-full" alt="Orgagym Logo" />
                          </div>
                        )}
                      </div>
                    </div>
          <nav className="flex-1 overflow-y-auto custom-scrollbar">
            <ul className="space-y-2 p-4">
            {menuItems.map((item) => (
  <li key={item.label}>
    {item.label === "Configuration" && (
      <hr className="border-t border-zinc-700 my-3" />
    )}
    <button
      onClick={() => handleNavigation(item.to)}
      className={`
        flex items-center gap-3 cursor-pointer text-sm px-4 py-2 open_sans_font text-zinc-200 relative w-full
        ${isCollapsed ? "justify-center" : "text-left"}
        group transition-all duration-500 
        ${location.pathname === item.to
          ? `text-white ${!isCollapsed && "border-l-2 border-white pl-3"}`
          : `hover:text-white ${!isCollapsed && "hover:border-l-2 hover:border-white hover:pl-3"}`
        }
      `}
    >
      <div className="relative">
        <item.icon
          size={20}
          className={`
            ${location.pathname === item.to
              ? "text-white"
              : "text-zinc-400 group-hover:text-white"
            }
          `}
        />
        {/* Orange indicator with count for Tickets and Email */}
        {item.indicatorCount && (
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {item.indicatorCount}
          </span>
        )}
      </div>
      {!isCollapsed && (
        <div className="flex items-center justify-between w-full">
          <span className="text-md">{item.label}</span>
        
        </div>
      )}
    </button>
  </li>
))}
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <button
              onClick={redirectToHome}
              className={`
                flex items-center cursor-pointer mb-10 gap-3 open_sans_font px-4 py-2 text-zinc-400 hover:text-white
                ${isCollapsed ? "justify-center" : "text-left"}
                ${!isCollapsed && "hover:border-l-2 hover:border-white hover:pl-3"} 
                transition-all duration-300 w-full
              `}
            >
              <div className="relative">
                <LogOut size={20} />
                {isCollapsed && (
                  <span className="absolute left-full ml-2 whitespace-nowrap bg-[#222222] text-white px-2 py-1 rounded text-xs opacity-0 hover:opacity-100 pointer-events-none">
                    Logout
                  </span>
                )}
              </div>
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsRightSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 bottom-0 w-[320px] bg-[#181818] p-6 z-50 
          lg:static lg:w-80 lg:hidden block lg:rounded-3xl
          transform ${isRightSidebarOpen
            ? "translate-x-0"
            : "translate-x-full lg:translate-x-0"
          }
          transition-all duration-500 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl text-white font-bold oxanium_font">
            Notification
          </h2>
          <button
            onClick={toggleRightSidebar}
            className="lg:hidden p-2 hover:bg-zinc-700 text-white rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#1C1C1C] rounded-lg p-4 relative transform transition-all duration-200 hover:scale-[1.02]"
            >
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors duration-200"
              >
                <X size={16} />
              </button>
              <h3 className="mb-2 text-white oxanium_font">{notification.heading}</h3>
              <p className="text-sm open_sans_font text-zinc-400">
                {notification.description}
              </p>
            </div>
          ))}
        </div>
      </aside>

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

export default CustomerSidebar;