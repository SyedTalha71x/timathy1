/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { Input, Button, notification, Tabs, Collapse, InputNumber, Switch } from "antd"
import { SaveOutlined, EyeInvisibleOutlined, EyeTwoTone, ClockCircleOutlined } from "@ant-design/icons"
import { useSelector, useDispatch } from "react-redux"
import { updateUserData, updatedPassword } from "../../features/auth/authSlice"
import { fetchMyReminder, updateReminders } from "../../features/notification/notificationSlice"
const { TabPane } = Tabs
const { TextArea } = Input
const { Panel } = Collapse
const { Password } = Input

const inputStyle = {
  backgroundColor: "#101010",
  border: "none",
  color: "#fff",
  padding: "10px 12px",
  outline: "none",
}

const readOnlyStyle = {
  backgroundColor: "#0a0a0a",
  border: "1px solid #303030",
  color: "#ccc",
  padding: "10px 12px",
  outline: "none",
  cursor: "not-allowed",
}

const requestButtonStyle = {
  backgroundColor: "#E67E22", // darker orange
  border: "1px solid #303030",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s",
  outline: "none",
  fontSize: "14px",
  fontWeight: "500",
  marginLeft: "10px",
}

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { studio, loading } = useSelector((state) => state.studios)
  const { appointments } = useSelector((state) => state.appointments)
  const { appointmentReminders } = useSelector((state) => state.reminder)

  const [accountSettings, setAccountSettings] = useState({
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newBookings: true,
      cancellations: true,
      reminders: true,
      payments: true,
    },
    smsNotifications: {
      newBookings: false,
      cancellations: true,
      reminders: true,
      payments: false,
    },
    appointmentReminders: {
      enabled: true,
      emailReminder: { enabled: true, timeBeforeHours: 24 },
      smsReminder: { enabled: true, timeBeforeHours: 2 },
      pushReminder: { enabled: true, timeBeforeMinutes: 30 },
    },
  })

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

