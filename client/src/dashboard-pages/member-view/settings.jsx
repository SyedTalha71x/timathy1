/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { updateUserData, updatedPassword, logout } from "../../features/auth/authSlice"
import { updateReminders } from "../../features/notification/notificationSlice"
import { notification } from "antd"
import { haptic } from "../../utils/haptic"
import { useNavigate } from "react-router-dom"
import KeyboardSpacer from "../../components/shared/KeyboardSpacer"
import {
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  User,
  Bell,
  FileText,
  Mail,
  Lock,
  Clock,
  Search,
  X,
  ClipboardList,
  Timer,
  LogOut,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { IoIosMegaphone } from "react-icons/io"

// ============================================
// Navigation Items
// ============================================
const NAVIGATION_ITEMS = [
  {
    id: "account",
    labelKey: "settings.nav.account",
    icon: User,
    sections: [
      { id: "change-email", labelKey: "settings.nav.changeEmail" },
      { id: "change-password", labelKey: "settings.nav.changePassword" },
      { id: "logout", labelKey: "common.logout" },
      { id: "delete-account", labelKey: "settings.nav.deleteAccount" },
    ],
  },
  {
    id: "notifications",
    labelKey: "settings.nav.notifications",
    icon: Bell,
    sections: [
      { id: "appointment-notifications", labelKey: "nav.appointments" },
      { id: "classes-notifications", labelKey: "nav.classes" },
      { id: "general-notifications", labelKey: "settings.nav.general" },
    ],
  },
  {
    id: "general",
    labelKey: "settings.nav.general",
    icon: FileText,
    sections: [
      { id: "imprint", labelKey: "settings.nav.imprint" },
      { id: "privacy-policy", labelKey: "settings.nav.privacyPolicy" },
    ],
  },
]

const SettingsPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { studio, loading } = useSelector((state) => state.studios)

  // Navigation state
  const [activeCategory, setActiveCategory] = useState("account")
  const [activeSection, setActiveSection] = useState("change-email")
  const [expandedCategories, setExpandedCategories] = useState(["account"])
  const [mobileShowContent, setMobileShowContent] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Confirmation modals
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  // Detect keyboard for mobile content view
  useEffect(() => {
    const onFocusIn = (e) => {
      const tag = e.target?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) {
        setKeyboardOpen(true)
      }
    }
    const onFocusOut = () => {
      setTimeout(() => {
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (tag !== "input" && tag !== "textarea" && !document.activeElement?.isContentEditable) {
          setKeyboardOpen(false)
        }
      }, 100)
    }
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
    }
  }, [])

  // Account state
  const [accountSettings, setAccountSettings] = useState({
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Notification state
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const defaults = {
      appointmentReminders: {
        enabled: true,
        emailReminder: { enabled: true, timeBeforeHours: 24 },
        smsReminder: { enabled: true, timeBeforeHours: 2 },
        pushReminder: { enabled: true, timeBeforeHours: 1 },
      },
      classReminders: {
        enabled: true,
        emailReminder: { enabled: true, timeBeforeHours: 24 },
        pushReminder: { enabled: true, timeBeforeHours: 24 },
        spotAvailable: { enabled: true, email: true, push: true },
      },
      bulletinBoard: {
        enabled: true,
      },
      studioMessages: {
        enabled: true,
      },
    }
    // Persist initial class reminder hours so classes.jsx can read it
    try {
      if (!localStorage.getItem("class_reminder_hours")) {
        localStorage.setItem("class_reminder_hours", JSON.stringify(defaults.classReminders.pushReminder.timeBeforeHours))
      }
    } catch {}
    return defaults
  })

  // General state
  const [generalSettings, setGeneralSettings] = useState({
    imprint: studio
      ? `Company Name: ${studio.studioName || "N/A"}
Address: ${studio.street || "N/A"}, ${studio.city || "N/A"}, ${studio.zipCode || "N/A"}, ${studio.country || "N/A"}
Phone: ${studio.phone || "N/A"}
Email: ${studio.email || "N/A"}
Registration Number: ${studio.registrationNumber || "N/A"} 
Tax ID: ${studio.texId || "N/A"}

Managing Director: ${studio.studioOwner || "N/A"}
Court of Registration: ${studio.court || "N/A"}
Registration Number: ${studio.registrationNumber || "N/A"} 
Last updated: ${studio.updatedAt ? new Date(studio.updatedAt).toDateString() : "N/A"}`
      : "",
    privacyPolicy: `Privacy Policy

1. Data Collection
We collect personal information that you provide to us directly, such as when you create an account, book appointments, or contact us.

2. Use of Information
We use your information to provide our services, communicate with you, and improve our offerings.

3. Data Sharing
We do not sell or rent your personal information to third parties.

4. Data Security
We implement appropriate security measures to protect your personal information.

5. Your Rights
You have the right to access, update, or delete your personal information.

6. Contact Us
If you have any questions about this privacy policy, please contact us at privacy@mystudio.com.

Last updated: ${studio?.updatedAt ? new Date(studio.updatedAt).toDateString() : "N/A"}`,
  })

  // ============================================
  // Handlers
  // ============================================
  const handleUpdateAccountLogin = (field, value) => {
    setAccountSettings({ ...accountSettings, [field]: value })
  }

  const handleRequestEmailChange = async () => {
    const { newEmail, currentPassword } = accountSettings
    if (!newEmail) {
      return notification.error({ message: t("settings.email.missingEmail"), description: t("settings.email.missingEmailDesc") })
    }
    if (!currentPassword) {
      return notification.error({ message: t("settings.email.passwordRequired"), description: t("settings.email.passwordRequiredDesc") })
    }
    try {
      await dispatch(updateUserData({ email: newEmail, currentPassword })).unwrap()
      haptic.success()
      notification.success({ message: t("settings.email.changeRequested"), description: t("settings.email.changeRequestedDesc") })
      setAccountSettings({ ...accountSettings, newEmail: "", currentPassword: "" })
    } catch (err) {
      haptic.error()
      notification.error({ message: t("settings.email.changeFailed"), description: err.message || t("settings.errors.somethingWrong") })
    }
  }

  const handleRequestPasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = accountSettings
    if (!currentPassword || !newPassword || !confirmPassword) {
      return notification.error({ message: t("settings.password.missingFields"), description: t("settings.password.missingFieldsDesc") })
    }
    if (newPassword !== confirmPassword) {
      return notification.error({ message: t("settings.password.mismatch"), description: t("settings.password.mismatchDesc") })
    }
    if (newPassword.length < 8) {
      return notification.error({ message: t("settings.password.weakPassword"), description: t("settings.password.weakPasswordDesc") })
    }
    try {
      await dispatch(updatedPassword({ oldPassword: currentPassword, newPassword })).unwrap()
      haptic.success()
      notification.success({ message: t("settings.password.changed"), description: t("settings.password.changedDesc") })
      setAccountSettings({ ...accountSettings, currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      haptic.error()
      notification.error({ message: t("settings.password.changeFailed"), description: err.message || t("settings.errors.somethingWrong") })
    }
  }

  const handleUpdateReminderSettings = (reminderType, field, value) => {
    const updated = {
      ...notificationSettings,
      appointmentReminders: {
        ...notificationSettings.appointmentReminders,
        [reminderType]: {
          ...notificationSettings.appointmentReminders[reminderType],
          [field]: value,
        },
      },
    }
    setNotificationSettings(updated)
  }

  const saveAppointmentReminders = (reminderData) => {
    const data = reminderData || notificationSettings.appointmentReminders
    dispatch(updateReminders({ reminderData: data }))
      .unwrap()
      .catch((err) => notification.error({ message: t("settings.errors.updateFailed"), description: err.message || t("settings.errors.couldNotSave") }))
  }

  const handleToggleAppointmentReminders = (checked) => {
    const updated = {
      ...notificationSettings,
      appointmentReminders: { ...notificationSettings.appointmentReminders, enabled: checked },
    }
    setNotificationSettings(updated)
    dispatch(updateReminders({ reminderData: updated.appointmentReminders }))
      .unwrap()
      .catch((err) => notification.error({ message: t("settings.errors.updateFailed"), description: err.message || t("settings.errors.couldNotSave") }))
  }

  const handleUpdateGeneralNotification = (category, field, value) => {
    const updated = {
      ...notificationSettings,
      [category]: {
        ...notificationSettings[category],
        [field]: value,
      },
    }
    setNotificationSettings(updated)
    // TODO: dispatch to backend when endpoint is available
  }

  const handleToggleClassReminders = (checked) => {
    const updated = {
      ...notificationSettings,
      classReminders: { ...notificationSettings.classReminders, enabled: checked },
    }
    setNotificationSettings(updated)
    // TODO: dispatch(updateReminders({ reminderData: updated.classReminders })) when backend is ready
  }

  const handleUpdateClassReminderSettings = (reminderType, field, value) => {
    const updated = {
      ...notificationSettings,
      classReminders: {
        ...notificationSettings.classReminders,
        [reminderType]: {
          ...notificationSettings.classReminders[reminderType],
          [field]: value,
        },
      },
    }
    setNotificationSettings(updated)
    // TODO: dispatch to backend when endpoint is available
  }

  const handleUpdateSpotAvailable = (field, value) => {
    const updated = {
      ...notificationSettings,
      classReminders: {
        ...notificationSettings.classReminders,
        spotAvailable: {
          ...notificationSettings.classReminders.spotAvailable,
          [field]: value,
        },
      },
    }
    setNotificationSettings(updated)
    // TODO: dispatch to backend when endpoint is available
  }

  // ============================================
  // Logout & Delete Account
  // ============================================
  const handleLogout = async () => {
    try {
      haptic.warning()
      await dispatch(logout()).unwrap()
      navigate("/login", { replace: true })
    } catch (err) {
      haptic.error()
      notification.error({ message: t("settings.errors.logoutFailed"), description: err.message || t("settings.errors.somethingWrong") })
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return
    try {
      haptic.warning()
      // TODO: dispatch(deleteAccount()) when backend endpoint is ready
      notification.success({ message: t("settings.deleteAccount.deleted"), description: t("settings.deleteAccount.deletedDesc") })
      setShowDeleteConfirm(false)
      setDeleteConfirmText("")
      navigate("/login", { replace: true })
    } catch (err) {
      haptic.error()
      notification.error({ message: t("settings.deleteAccount.deletionFailed"), description: err.message || t("settings.errors.couldNotDelete") })
    }
  }

  // ============================================
  // Navigation Helpers
  // ============================================
  const toggleCategory = (categoryId) => {
    haptic.light()
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
    setActiveCategory(categoryId)
  }

  const navigateToSection = (categoryId, sectionId) => {
    haptic.light()
    setActiveCategory(categoryId)
    setActiveSection(sectionId)
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories((prev) => [...prev, categoryId])
    }
    setMobileShowContent(true)
  }

  const getCurrentSectionTitle = () => {
    for (const cat of NAVIGATION_ITEMS) {
      for (const section of cat.sections) {
        if (section.id === activeSection) return t(section.labelKey)
      }
    }
    return t("nav.settings")
  }

  const matchesSearch = (text) => {
    if (!searchQuery) return false
    return text.toLowerCase().includes(searchQuery.toLowerCase())
  }

  const filteredNavItems = searchQuery
    ? NAVIGATION_ITEMS.filter(
        (cat) => matchesSearch(t(cat.labelKey)) || cat.sections.some((s) => matchesSearch(t(s.labelKey)))
      )
    : NAVIGATION_ITEMS

  // ============================================
  // Toggle Component
  // ============================================
  const Toggle = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      onClick={() => { if (!disabled) { haptic.light(); onChange(!checked) } }}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${checked ? "bg-primary" : "bg-surface-button"}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )

  // ============================================
  // Section Content
  // ============================================
  const renderSectionContent = () => {
    switch (activeSection) {
      // ---- CHANGE EMAIL ----
      case "change-email":
        return (
          <div className="space-y-6 max-w-xl">
            <div className="hidden lg:block">
              <h3 className="text-lg font-semibold text-content-primary mb-1">                {t("settings.email.title")}</h3>
              <p className="text-sm text-content-faint">                {t("settings.email.subtitle")}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-content-secondary block mb-2">                  {t("settings.email.newEmail")}<span className="text-accent-red ml-1">*</span></label>
                <input
                  type="email"
                  value={accountSettings.newEmail}
                  onChange={(e) => handleUpdateAccountLogin("newEmail", e.target.value)}
                  placeholder={t("settings.email.newEmailPlaceholder")}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-content-secondary block mb-2">                  {t("settings.email.currentPassword")}<span className="text-accent-red ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={accountSettings.currentPassword}
                    onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)}
                    placeholder={t("settings.email.currentPasswordPlaceholder")}
                    className="w-full bg-surface-dark rounded-xl px-4 py-2.5 pr-10 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleRequestEmailChange}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-colors"
              >
                {t("settings.email.requestChange")}
              </button>
            </div>
          </div>
        )

      // ---- CHANGE PASSWORD ----
      case "change-password":
        return (
          <div className="space-y-6 max-w-xl">
            <div className="hidden lg:block">
              <h3 className="text-lg font-semibold text-content-primary mb-1">                {t("settings.password.title")}</h3>
              <p className="text-sm text-content-faint">                {t("settings.password.subtitle")}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-content-secondary block mb-2">                  {t("settings.email.currentPassword")}<span className="text-accent-red ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={accountSettings.currentPassword}
                    onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)}
                    placeholder={t("settings.email.currentPasswordPlaceholder")}
                    className="w-full bg-surface-dark rounded-xl px-4 py-2.5 pr-10 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-content-secondary block mb-2">                  {t("settings.password.newPassword")}<span className="text-accent-red ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={accountSettings.newPassword}
                    onChange={(e) => handleUpdateAccountLogin("newPassword", e.target.value)}
                    placeholder={t("settings.password.newPasswordPlaceholder")}
                    className="w-full bg-surface-dark rounded-xl px-4 py-2.5 pr-10 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-content-secondary block mb-2">                  {t("settings.password.confirmPassword")}<span className="text-accent-red ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={accountSettings.confirmPassword}
                    onChange={(e) => handleUpdateAccountLogin("confirmPassword", e.target.value)}
                    placeholder={t("settings.password.confirmPasswordPlaceholder")}
                    className="w-full bg-surface-dark rounded-xl px-4 py-2.5 pr-10 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleRequestPasswordChange}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-colors"
              >
                {t("settings.password.requestChange")}
              </button>
            </div>
          </div>
        )

      // ---- APPOINTMENT NOTIFICATIONS ----
      case "appointment-notifications":
        return (
          <div className="space-y-6 max-w-xl">
            <div className="hidden lg:block">
              <h3 className="text-lg font-semibold text-content-primary mb-1">{t("settings.notifications.appointmentTitle")}</h3>
              <p className="text-sm text-content-faint">{t("settings.notifications.appointmentSubtitle")}</p>
            </div>

            <div className="flex items-center justify-between bg-surface-card rounded-xl p-4 border border-border">
              <div>
                <p className="text-sm font-medium text-content-primary">{t("settings.notifications.enableAppointment")}</p>
                <p className="text-xs text-content-faint mt-0.5">{t("settings.notifications.enableAppointmentDesc")}</p>
              </div>
              <Toggle
                checked={notificationSettings.appointmentReminders.enabled}
                onChange={(checked) => handleToggleAppointmentReminders(checked)}
              />
            </div>

            {notificationSettings.appointmentReminders.enabled && (
              <div className="space-y-3">
                {/* Email Channel */}
                <div className="bg-surface-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-content-muted" />
                      <div>
                        <p className="text-sm font-medium text-content-primary">{t("settings.notifications.emailNotifications")}</p>
                        <p className="text-xs text-content-faint">{t("settings.notifications.emailAppointmentDesc")}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={notificationSettings.appointmentReminders.emailReminder.enabled}
                      onChange={(checked) => handleUpdateReminderSettings("emailReminder", "enabled", checked)}
                    />
                  </div>
                </div>

                {/* Push Channel */}
                <div className="bg-surface-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={16} className="text-content-muted" />
                      <div>
                        <p className="text-sm font-medium text-content-primary">{t("settings.notifications.pushNotifications")}</p>
                        <p className="text-xs text-content-faint">{t("settings.notifications.pushAppointmentDesc")}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={notificationSettings.appointmentReminders.pushReminder.enabled}
                      onChange={(checked) => handleUpdateReminderSettings("pushReminder", "enabled", checked)}
                    />
                  </div>
                </div>

                {/* Reminder Timing */}
                <div className="bg-surface-card rounded-xl p-4 border border-border space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-content-muted" />
                    <div>
                      <p className="text-sm font-medium text-content-primary">{t("settings.notifications.reminderTiming")}</p>
                      <p className="text-xs text-content-faint">{t("settings.notifications.reminderTimingAppointmentDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-7">
                    <span className="text-xs text-content-muted">{t("settings.notifications.remind")}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={notificationSettings.appointmentReminders.emailReminder.timeBeforeHours}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "")
                        const val = raw === "" ? "" : parseInt(raw)
                        setNotificationSettings(prev => ({
                          ...prev,
                          appointmentReminders: {
                            ...prev.appointmentReminders,
                            emailReminder: { ...prev.appointmentReminders.emailReminder, timeBeforeHours: val },
                            pushReminder: { ...prev.appointmentReminders.pushReminder, timeBeforeHours: val },
                          },
                        }))
                      }}
                      onBlur={(e) => {
                        const num = parseInt(e.target.value)
                        const val = !num || num < 1 ? 1 : num > 168 ? 168 : num
                        const updatedReminders = {
                          ...notificationSettings.appointmentReminders,
                          emailReminder: { ...notificationSettings.appointmentReminders.emailReminder, timeBeforeHours: val },
                          pushReminder: { ...notificationSettings.appointmentReminders.pushReminder, timeBeforeHours: val },
                        }
                        setNotificationSettings(prev => ({
                          ...prev,
                          appointmentReminders: updatedReminders,
                        }))
                        saveAppointmentReminders(updatedReminders)
                      }}
                      className="w-20 bg-surface-dark rounded-lg px-3 py-1.5 text-content-primary text-sm outline-none border border-transparent focus:border-primary transition-colors text-center"
                      onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)}
                    />
                    <span className="text-xs text-content-muted">{t("settings.notifications.hoursBeforeAppointment")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      // ---- CLASS NOTIFICATIONS ----
      case "classes-notifications":
        return (
          <div className="space-y-6 max-w-xl">
            <div className="hidden lg:block">
              <h3 className="text-lg font-semibold text-content-primary mb-1">{t("settings.notifications.classTitle")}</h3>
              <p className="text-sm text-content-faint">{t("settings.notifications.classSubtitle")}</p>
            </div>

            <div className="flex items-center justify-between bg-surface-card rounded-xl p-4 border border-border">
              <div>
                <p className="text-sm font-medium text-content-primary">{t("settings.notifications.enableClass")}</p>
                <p className="text-xs text-content-faint mt-0.5">{t("settings.notifications.enableClassDesc")}</p>
              </div>
              <Toggle
                checked={notificationSettings.classReminders.enabled}
                onChange={(checked) => handleToggleClassReminders(checked)}
              />
            </div>

            {notificationSettings.classReminders.enabled && (
              <div className="space-y-3">
                {/* Email Channel */}
                <div className="bg-surface-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-content-muted" />
                      <div>
                        <p className="text-sm font-medium text-content-primary">{t("settings.notifications.emailNotifications")}</p>
                        <p className="text-xs text-content-faint">{t("settings.notifications.emailClassDesc")}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={notificationSettings.classReminders.emailReminder.enabled}
                      onChange={(checked) => handleUpdateClassReminderSettings("emailReminder", "enabled", checked)}
                    />
                  </div>
                </div>

                {/* Push Channel */}
                <div className="bg-surface-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={16} className="text-content-muted" />
                      <div>
                        <p className="text-sm font-medium text-content-primary">{t("settings.notifications.pushNotifications")}</p>
                        <p className="text-xs text-content-faint">{t("settings.notifications.pushClassDesc")}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={notificationSettings.classReminders.pushReminder.enabled}
                      onChange={(checked) => handleUpdateClassReminderSettings("pushReminder", "enabled", checked)}
                    />
                  </div>
                </div>

                {/* Reminder Timing */}
                <div className="bg-surface-card rounded-xl p-4 border border-border space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-content-muted" />
                    <div>
                      <p className="text-sm font-medium text-content-primary">{t("settings.notifications.reminderTiming")}</p>
                      <p className="text-xs text-content-faint">{t("settings.notifications.reminderTimingClassDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-7">
                    <span className="text-xs text-content-muted">{t("settings.notifications.remind")}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={notificationSettings.classReminders.emailReminder.timeBeforeHours}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "")
                        const val = raw === "" ? "" : parseInt(raw)
                        setNotificationSettings(prev => ({
                          ...prev,
                          classReminders: {
                            ...prev.classReminders,
                            emailReminder: { ...prev.classReminders.emailReminder, timeBeforeHours: val },
                            pushReminder: { ...prev.classReminders.pushReminder, timeBeforeHours: val },
                          },
                        }))
                      }}
                      onBlur={(e) => {
                        const num = parseInt(e.target.value)
                        const val = !num || num < 1 ? 1 : num > 168 ? 168 : num
                        setNotificationSettings(prev => ({
                          ...prev,
                          classReminders: {
                            ...prev.classReminders,
                            emailReminder: { ...prev.classReminders.emailReminder, timeBeforeHours: val },
                            pushReminder: { ...prev.classReminders.pushReminder, timeBeforeHours: val },
                          },
                        }))
                        try { localStorage.setItem("class_reminder_hours", JSON.stringify(val)) } catch {}
                        // TODO: dispatch class reminders save when endpoint is ready
                      }}
                      className="w-20 bg-surface-dark rounded-lg px-3 py-1.5 text-content-primary text-sm outline-none border border-transparent focus:border-primary transition-colors text-center"
                      onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)}
                    />
                    <span className="text-xs text-content-muted">{t("settings.notifications.hoursBeforeClass")}</span>
                  </div>
                </div>

                {/* Class-specific: Spot Available */}
                <div className="bg-surface-card rounded-xl p-4 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Timer size={16} className="text-content-muted" />
                      <div>
                        <p className="text-sm font-medium text-content-primary">{t("settings.notifications.spotAvailable")}</p>
                        <p className="text-xs text-content-faint">{t("settings.notifications.spotAvailableDesc")}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={notificationSettings.classReminders.spotAvailable.enabled}
                      onChange={(checked) => handleUpdateSpotAvailable("enabled", checked)}
                    />
                  </div>

                  {notificationSettings.classReminders.spotAvailable.enabled && (
                    <div className="ml-7 space-y-2.5 pt-1 border-t border-border">
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2.5">
                          <Mail size={14} className="text-content-muted" />
                          <span className="text-sm text-content-primary">{t("settings.notifications.email")}</span>
                        </div>
                        <Toggle
                          checked={notificationSettings.classReminders.spotAvailable.email}
                          onChange={(checked) => handleUpdateSpotAvailable("email", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Bell size={14} className="text-content-muted" />
                          <span className="text-sm text-content-primary">{t("settings.notifications.push")}</span>
                        </div>
                        <Toggle
                          checked={notificationSettings.classReminders.spotAvailable.push}
                          onChange={(checked) => handleUpdateSpotAvailable("push", checked)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      // ---- GENERAL NOTIFICATIONS ----
      case "general-notifications":
        return (
          <div className="space-y-6 max-w-xl">
            <div className="hidden lg:block">
              <h3 className="text-lg font-semibold text-content-primary mb-1">{t("settings.notifications.generalTitle")}</h3>
              <p className="text-sm text-content-faint">{t("settings.notifications.generalSubtitle")}</p>
            </div>

            <p className="text-xs text-content-muted bg-surface-card rounded-xl px-4 py-3 border border-border">
              {t("settings.notifications.generalHint")}
            </p>

            {/* Bulletin Board */}
            <div className="bg-surface-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClipboardList size={16} className="text-content-muted" />
                  <div>
                    <p className="text-sm font-medium text-content-primary">{t("settings.notifications.bulletinBoard")}</p>
                    <p className="text-xs text-content-faint">{t("settings.notifications.bulletinBoardDesc")}</p>
                  </div>
                </div>
                <Toggle
                  checked={notificationSettings.bulletinBoard.enabled}
                  onChange={(checked) => handleUpdateGeneralNotification("bulletinBoard", "enabled", checked)}
                />
              </div>
            </div>

            {/* Studio Broadcast */}
            <div className="bg-surface-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IoIosMegaphone size={16} className="text-content-muted" />
                  <div>
                    <p className="text-sm font-medium text-content-primary">{t("settings.notifications.studioBroadcast")}</p>
                    <p className="text-xs text-content-faint">{t("settings.notifications.studioBroadcastDesc")}</p>
                  </div>
                </div>
                <Toggle
                  checked={notificationSettings.studioMessages.enabled}
                  onChange={(checked) => handleUpdateGeneralNotification("studioMessages", "enabled", checked)}
                />
              </div>
            </div>
          </div>
        )

      // ---- IMPRINT ----
      case "imprint":
        return (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-content-primary mb-3 hidden lg:block">{t("settings.nav.imprint")}</h3>
            <div className="w-full bg-white rounded-xl px-4 py-3 text-gray-900 text-sm border border-border select-none overflow-y-auto whitespace-pre-wrap min-h-[calc(100vh-14rem)]">
              {generalSettings.imprint}
            </div>
          </div>
        )

      // ---- PRIVACY POLICY ----
      case "privacy-policy":
        return (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-content-primary mb-3 hidden lg:block">{t("settings.nav.privacyPolicy")}</h3>
            <div className="w-full bg-white rounded-xl px-4 py-3 text-gray-900 text-sm border border-border select-none overflow-y-auto whitespace-pre-wrap min-h-[calc(100vh-14rem)]">
              {generalSettings.privacyPolicy}
            </div>
          </div>
        )

      // ---- LOGOUT ----
      case "logout":
        return (
          <div className="space-y-6 max-w-xl">
            <div className="hidden lg:block">
              <h3 className="text-lg font-semibold text-content-primary mb-1">{t("common.logout")}</h3>
              <p className="text-sm text-content-faint">{t("settings.logout.subtitle")}</p>
            </div>
            <div className="bg-surface-hover rounded-xl p-5">
              <p className="text-sm text-content-secondary mb-4">
                {t("settings.logout.description")}
              </p>
              <button
                onClick={() => { haptic.light(); setShowLogoutConfirm(true) }}
                className="w-full sm:w-auto px-6 py-2.5 bg-surface-button hover:bg-surface-button-hover text-content-primary rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t("settings.logout.signOut")}
              </button>
            </div>
          </div>
        )

      // ---- DELETE ACCOUNT ----
      case "delete-account":
        return (
          <div className="space-y-6 max-w-xl">
            <div className="hidden lg:block">
              <h3 className="text-lg font-semibold text-red-400 mb-1">{t("settings.deleteAccount.title")}</h3>
              <p className="text-sm text-content-faint">{t("settings.deleteAccount.subtitle")}</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400 mb-1">{t("settings.deleteAccount.cannotUndo")}</p>
                  <p className="text-xs text-content-muted">
                    {t("settings.deleteAccount.warning")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { haptic.light(); setShowDeleteConfirm(true) }}
                className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t("settings.deleteAccount.deleteMyAccount")}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ============================================
  // Main Render — matches configuration.jsx layout
  // ============================================
  return (
    <div className="flex flex-col lg:flex-row h-full bg-surface-base text-content-primary overflow-hidden rounded-t-2xl lg:rounded-3xl select-none relative">
      {/* Sidebar Navigation - Desktop */}
      <div className="hidden lg:flex lg:w-72 flex-shrink-0 border-r border-border bg-surface-card flex-col min-h-0">
        {/* Search */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("settings.search.placeholder")}
              className="w-full bg-surface-card text-content-primary rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-content-faint hover:text-content-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2 min-h-0" style={{ overscrollBehavior: 'contain' }}>
          {filteredNavItems.map((category) => {
            const categoryMatches = matchesSearch(t(category.labelKey))

            return (
              <div key={category.id} className="mb-1">
                <button
                  onClick={() => {
                    toggleCategory(category.id)
                    if (category.sections.length > 0) {
                      navigateToSection(category.id, category.sections[0].id)
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    activeCategory === category.id
                      ? "bg-surface-button text-content-primary"
                      : categoryMatches
                        ? "bg-primary/10 text-orange-300 hover:bg-primary/20"
                        : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
                  }`}
                >
                  <category.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{t(category.labelKey)}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      expandedCategories.includes(category.id) ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedCategories.includes(category.id) && (
                  <div className="ml-8 mt-1 space-y-0.5">
                    {category.sections.map((section) => {
                      const sectionMatches = matchesSearch(t(section.labelKey))

                      return (
                        <button
                          key={section.id}
                          onClick={() => navigateToSection(category.id, section.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeSection === section.id
                              ? "text-primary bg-primary/10"
                              : sectionMatches
                                ? "text-orange-300 bg-primary/10 hover:bg-primary/20"
                                : "text-content-faint hover:text-content-primary hover:bg-surface-hover"
                          }`}
                        >
                          {t(section.labelKey)}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Navigation List */}
      <div
        className={`lg:hidden absolute inset-0 flex flex-col bg-surface-base z-20 ${mobileShowContent ? "hidden" : "flex"}`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-bold">{t("nav.settings")}</h1>
        </div>

        {/* Mobile Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("settings.search.placeholder")}
              className="w-full bg-surface-card text-content-primary rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-content-faint hover:text-content-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2" style={{ overscrollBehavior: 'contain' }}>
          {filteredNavItems.map((category) => {
            const categoryMatches = matchesSearch(t(category.labelKey))

            return (
              <div key={category.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                    activeCategory === category.id
                      ? "bg-surface-button text-content-primary"
                      : categoryMatches
                        ? "bg-primary/10 text-orange-300"
                        : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
                  }`}
                >
                  <category.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{t(category.labelKey)}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      expandedCategories.includes(category.id) ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedCategories.includes(category.id) && (
                  <div className="ml-8 mt-1 space-y-0.5">
                    {category.sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => navigateToSection(category.id, section.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                          matchesSearch(t(section.labelKey))
                            ? "text-orange-300 bg-primary/10"
                            : "text-content-faint hover:text-content-primary hover:bg-surface-hover"
                        }`}
                      >
                        <span>{t(section.labelKey)}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Spacer for bottom bar */}
        <div className="flex-shrink-0 bg-surface-base" style={{ height: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }} />
      </div>

      {/* Mobile Content View - fixed fullscreen below dashboard header */}
      {mobileShowContent && (
        <div
          className="lg:hidden absolute inset-0 flex flex-col bg-surface-base z-30"
        >
          {/* Mobile Content Header with Back Button - always visible */}
          <div className="flex items-center gap-3 p-4 border-b border-border flex-shrink-0">
            <button
              onClick={() => { haptic.light(); setMobileShowContent(false) }}
              className="p-2 -ml-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold truncate">{getCurrentSectionTitle()}</h1>
          </div>

          {/* Mobile Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4" style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
            {renderSectionContent()}
            <KeyboardSpacer />
          </div>

          {/* Spacer for bottom bar — collapses when keyboard opens */}
          {!keyboardOpen && (
            <div className="flex-shrink-0 bg-surface-base" style={{ height: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }} />
          )}
        </div>
      )}

      {/* Desktop Main Content */}
      <div className="hidden lg:flex flex-1 flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h1 className="text-2xl font-bold">{t("nav.settings")}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6" style={{ overscrollBehavior: 'contain' }}>
          <div>{renderSectionContent()}</div>
        </div>
      </div>

      {/* ============================================ */}
      {/* Logout Confirmation                          */}
      {/* ============================================ */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-surface-card rounded-xl p-5 w-full max-w-sm shadow-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 text-content-muted" />
              </div>
              <div>
                <h4 className="text-content-primary font-semibold">{t("settings.logout.signOutQuestion")}</h4>
                <p className="text-xs text-content-faint">{t("settings.logout.signInAgain")}</p>
              </div>
            </div>
            <p className="text-sm text-content-muted mb-5">
              {t("settings.logout.confirmQuestion")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { haptic.light(); setShowLogoutConfirm(false) }}
                className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover text-content-primary text-sm rounded-xl transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t("settings.logout.signOut")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* Delete Account Confirmation                  */}
      {/* ============================================ */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-surface-card rounded-xl p-5 w-full max-w-sm shadow-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="text-red-400 font-semibold">{t("settings.deleteAccount.title")}</h4>
                <p className="text-xs text-content-faint">{t("settings.deleteAccount.cannotBeUndone")}</p>
              </div>
            </div>
            <p className="text-sm text-content-muted mb-4">
              {t("settings.deleteAccount.confirmDesc")} <span className="font-semibold text-content-primary">DELETE</span>
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={t("settings.deleteAccount.confirmPlaceholder")}
              className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-border focus:border-red-500 outline-none mb-5 placeholder:text-content-faint"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { haptic.light(); setShowDeleteConfirm(false); setDeleteConfirmText("") }}
                className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover text-content-primary text-sm rounded-xl transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE"}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-600/30 disabled:text-white/40 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
