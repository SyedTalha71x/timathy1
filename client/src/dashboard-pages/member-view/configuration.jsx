/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import { Input, Button, notification, Tabs, Collapse, InputNumber, Switch } from "antd"
import { SaveOutlined, EyeInvisibleOutlined, EyeTwoTone, ClockCircleOutlined } from "@ant-design/icons"

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
      emailReminder: {
        enabled: true,
        timeBeforeHours: 24,
      },
      smsReminder: {
        enabled: true,
        timeBeforeHours: 2,
      },
      pushReminder: {
        enabled: true,
        timeBeforeMinutes: 30,
      },
    },
  })

  const [generalSettings, setGeneralSettings] = useState({
    imprint: `Company Name: My Studio
Address: 123 Main Street, City, State 12345
Phone: +1 (555) 123-4567
Email: legal@mystudio.com
Registration Number: 12345678
Tax ID: TAX123456789

Managing Director: John Doe
Court of Registration: Local District Court
Registration Number: HRB 123456`,
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

Last updated: January 2025`,
  })

  const handleUpdateAccountLogin = (field, value) => {
    setAccountSettings({
      ...accountSettings,
      [field]: value,
    })
  }

  const handleRequestEmailChange = () => {
    if (!accountSettings.newEmail) {
      notification.error({
        message: "Missing Email",
        description: "Please enter a new email address.",
      })
      return
    }

    if (!accountSettings.currentPassword) {
      notification.error({
        message: "Password Required",
        description: "Please enter your current password to confirm the change.",
      })
      return
    }

    notification.success({
      message: "Email Change Requested",
      description:
        "A confirmation email has been sent to your new email address. Please check your inbox and follow the instructions to complete the change.",
    })

    setAccountSettings({
      ...accountSettings,
      newEmail: "",
      currentPassword: "",
    })
  }

  const handleRequestPasswordChange = () => {
    const { currentPassword, newPassword, confirmPassword } = accountSettings

    if (!currentPassword || !newPassword || !confirmPassword) {
      notification.error({
        message: "Missing Fields",
        description: "Please fill in all password fields.",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      notification.error({
        message: "Password Mismatch",
        description: "New password and confirm password do not match.",
      })
      return
    }

    if (newPassword.length < 8) {
      notification.error({
        message: "Weak Password",
        description: "Password must be at least 8 characters long.",
      })
      return
    }

    notification.success({
      message: "Password Change Requested",
      description:
        "A confirmation email has been sent to your email address. Please check your inbox and follow the instructions to complete the password change.",
    })

    setAccountSettings({
      ...accountSettings,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleSaveSettings = () => {
    notification.success({
      message: "Settings Saved",
      description: "Your settings have been successfully updated.",
    })
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

  return (
    <div className="w-full mx-auto lg:p-10 p-5 rounded-3xl space-y-8 bg-[#181818] min-h-screen text-white">
      <h1 className="text-white oxanium_font text-xl md:text-2xl">Settings</h1>

      <Tabs defaultActiveKey="1" style={{ color: "white" }}>
        <TabPane tab={<span className="flex items-center gap-2">Account</span>} key="1">
          <Collapse defaultActiveKey={["1", "2"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Change Email Address" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">New Email Address</label>
                  <Input
                    value={accountSettings.newEmail}
                    onChange={(e) => handleUpdateAccountLogin("newEmail", e.target.value)}
                    style={inputStyle}
                    placeholder="Enter new email address"
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Current Password (for confirmation)</label>
                  <Password
                    value={accountSettings.currentPassword}
                    onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)}
                    style={inputStyle}
                    placeholder="Enter current password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className="white-text"
                  />
                </div>
                <Button onClick={handleRequestEmailChange} style={requestButtonStyle}>
                  Request Email Change
                </Button>
                <p className="text-gray-400 text-sm">
                  A confirmation email will be sent to your new email address to complete the change.
                </p>
              </div>
            </Panel>

            <Panel header="Change Password" key="2" className="bg-[#202020]">
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Current Password</label>
                  <Password
                    value={accountSettings.currentPassword}
                    onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)}
                    style={inputStyle}
                    placeholder="Enter current password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className="white-text" />
                </div>
                <div>
                  <label className="block text-white mb-2">New Password</label>
                  <Password
                    value={accountSettings.newPassword}
                    onChange={(e) => handleUpdateAccountLogin("newPassword", e.target.value)}
                    style={inputStyle}
                    placeholder="Enter new password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className="white-text"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Confirm New Password</label>
                  <Password
                    value={accountSettings.confirmPassword}
                    onChange={(e) => handleUpdateAccountLogin("confirmPassword", e.target.value)}
                    style={inputStyle}
                    placeholder="Confirm new password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className="white-text"
                  />
                </div>
                <Button onClick={handleRequestPasswordChange} style={requestButtonStyle}>
                  Request Password Change
                </Button>
                <p className="text-gray-400 text-sm">
                  A confirmation email will be sent to complete the password change.
                </p>
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        <TabPane tab={<span className="flex items-center gap-2">Notifications</span>} key="2">
          <Collapse defaultActiveKey={["1", "2"]} className="bg-[#181818] border-[#303030]">
            <Panel
              header={
                <span className="flex items-center gap-2">
                  <ClockCircleOutlined />
                  Appointment Reminders
                </span>
              }
              key="1"
              className="bg-[#202020]"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Enable Appointment Reminders</label>
                  <Switch
                    checked={notificationSettings.appointmentReminders.enabled}
                    onChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        appointmentReminders: {
                          ...notificationSettings.appointmentReminders,
                          enabled: checked,
                        },
                      })
                    }
                  />
                </div>

                {notificationSettings.appointmentReminders.enabled && (
                  <div className="space-y-4 ml-6 border-l-2 border-[#303030] pl-6">
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Email Reminders</h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Switch
                          checked={notificationSettings.appointmentReminders.emailReminder.enabled}
                          onChange={(checked) => handleUpdateReminderSettings("emailReminder", "enabled", checked)}
                        />
                        <span className="text-white">Send email reminder</span>
                        <InputNumber
                          value={notificationSettings.appointmentReminders.emailReminder.timeBeforeHours}
                          onChange={(value) => handleUpdateReminderSettings("emailReminder", "timeBeforeHours", value)}
                          style={inputStyle}
                          min={1}
                          max={168}
                          disabled={!notificationSettings.appointmentReminders.emailReminder.enabled}
                          className="white-text"
                        />
                        <span className="text-gray-400">hours before</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Push Notifications</h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Switch
                          checked={notificationSettings.appointmentReminders.pushReminder.enabled}
                          onChange={(checked) => handleUpdateReminderSettings("pushReminder", "enabled", checked)}
                        />
                        <span className="text-white">Send push notification</span>
                        <InputNumber
                          value={notificationSettings.appointmentReminders.pushReminder.timeBeforeMinutes}
                          onChange={(value) => handleUpdateReminderSettings("pushReminder", "timeBeforeMinutes", value)}
                          className="white-text"
                          style={inputStyle}
                          min={5}
                          max={1440}
                          disabled={!notificationSettings.appointmentReminders.pushReminder.enabled}
                        />
                        <span className="text-gray-400">minutes before</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        <TabPane tab="General" key="3">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Legal Information" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">
                    Imprint
                  </label>
                  <TextArea
                    value={generalSettings.imprint}
                    rows={10}
                    style={readOnlyStyle}
                    readOnly
                    placeholder="Imprint information is read-only"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">
                    Privacy Policy
                  </label>
                  <TextArea
                    value={generalSettings.privacyPolicy}
                    rows={12}
                    style={readOnlyStyle}
                    readOnly
                    placeholder="Privacy policy is read-only"
                  />
                </div>
              </div>
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>

      {/* <div className="flex justify-end mt-6">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveSettings}
          size="large"
          style={requestButtonStyle}
        >
          Save Settings
        </Button>
      </div> */}

      <style jsx global>{`
        /* Ant Design Component Overrides */
        .ant-collapse {
          background-color: #181818 !important;
          border-color: #303030 !important;
        }

        .ant-collapse-header {
          color: white !important;
          background-color: #202020 !important;
          padding: 12px 16px !important;
          font-weight: 500 !important;
        }

        .ant-collapse-content {
          background-color: #181818 !important;
          border-color: #303030 !important;
        }

        .ant-collapse-item {
          border-color: #303030 !important;
          margin-bottom: 8px !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }

        .ant-collapse-arrow {
          color: white !important;
        }

        .ant-tabs-tab {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .ant-tabs-tab-active {
          color: white !important;
        }

        .ant-tabs-ink-bar {
          background: #FF843E !important;
        }

        .ant-switch {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }

        .ant-switch-checked {
          background-color: #FF843E !important;
        }

        .ant-input-number {
          background-color: #101010 !important;
          border: none !important;
          color: white !important;
        }

        .ant-input-number-handler-wrap {
          background-color: #181818 !important;
          border-left: 1px solid #303030 !important;
        }

        .ant-input-number-handler-up-inner,
        .ant-input-number-handler-down-inner {
          color: white !important;
        }

        .ant-input-password {
          background-color: #101010 !important;
          border: none !important;
          color: white !important;
        }

        .ant-input-password .ant-input {
          background-color: #101010 !important;
          color: white !important;
        }

        .ant-input-password .ant-input-suffix {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        .ant-divider {
          border-color: #303030 !important;
        }

        ::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .ant-notification {
          background-color: #101010 !important;
          border: 1px solid #303030 !important;
        }

        .ant-notification-notice {
          background-color: #101010 !important;
        }

        .ant-notification-notice-message {
          color: white !important;
        }

        .ant-notification-notice-description {
          color: rgba(255, 255, 255, 0.7) !important;
        }
      `}</style>
    </div>
  )
}

export default SettingsPage