Last updated: ${new Date(studio.updatedAt).toDateString()}`,
  })

  // Local state for reminders
  const [localReminders, setLocalReminders] = useState({})

  useEffect(() => {
    if (!appointments?.length) return; // no appointments, skip

    const initial = {};
    appointments.forEach(a => {
      const r = appointmentReminders?.find(rem => rem.appointmentId === a._id); // safe even if reminder is undefined
      initial[a._id] = {
        emailReminder: {
          enabled: r?.emailReminder?.enabled ?? true,
          timeBeforeHours: r?.emailReminder?.timeBeforeHours ?? 24,
        },
        smsReminder: {
          enabled: r?.smsReminder?.enabled ?? true,
          timeBeforeHours: r?.smsReminder?.timeBeforeHours ?? 2,
        },
        pushReminder: {
          enabled: r?.pushReminder?.enabled ?? true,
          timeBeforeMinutes: r?.pushReminder?.timeBeforeMinutes ?? 30,
        },
      };
    });
    setLocalReminders(initial);
  }, [appointments, appointmentReminders]);
  const handleUpdateAccountLogin = (field, value) => {
    setAccountSettings({ ...accountSettings, [field]: value })
  }

  const handleRequestEmailChange = async () => {
    const { newEmail, currentPassword } = accountSettings
    if (!newEmail) return notification.error({ message: "Missing Email", description: "Please enter a new email address." })
    if (!currentPassword) return notification.error({ message: "Password Required", description: "Please enter your current password to confirm the change." })

    try {
      await dispatch(updateUserData({ email: newEmail, currentPassword })).unwrap()
      notification.success({ message: "Email Change Requested", description: "A confirmation email has been sent to your new email address. Please check your inbox to complete the change." })
      setAccountSettings({ ...accountSettings, newEmail: "", currentPassword: "" })
    } catch (err) {
      notification.error({ message: "Email Change Failed", description: err.message || "Something went wrong while changing your email." })
    }
  }

  const handleRequestPasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = accountSettings
    if (!currentPassword || !newPassword || !confirmPassword) return notification.error({ message: "Missing Fields", description: "Please fill in all password fields." })
    if (newPassword !== confirmPassword) return notification.error({ message: "Password Mismatch", description: "New password and confirm password do not match." })
    if (newPassword.length < 8) return notification.error({ message: "Weak Password", description: "Password must be at least 8 characters long." })

    try {
      await dispatch(updatedPassword({ oldPassword: currentPassword, newPassword })).unwrap()
      notification.success({ message: "Password Changed", description: "Your password has been updated successfully. A confirmation email has been sent to your email address." })
      setAccountSettings({ ...accountSettings, currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      notification.error({ message: "Password Change Failed", description: err.message || "Something went wrong while changing your password." })
    }
  }

  const handleLocalReminderChange = (appointmentId, type, field, value) => {
    setLocalReminders(prev => ({
      ...prev,
      [appointmentId]: {
        ...prev[appointmentId],
        [type]: {
          ...prev[appointmentId][type],
          [field]: value,
        },
      },
    }))
  }

  const handleSaveSettings = () => {
    notification.success({ message: "Settings Saved", description: "Your settings have been successfully updated." })
  }

  return (
    <div className="w-full mx-auto lg:p-10 p-5 rounded-3xl space-y-8 bg-[#181818] min-h-screen text-white">
      <h1 className="text-white oxanium_font text-xl md:text-2xl">Settings</h1>

      <Tabs defaultActiveKey="1" style={{ color: "white" }}>
        {/* Account Tab */}
        <TabPane tab={<span className="flex items-center gap-2">Account</span>} key="1">
          <Collapse defaultActiveKey={["1", "2"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Change Email Address" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">New Email Address</label>
                  <Input value={accountSettings.newEmail} onChange={(e) => handleUpdateAccountLogin("newEmail", e.target.value)} style={inputStyle} placeholder="Enter new email address" type="email" />
                </div>
                <div>
                  <label className="block text-white mb-2">Current Password (for confirmation)</label>
                  <Password value={accountSettings.currentPassword} onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)} style={inputStyle} placeholder="Enter current password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} className="white-text" />
                </div>
                <Button onClick={handleRequestEmailChange} style={requestButtonStyle}>Request Email Change</Button>
                <p className="text-gray-400 text-sm">A confirmation email will be sent to your new email address to complete the change.</p>
              </div>
            </Panel>

            <Panel header="Change Password" key="2" className="bg-[#202020]">
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Current Password</label>
                  <Password value={accountSettings.currentPassword} onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)} style={inputStyle} placeholder="Enter current password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} className="white-text" />
                </div>
                <div>
                  <label className="block text-white mb-2">New Password</label>
                  <Password value={accountSettings.newPassword} onChange={(e) => handleUpdateAccountLogin("newPassword", e.target.value)} style={inputStyle} placeholder="Enter new password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} className="white-text" />
                </div>
                <div>
                  <label className="block text-white mb-2">Confirm New Password</label>
                  <Password value={accountSettings.confirmPassword} onChange={(e) => handleUpdateAccountLogin("confirmPassword", e.target.value)} style={inputStyle} placeholder="Confirm new password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} className="white-text" />
                </div>
                <Button onClick={handleRequestPasswordChange} style={requestButtonStyle}>Request Password Change</Button>
                <p className="text-gray-400 text-sm">A confirmation email will be sent to complete the password change.</p>
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        {/* Notifications Tab */}
        <TabPane tab={<span className="flex items-center gap-2">Notifications</span>} key="2">
          <Collapse defaultActiveKey={appointments.map(a => a._id)} className="bg-[#181818] border-[#303030]">
            <Panel header={<span className="flex items-center gap-2"><ClockCircleOutlined />Appointment Reminders</span>} key="1" className="bg-[#202020]">
              {appointments.length === 0 && <p className="text-gray-400">No appointments found.</p>}

              {appointments.map((a) => {
                const r = localReminders[a._id]
                if (!r) return null

                return (
                  <div key={a._id} className="mb-6 border-b border-[#303030] pb-4">
                    <h4 className="text-white font-medium">{a.service.name} - {new Date(a.date).toLocaleDateString()} ({a.timeSlot.start} - {a.timeSlot.end})</h4>

                    {/* Email Reminder */}
                    <div className="flex items-center gap-4 flex-wrap mt-2">
                      <Switch checked={r.emailReminder.enabled} onChange={(checked) => handleLocalReminderChange(a._id, "emailReminder", "enabled", checked)} />
                      <span className="text-white">Send Email Reminder</span>
                      <InputNumber value={r.emailReminder.timeBeforeHours} onChange={(val) => handleLocalReminderChange(a._id, "emailReminder", "timeBeforeHours", val)} style={inputStyle} min={1} max={168} disabled={!r.emailReminder.enabled} />
                      <span className="text-gray-400">hours before</span>
                    </div>

                    {/* SMS Reminder */}
                    <div className="flex items-center gap-4 flex-wrap mt-2">
                      <Switch checked={r.smsReminder.enabled} onChange={(checked) => handleLocalReminderChange(a._id, "smsReminder", "enabled", checked)} />
                      <span className="text-white">Send SMS Reminder</span>
                      <InputNumber value={r.smsReminder.timeBeforeHours} onChange={(val) => handleLocalReminderChange(a._id, "smsReminder", "timeBeforeHours", val)} style={inputStyle} min={1} max={168} disabled={!r.smsReminder.enabled} />
                      <span className="text-gray-400">hours before</span>
                    </div>

                    {/* Push Reminder */}
                    <div className="flex items-center gap-4 flex-wrap mt-2">
                      <Switch checked={r.pushReminder.enabled} onChange={(checked) => handleLocalReminderChange(a._id, "pushReminder", "enabled", checked)} />
                      <span className="text-white">Send Push Notification</span>
                      <InputNumber value={r.pushReminder.timeBeforeMinutes} onChange={(val) => handleLocalReminderChange(a._id, "pushReminder", "timeBeforeMinutes", val)} style={inputStyle} min={5} max={1440} disabled={!r.pushReminder.enabled} />
                      <span className="text-gray-400">minutes before</span>
                    </div>

                    <Button style={{ ...requestButtonStyle, marginTop: "10px" }} onClick={async () => {
                      try {
                        await dispatch(updateReminders({ appointmentId: a._id, reminderData: r })).unwrap()
                        notification.success({ message: "Reminder Updated", description: "Reminder settings saved successfully." })
                      } catch (err) {
                        notification.error({ message: "Update Failed", description: err.message || "Could not save reminder." })
                      }
                    }}>Save Reminder</Button>
                  </div>
                )
              })}
            </Panel>
          </Collapse>
        </TabPane>

        {/* General Tab */}
        <TabPane tab="General" key="3">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Legal Information" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Imprint</label>
                  <TextArea value={generalSettings.imprint} rows={10} style={readOnlyStyle} readOnly placeholder="Imprint information is read-only" />
                </div>
                <div>
                  <label className="block text-white mb-2">Privacy Policy</label>
                  <TextArea value={generalSettings.privacyPolicy} rows={12} style={readOnlyStyle} readOnly placeholder="Privacy policy is read-only" />
                </div>
              </div>
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>

      <style jsx global>{`
        /* Ant Design Component Overrides (unchanged from original) */
        .ant-input-number-input {
          color: white !important; /* fix number text color in dark mode */
        }
        /* all other CSS unchanged */
      `}</style>
    </div>
  )
}


export default SettingsPage
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { updateUserData, updatedPassword } from "../../features/auth/authSlice"
import { notification } from "antd"
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
} from "lucide-react"

// ============================================
// Navigation Items
// ============================================
const NAVIGATION_ITEMS = [
  {
    id: "account",
    label: "Account",
    icon: User,
    sections: [
      { id: "change-email", label: "Change Email" },
      { id: "change-password", label: "Change Password" },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    sections: [
      { id: "appointment-reminders", label: "Appointment Reminders" },
    ],
  },
  {
    id: "general",
    label: "General",
    icon: FileText,
    sections: [
      { id: "legal-info", label: "Legal Information" },
    ],
  },
]

const SettingsPage = () => {
  const dispatch = useDispatch()
  const { studio, loading } = useSelector((state) => state.studios)

  // Navigation state
  const [activeCategory, setActiveCategory] = useState("account")
  const [activeSection, setActiveSection] = useState("change-email")
  const [expandedCategories, setExpandedCategories] = useState(["account"])
  const [mobileShowContent, setMobileShowContent] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
  const [notificationSettings, setNotificationSettings] = useState({
    appointmentReminders: {
      enabled: true,
      emailReminder: { enabled: true, timeBeforeHours: 24 },
      smsReminder: { enabled: true, timeBeforeHours: 2 },
      pushReminder: { enabled: true, timeBeforeMinutes: 30 },
    },
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
      return notification.error({ message: "Missing Email", description: "Please enter a new email address." })
    }
    if (!currentPassword) {
      return notification.error({ message: "Password Required", description: "Please enter your current password to confirm the change." })
    }
    try {
      await dispatch(updateUserData({ email: newEmail, currentPassword })).unwrap()
      notification.success({ message: "Email Change Requested", description: "A confirmation email has been sent to your new email address." })
      setAccountSettings({ ...accountSettings, newEmail: "", currentPassword: "" })
    } catch (err) {
      notification.error({ message: "Email Change Failed", description: err.message || "Something went wrong." })
    }
  }

  const handleRequestPasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = accountSettings
    if (!currentPassword || !newPassword || !confirmPassword) {
      return notification.error({ message: "Missing Fields", description: "Please fill in all password fields." })
    }
    if (newPassword !== confirmPassword) {
      return notification.error({ message: "Password Mismatch", description: "New password and confirm password do not match." })
    }
    if (newPassword.length < 8) {
      return notification.error({ message: "Weak Password", description: "Password must be at least 8 characters long." })
    }
    try {
      await dispatch(updatedPassword({ oldPassword: currentPassword, newPassword })).unwrap()
      notification.success({ message: "Password Changed", description: "Your password has been updated successfully." })
      setAccountSettings({ ...accountSettings, currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      notification.error({ message: "Password Change Failed", description: err.message || "Something went wrong." })
    }
  }

  const handleUpdateReminderSettings = (reminderType, field, value) => {
    setNotificationSettings({
      ...notificationSettings,
      appointmentReminders: {
        ...notificationSettings.appointmentReminders,
        [reminderType]: {
          ...notificationSettings.appointmentReminders[reminderType],
          [field]: value,
        },
      },
    })
  }

  // ============================================
  // Navigation Helpers
  // ============================================
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
    setActiveCategory(categoryId)
  }

  const navigateToSection = (categoryId, sectionId) => {
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
        if (section.id === activeSection) return section.label
      }
    }
    return "Settings"
  }

  const matchesSearch = (text) => {
    if (!searchQuery) return false
    return text.toLowerCase().includes(searchQuery.toLowerCase())
  }

  const filteredNavItems = searchQuery
    ? NAVIGATION_ITEMS.filter(
        (cat) => matchesSearch(cat.label) || cat.sections.some((s) => matchesSearch(s.label))
      )
    : NAVIGATION_ITEMS

  // ============================================
  // Toggle Component
  // ============================================
  const Toggle = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${checked ? "bg-primary" : "bg-surface-button"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
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
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-1">Change Email Address</h3>
              <p className="text-sm text-content-faint">A confirmation email will be sent to your new email address to complete the change.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-content-secondary block mb-2">New Email Address<span className="text-accent-red ml-1">*</span></label>
                <input
                  type="email"
                  value={accountSettings.newEmail}
                  onChange={(e) => handleUpdateAccountLogin("newEmail", e.target.value)}
                  placeholder="Enter new email address"
                  className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-content-secondary block mb-2">Current Password<span className="text-accent-red ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={accountSettings.currentPassword}
                    onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)}
                    placeholder="Enter current password"
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
                Request Email Change
              </button>
            </div>
          </div>
        )

      // ---- CHANGE PASSWORD ----
      case "change-password":
        return (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-1">Change Password</h3>
              <p className="text-sm text-content-faint">A confirmation email will be sent to complete the password change.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-content-secondary block mb-2">Current Password<span className="text-accent-red ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={accountSettings.currentPassword}
                    onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)}
                    placeholder="Enter current password"
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
                <label className="text-sm text-content-secondary block mb-2">New Password<span className="text-accent-red ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={accountSettings.newPassword}
                    onChange={(e) => handleUpdateAccountLogin("newPassword", e.target.value)}
                    placeholder="Enter new password"
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
                <label className="text-sm text-content-secondary block mb-2">Confirm New Password<span className="text-accent-red ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={accountSettings.confirmPassword}
                    onChange={(e) => handleUpdateAccountLogin("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
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
                Request Password Change
              </button>
            </div>
          </div>
        )

      // ---- APPOINTMENT REMINDERS ----
      case "appointment-reminders":
        return (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-1">Appointment Reminders</h3>
              <p className="text-sm text-content-faint">Configure when and how members receive reminders about their appointments.</p>
            </div>

            <div className="flex items-center justify-between bg-surface-card rounded-xl p-4 border border-border">
              <div>
                <p className="text-sm font-medium text-content-primary">Enable Appointment Reminders</p>
                <p className="text-xs text-content-faint mt-0.5">Send automated reminders before appointments</p>
              </div>
              <Toggle
                checked={notificationSettings.appointmentReminders.enabled}
                onChange={(checked) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    appointmentReminders: { ...notificationSettings.appointmentReminders, enabled: checked },
                  })
                }
              />
            </div>

            {notificationSettings.appointmentReminders.enabled && (
              <div className="space-y-3">
                {/* Email Reminder */}
                <div className="bg-surface-card rounded-xl p-4 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-content-muted" />
                      <p className="text-sm font-medium text-content-primary">Email Reminder</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.appointmentReminders.emailReminder.enabled}
                      onChange={(checked) => handleUpdateReminderSettings("emailReminder", "enabled", checked)}
                    />
                  </div>
                  {notificationSettings.appointmentReminders.emailReminder.enabled && (
                    <div className="flex items-center gap-3 ml-7">
                      <span className="text-xs text-content-muted">Send</span>
                      <input
                        type="number"
                        value={notificationSettings.appointmentReminders.emailReminder.timeBeforeHours}
                        onChange={(e) => handleUpdateReminderSettings("emailReminder", "timeBeforeHours", parseInt(e.target.value) || 1)}
                        min={1}
                        max={168}
                        className="w-20 bg-surface-dark rounded-lg px-3 py-1.5 text-content-primary text-sm outline-none border border-transparent focus:border-primary transition-colors text-center"
                      />
                      <span className="text-xs text-content-muted">hours before</span>
                    </div>
                  )}
                </div>

                {/* Push Reminder */}
                <div className="bg-surface-card rounded-xl p-4 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={16} className="text-content-muted" />
                      <p className="text-sm font-medium text-content-primary">Push Notification</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.appointmentReminders.pushReminder.enabled}
                      onChange={(checked) => handleUpdateReminderSettings("pushReminder", "enabled", checked)}
                    />
                  </div>
                  {notificationSettings.appointmentReminders.pushReminder.enabled && (
                    <div className="flex items-center gap-3 ml-7">
                      <span className="text-xs text-content-muted">Send</span>
                      <input
                        type="number"
                        value={notificationSettings.appointmentReminders.pushReminder.timeBeforeMinutes}
                        onChange={(e) => handleUpdateReminderSettings("pushReminder", "timeBeforeMinutes", parseInt(e.target.value) || 5)}
                        min={5}
                        max={1440}
                        className="w-20 bg-surface-dark rounded-lg px-3 py-1.5 text-content-primary text-sm outline-none border border-transparent focus:border-primary transition-colors text-center"
                      />
                      <span className="text-xs text-content-muted">minutes before</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      // ---- LEGAL INFO ----
      case "legal-info":
        return (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-1">Legal Information</h3>
              <p className="text-sm text-content-faint">These fields are read-only and populated from your studio data.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-content-secondary block mb-2">Imprint</label>
                <div className="w-full bg-white rounded-xl px-4 py-3 text-gray-900 text-sm border border-border select-none max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {generalSettings.imprint}
                </div>
              </div>
              <div>
                <label className="text-sm text-content-secondary block mb-2">Privacy Policy</label>
                <div className="w-full bg-white rounded-xl px-4 py-3 text-gray-900 text-sm border border-border select-none max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {generalSettings.privacyPolicy}
                </div>
              </div>
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
    <div className="flex flex-col lg:flex-row h-full bg-surface-base text-content-primary overflow-hidden rounded-3xl select-none">
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
              placeholder="Search settings..."
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
        <div className="flex-1 overflow-y-auto p-2 min-h-0">
          {filteredNavItems.map((category) => {
            const categoryMatches = matchesSearch(category.label)

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
                  <span className="flex-1 font-medium">{category.label}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      expandedCategories.includes(category.id) ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedCategories.includes(category.id) && (
                  <div className="ml-8 mt-1 space-y-0.5">
                    {category.sections.map((section) => {
                      const sectionMatches = matchesSearch(section.label)

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
                          {section.label}
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
      <div className={`lg:hidden flex flex-col h-full ${mobileShowContent ? "hidden" : "flex"}`}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-bold mb-3">Settings</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
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
        <div className="flex-1 overflow-y-auto p-2">
          {filteredNavItems.map((category) => {
            const categoryMatches = matchesSearch(category.label)

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
                  <span className="flex-1 font-medium">{category.label}</span>
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
                          matchesSearch(section.label)
                            ? "text-orange-300 bg-primary/10"
                            : "text-content-faint hover:text-content-primary hover:bg-surface-hover"
                        }`}
                      >
                        <span>{section.label}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Content View */}
      <div className={`lg:hidden flex flex-col h-full ${mobileShowContent ? "flex" : "hidden"}`}>
        <div className="flex items-center gap-3 p-4 border-b border-border flex-shrink-0">
          <button
            onClick={() => setMobileShowContent(false)}
            className="p-2 -ml-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{getCurrentSectionTitle()}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div>{renderSectionContent()}</div>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="hidden lg:flex flex-1 flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div>{renderSectionContent()}</div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
