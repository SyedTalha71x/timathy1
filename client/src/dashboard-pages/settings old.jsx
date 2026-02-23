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
