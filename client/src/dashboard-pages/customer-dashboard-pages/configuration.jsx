/* eslint-disable react/no-unknown-property */
"use client"

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import {
  Input,
  Select,
  Button,
  ColorPicker,
  Form,
  notification,
  Upload,
  Switch,
  InputNumber,
  Tabs,
  DatePicker,
  Collapse,
  Tooltip,
  Radio,
  Space,
  Divider,
} from "antd"
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  BgColorsOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  BellOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons"

const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input
const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Password } = Input

const inputStyle = {
  backgroundColor: "#101010",
  border: "none",
  color: "#fff",
  padding: "10px 10px",
  outline: "none",
}

const selectStyle = {
  backgroundColor: "#101010",
  border: "none",
  color: "#fff",
}

const buttonStyle = {
  backgroundColor: "#303030",
  borderColor: "#303030",
  color: "#fff",
}

const saveButtonStyle = {
  backgroundColor: "#FF843E",
  borderColor: "#FF843E",
  color: "#fff",
}

const tooltipStyle = {
  color: "#888",
  marginLeft: "8px",
}

const ConfigurationPage = () => {
  const [currency, setCurrency] = useState("€")
  const [language, setLanguage] = useState("en")

  // Opening hours and closing days
  const [closingDays, setClosingDays] = useState([])
  // Other studio settings
  const [logo, setLogo] = useState([])

  const [contractTypes, setContractTypes] = useState([])
  const [contractSections, setContractSections] = useState([
    { title: "Personal Information", content: "", editable: false, requiresAgreement: true },
    { title: "Contract Terms", content: "", editable: false, requiresAgreement: true },
  ])
  const [contractPauseReasons, setContractPauseReasons] = useState([
    { name: "Vacation", maxDays: 30 },
    { name: "Medical", maxDays: 90 },
  ])
  const [additionalDocs, setAdditionalDocs] = useState([])

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "dark",
    primaryColor: "#FF843E",
    secondaryColor: "#1890ff",
    allowUserThemeToggle: true,
  })

  const [generalSettings, setGeneralSettings] = useState({
    imprint: "",
    privacyPolicy: "",
    contactData: {
      companyName: "",
      address: "",
      phone: "",
      email: "",
      website: "",
    },
    accountLogin: {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: {
      enabled: true,
      reminderTimes: [24, 2], // hours before appointment
      emailReminders: true,
      smsReminders: false,
      customMessage: "Don't forget about your upcoming appointment!",
    },
    systemNotifications: {
      newBookings: true,
      cancellations: true,
      payments: true,
      systemUpdates: false,
    },
  })

  // Lead sources
  const [leadSources, setLeadSources] = useState([
    { id: 1, name: "Website", description: "Leads from company website", isActive: true },
    { id: 2, name: "Social Media", description: "Facebook, Instagram, etc.", isActive: true },
    { id: 3, name: "Referral", description: "Word of mouth referrals", isActive: true },
  ])

  const handleAddContractPauseReason = () => {
    setContractPauseReasons([...contractPauseReasons, { name: "", maxDays: 30 }])
  }

  const handleRemoveContractPauseReason = (index) => {
    setContractPauseReasons(contractPauseReasons.filter((_, i) => i !== index))
  }

  const handleAddContractType = () => {
    setContractTypes([
      ...contractTypes,
      {
        name: "",
        duration: 12,
        cost: 0,
        billingPeriod: "monthly",
        maximumMemberCapacity: 0,
      },
    ])
  }

  const handleAddContractSection = () => {
    setContractSections([
      ...contractSections,
      {
        title: "",
        content: "",
        editable: false,
        requiresAgreement: true,
      },
    ])
  }

  const handleUpdateGeneralSettings = (field, value) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdateContactData = (field, value) => {
    setGeneralSettings((prev) => ({
      ...prev,
      contactData: {
        ...prev.contactData,
        [field]: value,
      },
    }))
  }

  const handleUpdateAccountLogin = (field, value) => {
    setGeneralSettings((prev) => ({
      ...prev,
      accountLogin: {
        ...prev.accountLogin,
        [field]: value,
      },
    }))
  }

  const handleUpdateNotificationSettings = (field, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdateAppointmentReminders = (field, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      appointmentReminders: {
        ...prev.appointmentReminders,
        [field]: value,
      },
    }))
  }

  const handleUpdateSystemNotifications = (field, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      systemNotifications: {
        ...prev.systemNotifications,
        [field]: value,
      },
    }))
  }

  const handleAddReminderTime = () => {
    const newTime = 1 // Default 1 hour
    setNotificationSettings((prev) => ({
      ...prev,
      appointmentReminders: {
        ...prev.appointmentReminders,
        reminderTimes: [...prev.appointmentReminders.reminderTimes, newTime],
      },
    }))
  }

  const handleRemoveReminderTime = (index) => {
    setNotificationSettings((prev) => ({
      ...prev,
      appointmentReminders: {
        ...prev.appointmentReminders,
        reminderTimes: prev.appointmentReminders.reminderTimes.filter((_, i) => i !== index),
      },
    }))
  }

  const handleUpdateReminderTime = (index, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      appointmentReminders: {
        ...prev.appointmentReminders,
        reminderTimes: prev.appointmentReminders.reminderTimes.map((time, i) => (i === index ? value : time)),
      },
    }))
  }

  const handleAddLeadSource = () => {
    const newId = Math.max(...leadSources.map((s) => s.id), 0) + 1
    setLeadSources([
      ...leadSources,
      {
        id: newId,
        name: "",
        description: "",
        isActive: true,
      },
    ])
  }

  const handleUpdateLeadSource = (id, field, value) => {
    setLeadSources((prev) => prev.map((source) => (source.id === id ? { ...source, [field]: value } : source)))
  }

  const handleRemoveLeadSource = (id) => {
    setLeadSources((prev) => prev.filter((source) => source.id !== id))
  }

  const handleViewBlankContract = () => {
    notification.info({
      message: "Contract Preview",
      description: "Opening blank contract template...",
    })
  }

  const handleSaveConfiguration = () => {
    notification.success({
      message: "Configuration Saved",
      description: "All settings have been saved successfully!",
    })
  }

  return (
    <div className=" w-full mx-auto lg:p-10 p-5 rounded-3xl space-y-8 bg-[#181818] min-h-screen text-white">
      <h1 className="lg:text-3xl text-2xl font-bold oxanium_font">Admin Panel Configuration</h1>

      <Tabs defaultActiveKey="1" style={{ color: "white" }}>
        <TabPane tab="General" key="1">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Account Settings" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <h4 className="text-white font-medium mb-4">Contact Details</h4>
                  <Form.Item label={<span className="text-white">Company Name</span>}>
                    <Input
                      value={generalSettings.contactData.companyName}
                      onChange={(e) => handleUpdateContactData("companyName", e.target.value)}
                      style={inputStyle}
                      placeholder="Your Company Name"
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Address</span>}>
                    <TextArea
                      value={generalSettings.contactData.address}
                      onChange={(e) => handleUpdateContactData("address", e.target.value)}
                      rows={3}
                      style={inputStyle}
                      placeholder="Company Address"
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Phone</span>}>
                    <Input
                      value={generalSettings.contactData.phone}
                      onChange={(e) => handleUpdateContactData("phone", e.target.value)}
                      style={inputStyle}
                      placeholder="+1 (555) 123-4567"
                      prefix={<PhoneOutlined style={{ color: "#888" }} />}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Email</span>}>
                    <Input
                      value={generalSettings.contactData.email}
                      onChange={(e) => handleUpdateContactData("email", e.target.value)}
                      style={inputStyle}
                      placeholder="contact@company.com"
                      prefix={<MailOutlined style={{ color: "#888" }} />}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Website</span>}>
                    <Input
                      value={generalSettings.contactData.website}
                      onChange={(e) => handleUpdateContactData("website", e.target.value)}
                      style={inputStyle}
                      placeholder="https://www.company.com"
                    />
                  </Form.Item>

                  <Divider style={{ borderColor: "#303030" }} />

                  <h4 className="text-white font-medium mb-4">Change Email Address</h4>
                  <Form.Item label={<span className="text-white">Account Email</span>}>
                    <Input
                      value={generalSettings.accountLogin.email}
                      onChange={(e) => handleUpdateAccountLogin("email", e.target.value)}
                      style={inputStyle}
                      placeholder="admin@company.com"
                      prefix={<MailOutlined style={{ color: "#888" }} />}
                    />
                  </Form.Item>

                  <Divider style={{ borderColor: "#303030" }} />

                  <h4 className="text-white font-medium mb-4">Change Password</h4>
                  <Form.Item label={<span className="text-white">Current Password</span>}>
                    <Password
                      value={generalSettings.accountLogin.currentPassword}
                      onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)}
                      style={inputStyle}
                      placeholder="Enter current password"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">New Password</span>}>
                    <Password
                      value={generalSettings.accountLogin.newPassword}
                      onChange={(e) => handleUpdateAccountLogin("newPassword", e.target.value)}
                      style={inputStyle}
                      placeholder="Enter new password"
                      className="white-text"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Confirm New Password</span>}>
                    <Password
                      value={generalSettings.accountLogin.confirmPassword}
                      onChange={(e) => handleUpdateAccountLogin("confirmPassword", e.target.value)}
                      style={inputStyle}
                      placeholder="Confirm new password"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      className="white-text"
                    />
                  </Form.Item>
                </Form>
              </div>
            </Panel>

            <Panel header="Appointment Reminders & Notifications" key="2" className="bg-[#202020]">
              <div className="space-y-6">
                <Form layout="vertical">
                  <h4 className="text-white font-medium mb-4 flex items-center">
                    <BellOutlined className="mr-2" />
                    Appointment Reminders
                  </h4>

                  <Form.Item label={<span className="text-white">Enable Appointment Reminders</span>}>
                    <Switch
                      checked={notificationSettings.appointmentReminders.enabled}
                      onChange={(checked) => handleUpdateAppointmentReminders("enabled", checked)}
                    />
                  </Form.Item>

                  {notificationSettings.appointmentReminders.enabled && (
                    <>
                      <Form.Item label={<span className="text-white">Reminder Times (hours before appointment)</span>}>
                        <div className="space-y-2">
                          {notificationSettings.appointmentReminders.reminderTimes.map((time, index) => (
                            <div key={index} className="flex white-text items-center gap-2">
                              <InputNumber
                                value={time}
                                onChange={(value) => handleUpdateReminderTime(index, value)}
                                style={inputStyle}
                                min={0.25}
                                step={0.25}
                                placeholder="Hours"
                              />
                              <span className="text-white">hours before</span>
                              <Button
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveReminderTime(index)}
                                style={buttonStyle}
                                className="white-text"
                              />
                            </div>
                          ))}
                          <Button
                            type="dashed"
                            onClick={handleAddReminderTime}
                            icon={<PlusOutlined />}
                            style={buttonStyle}
                          >
                            Add Reminder Time
                          </Button>
                        </div>
                      </Form.Item>

                      <Form.Item label={<span className="text-white">Email Reminders</span>}>
                        <Switch
                          checked={notificationSettings.appointmentReminders.emailReminders}
                          onChange={(checked) => handleUpdateAppointmentReminders("emailReminders", checked)}
                        />
                      </Form.Item>

                      <Form.Item label={<span className="text-white">SMS Reminders</span>}>
                        <Switch
                          checked={notificationSettings.appointmentReminders.smsReminders}
                          onChange={(checked) => handleUpdateAppointmentReminders("smsReminders", checked)}
                        />
                      </Form.Item>

                      <Form.Item label={<span className="text-white">Custom Reminder Message</span>}>
                        <TextArea
                          value={notificationSettings.appointmentReminders.customMessage}
                          onChange={(e) => handleUpdateAppointmentReminders("customMessage", e.target.value)}
                          rows={3}
                          style={inputStyle}
                          placeholder="Enter custom message for appointment reminders..."
                        />
                      </Form.Item>
                    </>
                  )}

                  <Divider style={{ borderColor: "#303030" }} />

                  <h4 className="text-white font-medium mb-4">General Notification Settings</h4>

                  <Form.Item label={<span className="text-white">Email Notifications</span>}>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={(checked) => handleUpdateNotificationSettings("emailNotifications", checked)}
                    />
                  </Form.Item>

                  <Form.Item label={<span className="text-white">SMS Notifications</span>}>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onChange={(checked) => handleUpdateNotificationSettings("smsNotifications", checked)}
                    />
                  </Form.Item>

                  <Form.Item label={<span className="text-white">Push Notifications</span>}>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onChange={(checked) => handleUpdateNotificationSettings("pushNotifications", checked)}
                    />
                  </Form.Item>

                  <Divider style={{ borderColor: "#303030" }} />

                  <h4 className="text-white font-medium mb-4">System Notifications</h4>

                  <Form.Item label={<span className="text-white">New Bookings</span>}>
                    <Switch
                      checked={notificationSettings.systemNotifications.newBookings}
                      onChange={(checked) => handleUpdateSystemNotifications("newBookings", checked)}
                    />
                  </Form.Item>

                  <Form.Item label={<span className="text-white">Cancellations</span>}>
                    <Switch
                      checked={notificationSettings.systemNotifications.cancellations}
                      onChange={(checked) => handleUpdateSystemNotifications("cancellations", checked)}
                    />
                  </Form.Item>

                  <Form.Item label={<span className="text-white">Payment Notifications</span>}>
                    <Switch
                      checked={notificationSettings.systemNotifications.payments}
                      onChange={(checked) => handleUpdateSystemNotifications("payments", checked)}
                    />
                  </Form.Item>

                  <Form.Item label={<span className="text-white">System Updates</span>}>
                    <Switch
                      checked={notificationSettings.systemNotifications.systemUpdates}
                      onChange={(checked) => handleUpdateSystemNotifications("systemUpdates", checked)}
                    />
                  </Form.Item>
                </Form>
              </div>
            </Panel>

            <Panel header="Legal Information (Imprint & Privacy Policy)" key="3" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Imprint</span>}>
                    <TextArea
                      value={generalSettings.imprint}
                      onChange={(e) => handleUpdateGeneralSettings("imprint", e.target.value)}
                      rows={6}
                      style={inputStyle}
                      placeholder="Enter your company's imprint information..."
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Privacy Policy</span>}>
                    <TextArea
                      value={generalSettings.privacyPolicy}
                      onChange={(e) => handleUpdateGeneralSettings("privacyPolicy", e.target.value)}
                      rows={8}
                      style={inputStyle}
                      placeholder="Enter your privacy policy..."
                    />
                  </Form.Item>
                </Form>
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        <TabPane tab="Finances" key="2">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Currency Settings" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Currency</span>}>
                    <Select
                      value={currency}
                      onChange={(value) => setCurrency(value)}
                      style={inputStyle}
                      optionLabelProp="label"
                    >
                      <Select.Option value="€" label="€ (Euro)">
                        <div className="flex justify-between">
                          <span>Euro</span>
                          <span className="text-gray-300">€</span>
                        </div>
                      </Select.Option>
                      <Select.Option value="$" label="$ (US Dollar)">
                        <div className="flex justify-between">
                          <span>US Dollar</span>
                          <span className="text-gray-300">$</span>
                        </div>
                      </Select.Option>
                      <Select.Option value="£" label="£ (British Pound)">
                        <div className="flex justify-between">
                          <span>British Pound</span>
                          <span className="text-gray-300">£</span>
                        </div>
                      </Select.Option>
                      <Select.Option value="¥" label="¥ (Japanese Yen)">
                        <div className="flex justify-between">
                          <span>Japanese Yen</span>
                          <span className="text-gray-300">¥</span>
                        </div>
                      </Select.Option>
                      <Select.Option value="Fr" label="Fr (Swiss Franc)">
                        <div className="flex justify-between">
                          <span>Swiss Franc</span>
                          <span className="text-gray-300">Fr</span>
                        </div>
                      </Select.Option>
                      <Select.Option value="A$" label="A$ (Australian Dollar)">
                        <div className="flex justify-between">
                          <span>Australian Dollar</span>
                          <span className="text-gray-300">A$</span>
                        </div>
                      </Select.Option>
                      <Select.Option value="C$" label="C$ (Canadian Dollar)">
                        <div className="flex justify-between">
                          <span>Canadian Dollar</span>
                          <span className="text-gray-300">C$</span>
                        </div>
                      </Select.Option>
                      <Select.Option value="kr" label="kr (Swedish Krona)">
                        <div className="flex justify-between">
                          <span>Swedish Krona</span>
                          <span className="text-gray-300">kr</span>
                        </div>
                      </Select.Option>
                    </Select>
                    <div className="text-xs text-gray-400 mt-1">
                      You can now manually select your preferred currency regardless of country selection
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        <TabPane tab="Appearance" key="3">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Theme Settings" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Default Theme</span>}>
                    <Radio.Group
                      value={appearance.theme}
                      onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                    >
                      <Space direction="vertical">
                        <Radio value="light">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-white border border-gray-300"></div>
                            <span className="text-white">Light Mode</span>
                          </div>
                        </Radio>
                        <Radio value="dark">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#181818] border border-gray-700"></div>
                            <span className="text-white">Dark Mode</span>
                          </div>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item label={<span className="text-white">Allow Users to Toggle Theme</span>}>
                    <Switch
                      checked={appearance.allowUserThemeToggle}
                      onChange={(checked) => setAppearance({ ...appearance, allowUserThemeToggle: checked })}
                    />
                  </Form.Item>

                  <Divider style={{ borderColor: "#303030" }} />

                  <Form.Item
                    label={
                      <div className="flex items-center">
                        <span className="text-white">Primary Color</span>
                        <Tooltip title="Used for buttons, links, and primary actions">
                          <InfoCircleOutlined style={tooltipStyle} />
                        </Tooltip>
                      </div>
                    }
                  >
                    <div className="flex items-center gap-3">
                      <ColorPicker
                        value={appearance.primaryColor}
                        onChange={(color) => setAppearance({ ...appearance, primaryColor: color })}
                      />
                      <div
                        className="h-10 w-20 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: appearance.primaryColor }}
                      >
                        <BgColorsOutlined />
                      </div>
                    </div>
                  </Form.Item>

                  <Form.Item
                    label={
                      <div className="flex items-center">
                        <span className="text-white">Secondary Color</span>
                        <Tooltip title="Used for accents, highlights, and secondary actions">
                          <InfoCircleOutlined style={tooltipStyle} />
                        </Tooltip>
                      </div>
                    }
                  >
                    <div className="flex items-center gap-3">
                      <ColorPicker
                        value={appearance.secondaryColor}
                        onChange={(color) => setAppearance({ ...appearance, secondaryColor: color })}
                      />
                      <div
                        className="h-10 w-20 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: appearance.secondaryColor }}
                      >
                        <BgColorsOutlined />
                      </div>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        <TabPane tab="Contracts" key="4">
          <Collapse defaultActiveKey={["4"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Contract Types" key="4" className="bg-[#202020]">
              <div className="space-y-4">
                {contractTypes.map((type, index) => (
                  <Collapse key={index} className="border border-[#303030] rounded-lg overflow-hidden">
                    <Panel header={type.name || "New Contract Type"} key="1" className="bg-[#252525]">
                      <Form layout="vertical">
                        <Form.Item label={<span className="text-white">Contract Name</span>}>
                          <Input
                            value={type.name}
                            onChange={(e) => {
                              const updated = [...contractTypes]
                              updated[index].name = e.target.value
                              setContractTypes(updated)
                            }}
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white white-text">Duration (months)</span>}>
                          <div className="white-text">
                            <InputNumber
                              value={type.duration}
                              onChange={(value) => {
                                const updated = [...contractTypes]
                                updated[index].duration = value || 0
                                setContractTypes(updated)
                              }}
                              style={inputStyle}
                            />
                          </div>
                        </Form.Item>
                        <Form.Item label={<span className="text-white white-text">Cost</span>}>
                          <div className="white-text">
                            <InputNumber
                              value={type.cost}
                              onChange={(value) => {
                                const updated = [...contractTypes]
                                updated[index].cost = value || 0
                                setContractTypes(updated)
                              }}
                              style={inputStyle}
                              precision={2}
                            />
                          </div>
                        </Form.Item>
                        <Form.Item label={<span className="text-white">Billing Period</span>}>
                          <Select
                            value={type.billingPeriod}
                            onChange={(value) => {
                              const updated = [...contractTypes]
                              updated[index].billingPeriod = value
                              setContractTypes(updated)
                            }}
                            style={selectStyle}
                          >
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="annually">Annually</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label={
                            <div className="flex items-center">
                              <span className="text-white white-text">Maximum Member Capacity</span>
                            </div>
                          }
                        >
                          <div className="white-text">
                            <InputNumber
                              value={type.maximumMemberCapacity || 0}
                              onChange={(value) => {
                                const updated = [...contractTypes]
                                updated[index].maximumMemberCapacity = value || 0
                                setContractTypes(updated)
                              }}
                              style={inputStyle}
                              min={0}
                            />
                          </div>
                        </Form.Item>
                      </Form>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => setContractTypes(contractTypes.filter((_, i) => i !== index))}
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </Panel>
                  </Collapse>
                ))}
                <Button type="dashed" onClick={handleAddContractType} icon={<PlusOutlined />} style={buttonStyle}>
                  Add Contract Type
                </Button>
              </div>
            </Panel>

            <Panel header="Contract Sections" key="2" className="bg-[#202020]">
              <div className="space-y-4">
                {contractSections.map((section, index) => (
                  <Collapse key={index} className="border border-[#303030] rounded-lg overflow-hidden">
                    <Panel header={section.title || "New Section"} key="1" className="bg-[#252525]">
                      <Form layout="vertical">
                        <Form.Item label={<span className="text-white">Section Title</span>}>
                          <Input
                            value={section.title}
                            onChange={(e) => {
                              const updated = [...contractSections]
                              updated[index].title = e.target.value
                              setContractSections(updated)
                            }}
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white">Content</span>}>
                          <TextArea
                            value={section.content}
                            onChange={(e) => {
                              const updated = [...contractSections]
                              updated[index].content = e.target.value
                              setContractSections(updated)
                            }}
                            rows={4}
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white">Signature needed</span>}>
                          <Switch
                            checked={section.editable ?? false}
                            onChange={(checked) => {
                              const updated = [...contractSections]
                              updated[index].editable = checked
                              setContractSections(updated)
                            }}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white">Requires Agreement</span>}>
                          <Switch
                            checked={section.requiresAgreement}
                            onChange={(checked) => {
                              const updated = [...contractSections]
                              updated[index].requiresAgreement = checked
                              setContractSections(updated)
                            }}
                          />
                        </Form.Item>
                      </Form>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => setContractSections(contractSections.filter((_, i) => i !== index))}
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </Panel>
                  </Collapse>
                ))}
                <Button type="dashed" onClick={handleAddContractSection} icon={<PlusOutlined />} style={buttonStyle}>
                  Add Contract Section
                </Button>
              </div>
            </Panel>

            <Panel header="Contract Pause Reasons" key="3" className="bg-[#202020]">
              <div className="space-y-4">
                {contractPauseReasons.map((reason, index) => (
                  <div key={index} className="flex white-text flex-wrap gap-4 items-center">
                    <Input
                      placeholder="Reason Name"
                      value={reason.name}
                      onChange={(e) => {
                        const updated = [...contractPauseReasons]
                        updated[index].name = e.target.value
                        setContractPauseReasons(updated)
                      }}
                      className="w-full sm:w-64"
                      style={inputStyle}
                    />

                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveContractPauseReason(index)}
                      className="w-full sm:w-auto"
                      style={buttonStyle}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={handleAddContractPauseReason}
                  icon={<PlusOutlined />}
                  style={buttonStyle}
                >
                  Add Pause Reason
                </Button>
              </div>
            </Panel>

            <Panel header="Additional Documents" key="5" className="bg-[#202020]">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-white font-medium">Additional Documents</h3>
                  <Button onClick={handleViewBlankContract} style={buttonStyle}>
                    View Blank Contract
                  </Button>
                </div>
                <Upload
                  accept=".pdf"
                  multiple
                  onChange={({ fileList }) => setAdditionalDocs(fileList)}
                  fileList={additionalDocs}
                >
                  <Button icon={<UploadOutlined />} style={buttonStyle}>
                    Upload PDF Documents
                  </Button>
                </Upload>
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        <TabPane tab="Resources" key="5">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Lead Sources" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-white font-medium">Manage Lead Sources</h3>
                  <Button onClick={handleAddLeadSource} icon={<PlusOutlined />} style={saveButtonStyle}>
                    Add Lead Source
                  </Button>
                </div>

                {leadSources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between bg-[#252525] p-3 rounded-lg">
                    <Input
                      value={source.name}
                      onChange={(e) => handleUpdateLeadSource(source.id, "name", e.target.value)}
                      style={inputStyle}
                      placeholder="Source name"
                      className="mr-2"
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveLeadSource(source.id)}
                      style={buttonStyle}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                {leadSources.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No lead sources configured yet.</p>
                    <Button onClick={handleAddLeadSource} icon={<PlusOutlined />} style={saveButtonStyle}>
                      Add Your First Lead Source
                    </Button>
                  </div>
                )}
              </div>
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>

      <div className="flex justify-end mt-4">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveConfiguration}
          size="large"
          style={saveButtonStyle}
        >
          Save Configuration
        </Button>
      </div>

      <style jsx>{`
        ${additionalStyles}
        ${styleOverrides}
      `}</style>
    </div>
  )
}

