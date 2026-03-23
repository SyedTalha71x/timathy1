/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  Calendar,
  MessageCircle,
  LogOut,
  Timer,
  Apple,
} from "lucide-react";
import { CgGym } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../features/auth/authSlice";
import { haptic } from "../../../utils/haptic";

const MemberViewSidebar = ({ isCollapsed: externalIsCollapsed, onToggleCollapse }) => {
  const { t } = useTranslation();
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(3);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (to) => {
    haptic.light();
    navigate(to);
  };

  const handleLogout = async () => {
    try {
      haptic.warning();
      await dispatch(logout()).unwrap();
      console.log("Logout successfully");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ============================================
  // Menu Items
  // ============================================
  const menuItems = [
    { icon: Home, labelKey: "nav.studio", to: "/member-view/studio-menu" },
    { icon: Calendar, labelKey: "nav.appointments", to: "/member-view/appointment" },
    { icon: MessageCircle, labelKey: "nav.messages", to: "/member-view/communication", badgeCount: unreadMessagesCount },
    { icon: Timer, labelKey: "nav.classes", to: "/member-view/classes" },
    { icon: CgGym, labelKey: "nav.training", to: "/member-view/training" },
    { icon: Apple, labelKey: "nav.nutrition", to: "/member-view/nutrition" },
  ];

  return (
    <aside
      className={`
        hidden lg:block
        relative h-screen bg-[#111111] transition-all duration-500 overflow-hidden
        ${isCollapsed ? "lg:w-20" : "lg:w-64"}
      `}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scrollbar">
          <ul className="space-y-2 px-4 pt-1 pb-4">
            {menuItems.map((item) => (
              <li key={item.labelKey}>
                <button
                  onClick={() => handleNavigation(item.to)}
                  className={`flex items-center gap-3 text-sm px-4 py-2 open_sans_font relative w-full ${
                    isCollapsed ? "justify-center" : "text-left"
                  } group transition-all duration-300 ${
                    location.pathname === item.to
                      ? `text-white border-l-2 border-primary ${isCollapsed ? "pl-[14px]" : "pl-3"}`
                      : `text-zinc-200 hover:text-white hover:border-l-2 hover:border-white ${isCollapsed ? "hover:pl-[14px]" : "hover:pl-3"}`
                  }`}
                >
                  <div className="relative">
                    <item.icon
                      size={24}
                      className={`cursor-pointer ${
                        location.pathname === item.to
                          ? "text-white"
                          : "text-zinc-400 group-hover:text-white"
                      }`}
                    />
                    {item.badgeCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-primary-hover text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                        {item.badgeCount}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && <span>{t(item.labelKey)}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-2 open_sans_font text-zinc-400 hover:text-white w-full ${
              isCollapsed
                ? "justify-center hover:border-l-2 hover:border-white hover:pl-[14px]"
                : "text-left hover:border-l-2 hover:border-white hover:pl-3"
            } transition-all duration-300`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>{t("common.logout")}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MemberViewSidebar;
