/* eslint-disable react/no-unknown-property */
import { useState } from "react"
import {
  Input,
  Button,
  notification,
  Switch,
  Tabs,
  Collapse,
  Divider,
  InputNumber,
} from "antd"
import {
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MessageOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"

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

const saveButtonStyle = {
  backgroundColor: "#FF843E",
  border: "1px solid #303030",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s",
  outline: "none",
  fontSize: "14px",
  fontWeight: "500",
}

const SettingsPage = () => {
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    contactData: {
      companyName: "My Studio",
      address: "123 Main Street, City, State 12345",
      phone: "+1 (555) 123-4567",
      email: "contact@mystudio.com",
      website: "https://www.mystudio.com",
    },
    accountLogin: {
      email: "admin@mystudio.com",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Notification settings
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

  // General settings
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

  const handleUpdateContactData = (field, value) => {
    setAccountSettings({
      ...accountSettings,
      contactData: { ...accountSettings.contactData, [field]: value },
    })
  }

  const handleUpdateAccountLogin = (field, value) => {
    setAccountSettings({
      ...accountSettings,
      accountLogin: { ...accountSettings.accountLogin, [field]: value },
    })
  }

  const handleChangePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = accountSettings.accountLogin

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
      message: "Password Changed",
      description: "Your password has been successfully updated.",
    })

    setAccountSettings({
      ...accountSettings,
      accountLogin: {
        ...accountSettings.accountLogin,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    })
  }

  const handleUpdateNotificationSettings = (category, field, value) => {
    setNotificationSettings({
      ...notificationSettings,
      [category]: { ...notificationSettings[category], [field]: value },
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

  const handleUpdateGeneralSettings = (field, value) => {
    setGeneralSettings({ ...generalSettings, [field]: value })
  }

  const handleSaveSettings = () => {
    notification.success({ 
      message: "Settings Saved", 
      description: "Your settings have been successfully updated." 
    })
  }

  return (
    <div className="w-full mx-auto lg:p-10 p-5 rounded-3xl space-y-8 bg-[#181818] min-h-screen text-white">
      <h1 className="lg:text-3xl text-2xl font-bold">Settings</h1>

      <Tabs defaultActiveKey="1" style={{ color: "white" }}>
        {/* Account Settings Tab */}
        <TabPane tab={
          <span className="flex items-center gap-2">
            Account
          </span>
        } key="1">
          <Collapse defaultActiveKey={["1", "2"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Contact Details" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-white mb-2">Company Name</label>
                    <Input
                      value={accountSettings.contactData.companyName}
                      onChange={(e) => handleUpdateContactData("companyName", e.target.value)}
                      style={inputStyle}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Address</label>
                    <TextArea
                      value={accountSettings.contactData.address}
                      onChange={(e) => handleUpdateContactData("address", e.target.value)}
                      rows={3}
                      style={inputStyle}
                      placeholder="Company Address"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Phone</label>
                    <Input
                      value={accountSettings.contactData.phone}
                      onChange={(e) => handleUpdateContactData("phone", e.target.value)}
                      style={inputStyle}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Email</label>
                    <Input
                      value={accountSettings.contactData.email}
                      onChange={(e) => handleUpdateContactData("email", e.target.value)}
                      style={inputStyle}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Website</label>
                    <Input
                      value={accountSettings.contactData.website}
                      onChange={(e) => handleUpdateContactData("website", e.target.value)}
                      style={inputStyle}
                      placeholder="https://www.company.com"
                    />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel header="Account Management" key="2" className="bg-[#202020]">
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Account Email</label>
                  <Input
                    value={accountSettings.accountLogin.email}
                    onChange={(e) => handleUpdateAccountLogin("email", e.target.value)}
                    style={inputStyle}
                    placeholder="admin@company.com"
                  />
                </div>
                <Divider style={{ borderColor: "#303030" }} />
                <h4 className="text-white font-medium mb-4">Change Password</h4>
                <div>
                  <label className="block text-white mb-2">Current Password</label>
                  <Password
                    value={accountSettings.accountLogin.currentPassword}
                    onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)}
                    style={inputStyle}
                    placeholder="Enter current password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">New Password</label>
                  <Password
                    value={accountSettings.accountLogin.newPassword}
                    onChange={(e) => handleUpdateAccountLogin("newPassword", e.target.value)}
                    style={inputStyle}
                    placeholder="Enter new password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Confirm New Password</label>
                  <Password
                    value={accountSettings.accountLogin.confirmPassword}
                    onChange={(e) => handleUpdateAccountLogin("confirmPassword", e.target.value)}
                    style={inputStyle}
                    placeholder="Confirm new password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </div>
                <Button onClick={handleChangePassword} style={saveButtonStyle}>
                  Change Password
                </Button>
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        {/* Notifications Tab */}
        <TabPane tab={
          <span className="flex items-center gap-2">
            Notifications
          </span>
        } key="2">
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
                          onChange={(checked) =>
                            handleUpdateReminderSettings("emailReminder", "enabled", checked)
                          }
                        />
                        <span className="text-white">Send email reminder</span>
                        <InputNumber
                          value={notificationSettings.appointmentReminders.emailReminder.timeBeforeHours}
                          onChange={(value) =>
                            handleUpdateReminderSettings("emailReminder", "timeBeforeHours", value)
                          }
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
                      <h4 className="text-white font-medium">SMS Reminders</h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Switch
                          checked={notificationSettings.appointmentReminders.smsReminder.enabled}
                          onChange={(checked) =>
                            handleUpdateReminderSettings("smsReminder", "enabled", checked)
                            
                          }
                          className="white-text"

                        />
                        <span className="text-white">Send SMS reminder</span>
                        <InputNumber
                                                  className="white-text"

                          value={notificationSettings.appointmentReminders.smsReminder.timeBeforeHours}
                          onChange={(value) =>
                            handleUpdateReminderSettings("smsReminder", "timeBeforeHours", value)
                          }
                          style={inputStyle}
                          min={1}
                          max={48}
                          disabled={!notificationSettings.appointmentReminders.smsReminder.enabled}
                        />
                        <span className="text-gray-400">hours before</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Push Notifications</h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Switch
                          checked={notificationSettings.appointmentReminders.pushReminder.enabled}
                          onChange={(checked) =>
                            handleUpdateReminderSettings("pushReminder", "enabled", checked)
                          }
                        />
                        <span className="text-white">Send push notification</span>
                        <InputNumber
                          value={notificationSettings.appointmentReminders.pushReminder.timeBeforeMinutes}
                          onChange={(value) =>
                            handleUpdateReminderSettings("pushReminder", "timeBeforeMinutes", value)
                          }
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

            <Panel 
              header={
                <span className="flex items-center gap-2">
                  <MessageOutlined />
                  Notification Preferences
                </span>
              } 
              key="2" 
              className="bg-[#202020]"
            >
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-4">Email Notifications</h4>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.emailNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Switch
                          checked={value}
                          onChange={(checked) =>
                            handleUpdateNotificationSettings("emailNotifications", key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Divider style={{ borderColor: "#303030" }} />

                <div>
                  <h4 className="text-white font-medium mb-4">SMS Notifications</h4>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.smsNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Switch
                          checked={value}
                          onChange={(checked) =>
                            handleUpdateNotificationSettings("smsNotifications", key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                  <TextArea
                    value={generalSettings.imprint}
                    onChange={(e) => handleUpdateGeneralSettings("imprint", e.target.value)}
                    rows={10}
                    style={inputStyle}
                    placeholder="Enter your company's imprint information..."
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    Include your company details, registration information, and legal contact data.
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-2">Privacy Policy</label>
                  <TextArea
                    value={generalSettings.privacyPolicy}
                    onChange={(e) => handleUpdateGeneralSettings("privacyPolicy", e.target.value)}
                    rows={12}
                    style={inputStyle}
                    placeholder="Enter your privacy policy..."
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    Outline how you collect, use, and protect customer data.
                  </div>
                </div>
              </div>
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveSettings}
          size="large"
          style={saveButtonStyle}
        >
          Save Settings
        </Button>
      </div>

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