const additionalStyles = `
  /* Collapse Styles */
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

  /* Checkbox Styles */
  .ant-checkbox-wrapper {
    color: white !important;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #FF843E !important;
    border-color: #FF843E !important;
  }

  /* Radio Styles */
  .ant-radio-wrapper {
    color: white !important;
  }

  .ant-radio-checked .ant-radio-inner {
    border-color: #FF843E !important;
  }

  .ant-radio-inner::after {
    background-color: #FF843E !important;
  }

  /* Divider Styles */
  .ant-divider {
    border-color: #303030 !important;
  }
`

const styleOverrides = `
  /* Select Component Styles */
  .ant-select {
    background-color: #101010 !important;
    color: white !important;
  }

  .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
    border-color: #303030 !important;
  }

  .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-color: #303030 !important;
    box-shadow: none !important;
  }

  .ant-select-selector {
    background-color: #101010 !important;
    border: none !important;
    color: white !important;
  }

  .ant-select-arrow {
    color: white !important;
  }

  .ant-select-selection-placeholder {
    color: rgba(255, 255, 255, 0.3) !important;
  }

  .ant-select-multiple .ant-select-selection-item {
    background-color: #1f1f1f !important;
    border-color: #303030 !important;
  }

  .ant-select-item-option-content {
    color: white !important;
  }

  .ant-select-dropdown {
    background-color: #101010 !important;
    border: 1px solid #303030 !important;
    padding: 4px !important;
  }

  .ant-select-item {
    color: white !important;
    background-color: #101010 !important;
  }

  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: #1f1f1f !important;
    color: white !important;
  }

  .ant-select-item-option-active {
    background-color: #1f1f1f !important;
  }

  .ant-select-item-option:hover {
    background-color: #1f1f1f !important;
  }

  /* TimePicker Styles */
  .ant-picker-dropdown {
    background-color: #101010 !important;
  }

  .ant-picker-panel-container {
    background-color: #101010 !important;
    border: 1px solid #303030 !important;
  }

  .ant-picker-content th,
  .ant-picker-content td {
    color: white !important;
  }

  .ant-form-item-label > label {
    color: white !important;
  }

  .ant-picker-header Button {
    color: white !important;
  }

  .ant-picker-header {
    border-bottom: 1px solid #303030 !important;
  }

  .ant-picker-cell {
    color: rgba(255, 255, 255, 0.7) !important;
  }

  .ant-picker-cell-in-view {
    color: white !important;
  }

  .ant-picker-cell-selected .ant-picker-cell-inner {
    background-color: #1890ff !important;
  }

  .ant-picker-time-panel-column > li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner {
    color: white !important;
  }

  .ant-picker-time-panel {
    border-left: 1px solid #303030 !important;
  }

  /* Input Number Styles */
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

  /* Notification Styles */
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

  /* Placeholder Styles */
  ::placeholder {
    color: rgba(255, 255, 255, 0.3) !important;
  }

  /* Tab Styles */
  .ant-tabs-tab {
    color: rgba(255, 255, 255, 0.7) !important;
  }

  .ant-tabs-tab-active {
    color: white !important;
  }

  .ant-tabs-ink-bar {
    background: #FF843E !important;
  }

  /* Switch Styles */
  .ant-switch {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }

  .ant-switch-checked {
    background-color: #FF843E !important;
  }

  /* Upload Styles */
  .ant-upload-list {
    color: white !important;
  }

  .ant-upload-list-item {
    border-color: #303030 !important;
  }

  .ant-upload-list-item-name {
    color: white !important;
  }

  /* Collapse Styles */
  .ant-collapse {
    background-color: #181818 !important;
    border-color: #303030 !important;
  }
`

export default ConfigurationPage
