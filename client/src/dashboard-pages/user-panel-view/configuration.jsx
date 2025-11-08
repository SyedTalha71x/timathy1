/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */

import { Checkbox, Row } from "antd"
import { useState, useEffect, useRef } from "react"
import {
  Input,
  Select,
  Button,
  ColorPicker,
  TimePicker,
  Form,
  notification,
  Upload,
  Switch,
  InputNumber,
  Tabs,
  DatePicker,
  Collapse,
  Alert,
  Tooltip,
  Radio,
  Space,
  Divider,
  Tag,
} from "antd"
import dayjs from "dayjs"
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  BgColorsOutlined,
  SettingOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  MailOutlined,
  MessageOutlined,
  FileSearchOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserAddOutlined,
  FileProtectOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ReadOutlined,
  LineChartOutlined,
  DownloadOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons"
import VariablePicker from "../../components/variable-picker"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'
import "../../custom-css/user-panel-configuration.css"
import { QRCode, Typography } from "antd"
import { QrcodeOutlined, ImportOutlined } from "@ant-design/icons"

import ContractBuilder from "../../components/user-panel-components/configuration-components/ContractBuilder"
import { PermissionModal } from "../../components/user-panel-components/configuration-components/PermissionModal"
import { WysiwygEditor } from "../../components/user-panel-components/configuration-components/WysiwygEditor"

const { Title } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input
const { Panel } = Collapse

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
  color: "#000",
}
const buttonStyle = {
  backgroundColor: "#101010",
  border: "1px solid #303030",
  color: "#fff",
}
const saveButtonStyle = {
  backgroundColor: "#FF843E",
  border: "1px solid #303030",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s",
  outline: "none",
  fontSize: "14px",
}

const tooltipStyle = {
  marginLeft: "8px",
  color: "rgba(255, 255, 255, 0.5)",
}

const ConfigurationPage = () => {
  const [allowMemberSelfCancellation, setAllowMemberSelfCancellation] = useState(true)

  // Basic studio information
  const [studioName, setStudioName] = useState("")
  const [studioOperator, setStudioOperator] = useState("")
  const [studioStreet, setStudioStreet] = useState("")
  const [studioZipCode, setStudioZipCode] = useState("")
  const [studioCity, setStudioCity] = useState("")
  const [studioCountry, setStudioCountry] = useState("")
  const [studioPhoneNo, setStudioPhoneNo] = useState("")
  const [studioEmail, setStudioEmail] = useState("")
  const [studioWebsite, setStudioWebsite] = useState("")
  const [currency, setCurrency] = useState("€")

  // Opening hours and closing days
  const [openingHours, setOpeningHours] = useState([])
  const [closingDays, setClosingDays] = useState([])
  const [publicHolidays, setPublicHolidays] = useState([])
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)

  // Other studio settings
  const [logo, setLogo] = useState([])
  const [logoUrl, setLogoUrl] = useState("")
  const [roles, setRoles] = useState([])
  const [appointmentTypes, setAppointmentTypes] = useState([])
  const [tags, setTags] = useState([])

  // Countries for selection with currency
  const [countries, setCountries] = useState([
    { code: "AT", name: "Austria", currency: "€" },
    { code: "BE", name: "Belgium", currency: "€" },
    { code: "BG", name: "Bulgaria", currency: "лв" },
    { code: "CA", name: "Canada", currency: "$" },
    { code: "HR", name: "Croatia", currency: "€" },
    { code: "CY", name: "Cyprus", currency: "€" },
    { code: "CZ", name: "Czech Republic", currency: "Kč" },
    { code: "DK", name: "Denmark", currency: "kr" },
    { code: "EE", name: "Estonia", currency: "€" },
    { code: "FI", name: "Finland", currency: "€" },
    { code: "FR", name: "France", currency: "€" },
    { code: "DE", name: "Germany", currency: "€" },
    { code: "GR", name: "Greece", currency: "€" },
    { code: "HU", name: "Hungary", currency: "Ft" },
    { code: "IE", name: "Ireland", currency: "€" },
    { code: "IT", name: "Italy", currency: "€" },
    { code: "LV", name: "Latvia", currency: "€" },
    { code: "LT", name: "Lithuania", currency: "€" },
    { code: "LU", name: "Luxembourg", currency: "€" },
    { code: "MT", name: "Malta", currency: "€" },
    { code: "NL", name: "Netherlands", currency: "€" },
    { code: "PL", name: "Poland", currency: "zł" },
    { code: "PT", name: "Portugal", currency: "€" },
    { code: "RO", name: "Romania", currency: "lei" },
    { code: "SK", name: "Slovakia", currency: "€" },
    { code: "SI", name: "Slovenia", currency: "€" },
    { code: "ES", name: "Spain", currency: "€" },
    { code: "SE", name: "Sweden", currency: "kr" },
    { code: "GB", name: "United Kingdom", currency: "£" },
    { code: "US", name: "United States", currency: "$" },
  ])

  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null)

  const [maxCapacity, setMaxCapacity] = useState(10)
  const [contractTypes, setContractTypes] = useState([])
  const [contractSections, setContractSections] = useState([
    { title: "Personal Information", content: "", editable: false, requiresAgreement: true },
    { title: "Contract Terms", content: "", editable: false, requiresAgreement: true },
  ])
  const [contractPauseReasons, setContractPauseReasons] = useState([
    { name: "Vacation", maxDays: 30 },
    { name: "Medical", maxDays: 90 },
  ])
  const [noticePeriod, setNoticePeriod] = useState(30)
  const [extensionPeriod, setExtensionPeriod] = useState(12)
  const [additionalDocs, setAdditionalDocs] = useState([])

  const [defaultVacationDays, setDefaultVacationDays] = useState(20)

  // <CHANGE> Settings Modal States - All Communication/Notification Settings
  const [settings, setSettings] = useState({
    autoArchiveDuration: 30,
    emailNotificationEnabled: false,
    birthdayMessageEnabled: false,
    birthdayMessageTemplate: "",
    appointmentNotificationEnabled: false,
    appNotificationEnabled: false,
    birthdayAppNotificationEnabled: false,
    appointmentAppNotificationEnabled: false,
    appConfirmationEnabled: false,
    appCancellationEnabled: false,
    appRescheduledEnabled: false,
    appReminderEnabled: false,
    notificationSubTab: "email",
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    emailSignature: "Best regards,\n{Studio_Name} Team",
  })

  const [appointmentNotificationTypes, setAppointmentNotificationTypes] = useState({
    confirmation: {
      enabled: false,
      template: "",
      sendApp: false,
      sendEmail: false,
      hoursBefore: 24,
    },
    cancellation: {
      enabled: false,
      template: "",
      sendApp: false,
      sendEmail: false,
      hoursBefore: 24,
    },
    rescheduled: {
      enabled: false,
      template: "",
      sendApp: false,
      sendEmail: false,
      hoursBefore: 24,
    },
    reminder: {
      enabled: false,
      template: "",
      sendApp: false,
      sendEmail: false,
      hoursBefore: 24,
    },
  })

  const birthdayTextareaRef = useRef(null)
  const confirmationTextareaRef = useRef(null)
  const cancellationTextareaRef = useRef(null)
  const rescheduledTextareaRef = useRef(null)
  const reminderTextareaRef = useRef(null)

  // <CHANGE> Old Communication Settings (keeping for compatibility)
  const [autoArchiveDuration, setAutoArchiveDuration] = useState(30)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [chatNotifications, setChatNotifications] = useState(true)
  const [emailSignature, setEmailSignature] = useState("Best regards,\n{Studio_Name} Team")
  const [broadcastEmail, setBroadcastEmail] = useState(true)
  const [broadcastChat, setBroadcastChat] = useState(true)

  const [birthdayMessage, setBirthdayMessage] = useState({
    enabled: false,
    message: "Happy Birthday! 🎉 Best wishes from {Studio_Name}",
  })

  const [trialTraining, setTrialTraining] = useState({
    name: "Trial Training",
    duration: 60,
    capacity: 1,
    color: "#1890ff",
  })
  const [broadcastMessages, setBroadcastMessages] = useState([
    {
      title: "",
      message: "",
      sendVia: ["email", "platform"],
    },
  ])
  const [appointmentNotifications, setAppointmentNotifications] = useState([
    {
      type: "booking",
      title: "Appointment Confirmation",
      message: "Hello {Member_Name}, your {Appointment_Type} has been booked for {Booked_Time}.",
      sendVia: ["email", "platform"],
      enabled: true,
    },
    {
      type: "cancellation",
      title: "Appointment Cancellation",
      message: "Hello {Member_Name}, your {Appointment_Type} scheduled for {Booked_Time} has been cancelled.",
      sendVia: ["email", "platform"],
      enabled: true,
    },
    {
      type: "rescheduled",
      title: "Appointment Rescheduled",
      message: "Hello {Member_Name}, your {Appointment_Type} has been rescheduled to {Booked_Time}.",
      sendVia: ["email", "platform"],
      enabled: true,
    },
  ])
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: "",
    smtpPort: 587,
    emailAddress: "",
    password: "",
    useSSL: false,
    senderName: "",
    smtpUser: "",
    smtpPass: "",
  })
  const [vatRates, setVatRates] = useState([
    { name: "Standard", percentage: 19, description: "Standard VAT rate" },
    {
      name: "Reduced",
      percentage: 7,
      description: "Reduced VAT rate for essential goods",
    },
  ])

  const [appearance, setAppearance] = useState({
    theme: "dark",
    primaryColor: "#FF843E",
    secondaryColor: "#1890ff",
    allowStaffThemeToggle: true,
    allowMemberThemeToggle: true
  })

  const [leadSources, setLeadSources] = useState([
    { id: 1, name: "Website", color: "blue" },
    { id: 2, name: "Referral", color: "blue" },
  ])
  const nextLeadSourceId = useRef(leadSources.length > 0 ? Math.max(...leadSources.map((s) => s.id)) + 1 : 1)

  const [vatNumber, setVatNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [creditorId, setCreditorId] = useState("")

  const [allowMemberQRCheckIn, setAllowMemberQRCheckIn] = useState(false)
  const [memberQRCodeUrl, setMemberQRCodeUrl] = useState("")

  // <CHANGE> Helper function to check boolean values
  const bool = (v, d = false) => (typeof v === "boolean" ? v : d)

  // <CHANGE> Insert variable helper for settings modal textareas
  const insertVariable = (variable, textareaRef, currentValue, setValue) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = currentValue.substring(0, start) + `{${variable}}` + currentValue.substring(end)
      setValue(newValue)
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2)
      }, 0)
    }
  }

  // <CHANGE> Get appointment notification type with defaults
  const getType = (key) => {
    const t = appointmentNotificationTypes?.[key] || {}
    return {
      enabled: bool(t.enabled, false),
      template: t.template || "",
      sendApp: bool(t.sendApp, false),
      sendEmail: bool(t.sendEmail, false),
      hoursBefore: typeof t.hoursBefore === "number" ? t.hoursBefore : 24,
    }
  }

  const conf = getType("confirmation")
  const canc = getType("cancellation")
  const resch = getType("rescheduled")
  const reminder = getType("reminder")

  // <CHANGE> Handle save settings
  const handleSaveSettings = () => {
    notification.success({
      message: "Settings Saved",
      description: "Your communication settings have been saved successfully!",
    })
  }

  useEffect(() => {
    if (studioCountry) {
      fetchPublicHolidays(studioCountry)
      const selectedCountry = countries.find((c) => c.code === studioCountry)
      if (selectedCountry) {
        setCurrency(selectedCountry.currency)
      }
    }
  }, [studioCountry])

  const fetchPublicHolidays = async (countryCode) => {
    if (!countryCode) return
    setIsLoadingHolidays(true)
    try {
      const currentYear = new Date().getFullYear()
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/${countryCode}`)
      if (!response.ok) {
        throw new Error("Failed to fetch holidays")
      }
      const data = await response.json()
      const holidays = data.map((holiday) => ({
        date: holiday.date,
        name: holiday.name,
        countryCode: holiday.countryCode,
      }))
      setPublicHolidays(holidays)
      notification.success({
        message: "Holidays Loaded",
        description: `Successfully loaded ${data.length} public holidays for ${countryCode}`,
      })
    } catch (error) {
      console.error("Error fetching holidays:", error)
      notification.error({
        message: "Error Loading Holidays",
        description: "Could not load public holidays. Please try again later.",
      })
    } finally {
      setIsLoadingHolidays(false)
    }
  }

  const handlePermissionChange = (permissions) => {
    if (selectedRoleIndex !== null) {
      const updatedRoles = [...roles];
      updatedRoles[selectedRoleIndex].permissions = permissions;
      setRoles(updatedRoles);
    }
  };

  const openPermissionModal = (index) => {
    setSelectedRoleIndex(index);
    setPermissionModalVisible(true);
  };

  const addPublicHolidaysToClosingDays = (holidaysToProcess = publicHolidays) => {
    if (holidaysToProcess.length === 0) {
      notification.warning({
        message: "No Holidays Available",
        description: "Please select a country first to load public holidays.",
      })
      return
    }
    const existingDates = closingDays.map((day) => day.date?.format("YYYY-MM-DD"))
    const newHolidays = holidaysToProcess.filter((holiday) => !existingDates.includes(holiday.date))
    if (newHolidays.length === 0) {
      notification.info({
        message: "No New Holidays",
        description: "All public holidays are already added to closing days.",
      })
      return
    }
    const holidaysToAdd = newHolidays.map((holiday) => ({
      date: holiday.date ? dayjs(holiday.date) : null,
      description: holiday.name,
    }))
    setClosingDays([...closingDays, ...holidaysToAdd])
    notification.success({
      message: "Holidays Added",
      description: `Added ${holidaysToAdd.length} public holidays to closing days.`,
    })
  }

  const handleAddVatRate = () => {
    setVatRates([...vatRates, { name: "", percentage: 0, description: "" }])
  }

  const handleAddOpeningHour = () => {
    setOpeningHours([...openingHours, { day: "", startTime: "", endTime: "" }])
  }

  const handleRemoveOpeningHour = (index) => {
    const updatedHours = openingHours.filter((_, i) => i !== index)
    setOpeningHours(updatedHours)
  }

  const handleAddClosingDay = () => {
    setClosingDays([...closingDays, { date: null, description: "" }])
  }

  const handleRemoveClosingDay = (index) => {
    const updatedDays = closingDays.filter((_, i) => i !== index)
    setClosingDays(updatedDays)
  }

  const handleAddRole = () => {
    setRoles([
      ...roles,
      {
        name: "",
        permissions: [],
        color: "#1890ff",
        defaultVacationDays: 20,
      },
    ])
  }

  const handleAddAppointmentType = () => {
    setAppointmentTypes([
      ...appointmentTypes,
      {
        name: "",
        duration: 30,
        capacity: 1,
        color: "#1890ff",
        interval: 30,
        images: [],
      },
    ])
  }

  const handleAddTag = () => {
    setTags([...tags, { name: "", color: "#1890ff" }])
  }

  const handleAddContractPauseReason = () => {
    setContractPauseReasons([...contractPauseReasons, { name: "", maxDays: 30 }])
  }

  const handleRemoveContractPauseReason = (index) => {
    setContractPauseReasons(contractPauseReasons.filter((_, i) => i !== index))
  }

  const validateClosingDays = () => {
    const dates = closingDays.map((day) => day.date?.format("YYYY-MM-DD")).filter(Boolean)
    const uniqueDates = new Set(dates)
    if (dates.length !== uniqueDates.size) {
      notification.warning({
        message: "Duplicate Dates",
        description: "You have duplicate dates in your closing days. Please remove duplicates.",
      })
      return false
    }
    const missingDescriptions = closingDays.some((day) => day.date && !day.description)
    if (missingDescriptions) {
      notification.warning({
        message: "Missing Descriptions",
        description: "Please provide descriptions for all closing days.",
      })
      return false
    }
    return true
  }

  const handleSaveConfiguration = () => {
    if (!studioName || !studioStreet || !studioZipCode || !studioCity) {
      notification.error({ message: "Please fill in all required fields in Studio Data." })
      return
    }
    if (!validateClosingDays()) {
      return
    }
    notification.success({ message: "Configuration saved successfully!" })
  }

  const handleAddContractType = () => {
    setContractTypes([
      ...contractTypes,
      {
        name: "",
        duration: 12,
        cost: 0,
        billingPeriod: "monthly",
        userCapacity: 0,
        autoRenewal: false,
        renewalPeriod: 1,
        renewalPrice: 0,
        cancellationPeriod: 30,
      },
    ])
  }

  const handleLogoUpload = (info) => {
    if (info.file.status === "uploading") {
      return
    }

    if (info.file.status === "done" || info.file) {
      if (info.file.originFileObj) {
        const url = URL.createObjectURL(info.file.originFileObj)
        setLogoUrl(url)
      }
      setLogo([info.file])
      notification.success({ message: "Logo uploaded successfully" })
    }

    if (info.file.status === "removed") {
      setLogoUrl("")
      setLogo([])
    }
  }

  const downloadQRCode = () => {
    const canvas = document.querySelector('.qr-code canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `studio-qr-code-${studioName || 'checkin'}.png`;
      link.href = url;
      link.click();
    }
  };

  const handleUpdateAppointmentType = (index, field, value) => {
    const updatedTypes = [...appointmentTypes]
    updatedTypes[index][field] = value
    setAppointmentTypes(updatedTypes)
  }

  const handleUpdateAppointmentTypeImages = (index, fileList) => {
    const updatedTypes = [...appointmentTypes]
    updatedTypes[index].images = fileList
    setAppointmentTypes(updatedTypes)
  }

  const testEmailConnection = () => {
    console.log("Test Email connection", emailConfig)
    notification.info({
      message: "Test Connection",
      description: "Attempting to connect to SMTP server...",
    })
  }

  const handleAddBroadcastMessage = () => {
    setBroadcastMessages([
      ...broadcastMessages,
      {
        title: "",
        message: "",
        sendVia: ["email", "platform"],
      },
    ])
  }

  const handleRemoveBroadcastMessage = (index) => {
    setBroadcastMessages(broadcastMessages.filter((_, i) => i !== index))
  }

  const handleUpdateBroadcastMessage = (index, field, value) => {
    const updatedMessages = [...broadcastMessages]
    updatedMessages[index][field] = value
    setBroadcastMessages(updatedMessages)
  }

  const handleUpdateAppointmentNotification = (index, field, value) => {
    const updatedNotifications = [...appointmentNotifications]
    updatedNotifications[index][field] = value
    setAppointmentNotifications(updatedNotifications)
  }

  const handleAddLeadSource = () => {
    setLeadSources([...leadSources, { id: nextLeadSourceId.current++, name: "" }])
  }

  const handleUpdateLeadSource = (id, field, value) => {
    setLeadSources(leadSources.map((source) => (source.id === id ? { ...source, [field]: value } : source)))
  }

  const handleRemoveLeadSource = (id) => {
    setLeadSources(leadSources.filter((source) => source.id !== id))
  }

  const notificationSubTab = settings?.notificationSubTab || "email"

  return (
    <>
      <div className=" w-full mx-auto lg:p-6 p-5 rounded-3xl space-y-8 bg-[#181818] min-h-screen text-white">
        <h1 className="lg:text-3xl text-2xl font-bold oxanium_font">Studio Configuration</h1>
        <Tabs defaultActiveKey="1" style={{ color: "white" }}>
          <TabPane tab="Studio Data" key="1">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              <Panel header="Studio Information" key="1" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 rounded-xl overflow-hidden  shadow-lg">
                        <img
                          src={logoUrl || DefaultAvatar}
                          alt="Studio Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Upload
                        accept="image/*"
                        maxCount={1}
                        onChange={handleLogoUpload}
                        fileList={logo}
                        showUploadList={false}
                      >
                        <Button icon={<UploadOutlined />} style={buttonStyle}>
                          {logo.length > 0 ? "Change Logo" : "Upload Logo"}
                        </Button>
                      </Upload>
                      {logo.length > 0 && (
                        <Button
                          type="text"
                          danger
                          size="small"
                          onClick={() => {
                            setLogo([])
                            setLogoUrl("")
                          }}
                        >
                          Remove Logo
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">Studio Name</span>} required>
                      <Input
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        placeholder="Enter studio name"
                        style={inputStyle}
                        maxLength={50}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Studio Operator</span>}>
                      <Input
                        value={studioOperator}
                        onChange={(e) => setStudioOperator(e.target.value)}
                        placeholder="Enter studio operator name"
                        style={inputStyle}
                        maxLength={50}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      label={<span className="text-white">Phone No</span>}
                      name="phone"
                      rules={[{ required: true, message: "Please enter phone number" }]}
                    >
                      <Input
                        value={studioPhoneNo}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "")
                          setStudioPhoneNo(onlyDigits)
                        }}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                        placeholder="Enter phone no"
                        style={inputStyle}
                        maxLength={15}
                        inputMode="numeric"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="text-white">Email</span>}
                      name="email"
                      rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Please enter a valid email" },
                      ]}
                    >
                      <Input
                        value={studioEmail}
                        onChange={(e) => setStudioEmail(e.target.value)}
                        placeholder="Enter email"
                        style={inputStyle}
                        maxLength={60}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">Street (with number)</span>} required>
                      <Input
                        value={studioStreet}
                        onChange={(e) => setStudioStreet(e.target.value)}
                        placeholder="Enter street and number"
                        style={inputStyle}
                        maxLength={60}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">ZIP Code</span>} required>
                      <Input
                        value={studioZipCode}
                        onChange={(e) => setStudioZipCode(e.target.value)}
                        placeholder="Enter ZIP code"
                        style={inputStyle}
                        maxLength={10}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">City</span>} required>
                      <Input
                        value={studioCity}
                        onChange={(e) => setStudioCity(e.target.value)}
                        placeholder="Enter city"
                        style={inputStyle}
                        maxLength={40}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Country</span>} required>
                      <Select
                        value={studioCountry}
                        onChange={(value) => setStudioCountry(value)}
                        placeholder="Select country"
                        style={selectStyle}
                        showSearch
                      >
                        {countries.map((country) => (
                          <Option key={country.code} value={country.code}>
                            {country.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 md:w-[49.5%] w-full gap-4">
                    <Form.Item label={<span className="text-white">Studio Website</span>}>
                      <Input
                        value={studioWebsite}
                        onChange={(e) => setStudioWebsite(e.target.value)}
                        placeholder="Enter studio website URL"
                        style={inputStyle}
                        maxLength={50}
                      />
                    </Form.Item>
                  </div>
                </Form>
              </Panel>

              <Panel header="Opening Hours" key="2" className="bg-[#202020]">
                <div className="space-y-4">
                  {openingHours.map((hour, index) => (
                    <div key={index} className="flex flex-wrap gap-4 items-center">
                      <Select
                        placeholder="Select day"
                        value={hour.day}
                        onChange={(value) => {
                          const updatedHours = [...openingHours]
                          updatedHours[index].day = value
                          setOpeningHours(updatedHours)
                        }}
                        className="w-full sm:w-40"
                        style={selectStyle}
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <Option key={day} value={day}>
                            {day}
                          </Option>
                        ))}
                      </Select>
                      <TimePicker
                        format="HH:mm"
                        placeholder="Start Time"
                        value={hour.startTime}
                        onChange={(time) => {
                          const updatedHours = [...openingHours]
                          updatedHours[index].startTime = time
                          setOpeningHours(updatedHours)
                        }}
                        className="w-full sm:w-32 white-text"
                        style={inputStyle}
                      />
                      <TimePicker
                        format="HH:mm"
                        placeholder="End Time"
                        value={hour.endTime}
                        onChange={(time) => {
                          const updatedHours = [...openingHours]
                          updatedHours[index].endTime = time
                          setOpeningHours(updatedHours)
                        }}
                        className="w-full sm:w-32 white-text"
                        style={inputStyle}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveOpeningHour(index)}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={handleAddOpeningHour}
                    icon={<PlusOutlined />}
                    className="w-full sm:w-auto"
                    style={buttonStyle}
                  >
                    Add Opening Hour
                  </Button>
                </div>
              </Panel>
              <Panel header="Closing Days" key="3" className="bg-[#202020]">
                <div className="space-y-4">
                  {studioCountry && (
                    <div className="mb-4">
                      <Alert
                        message="Public Holidays"
                        description={
                          <div>
                            <p>
                              You can automatically import public holidays for{" "}
                              {countries.find((c) => c.code === studioCountry)?.name || studioCountry}.
                            </p>
                            <Button
                              onClick={() => addPublicHolidaysToClosingDays()}
                              loading={isLoadingHolidays}
                              icon={<CalendarOutlined />}
                              style={{ ...buttonStyle, marginTop: "8px", backgroundColor: "#FF843E" }}
                            >
                              Import Public Holidays
                            </Button>
                          </div>
                        }
                        type="info"
                        showIcon
                        style={{ backgroundColor: "#202020", border: "1px solid #303030" }}
                      />
                    </div>
                  )}
                  {closingDays.map((day, index) => (
                    <div key={index} className="flex flex-wrap gap-4 items-center">
                      <DatePicker
                        placeholder="Select date"
                        value={day.date}
                        onChange={(date) => {
                          const updatedDays = [...closingDays]
                          updatedDays[index].date = date
                          setClosingDays(updatedDays)
                        }}
                        className="w-full sm:w-40 white-text"
                        style={inputStyle}
                      />
                      <Input
                        placeholder="Description (e.g., Public Holiday)"
                        value={day.description}
                        onChange={(e) => {
                          const updatedDays = [...closingDays]
                          updatedDays[index].description = e.target.value
                          setClosingDays(updatedDays)
                        }}
                        className="w-full sm:flex-1"
                        style={inputStyle}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveClosingDay(index)}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={handleAddClosingDay}
                    icon={<PlusOutlined />}
                    className="w-full sm:w-auto"
                    style={buttonStyle}
                  >
                    Add Closing Day
                  </Button>
                </div>
              </Panel>
            </Collapse>
          </TabPane>
          <TabPane tab="Resources" key="2">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              <Panel header="Appointments" key="1" className="bg-[#202020]">
                <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
                  <Panel header="Capacity Settings" key="3" className="bg-[#252525]">
                    <div className="space-y-4">
                      <Form.Item
                        label={
                          <div className="flex items-center">
                            <span className="text-white white-text">Default Maximum Capacity</span>
                            <Tooltip title="Maximum number of participants for all appointment types">
                              <InfoCircleOutlined style={tooltipStyle} />
                            </Tooltip>
                          </div>
                        }
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          value={maxCapacity}
                          onChange={(value) => setMaxCapacity(value || 0)}
                          style={inputStyle}
                          className="white-text"
                        />
                      </Form.Item>
                    </div>
                  </Panel>
                  <Panel header="Appointment Types" key="1" className="bg-[#252525]">
                    <div className="space-y-4">
                      {appointmentTypes.map((type, index) => (
                        <div key={index} className="flex flex-col gap-4 p-4 border border-[#303030] rounded-lg">
                          <div className="flex flex-wrap gap-4 items-center">
                            <Row>
                              <Input
                                placeholder="Appointment Type Name"
                                value={type.name}
                                onChange={(e) => handleUpdateAppointmentType(index, "name", e.target.value)}
                                className="!w-full md:!w-32 lg:!w-90 !py-3.5 white-text"
                                style={inputStyle}
                              />
                            </Row>

                            <div className="flex items-center">
                              <InputNumber
                                placeholder="Duration"
                                value={type.duration}
                                onChange={(value) => handleUpdateAppointmentType(index, "duration", value)}
                                className="w-full sm:w-20 md:w-16 lg:w-18 white-text"
                                style={inputStyle}
                              />
                              <Tooltip title="Duration in minutes">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                            <div className="flex items-center">
                              <InputNumber
                                placeholder="Capacity"
                                value={type.capacity}
                                onChange={(value) => handleUpdateAppointmentType(index, "capacity", value)}
                                className="w-full sm:w-20 md:w-16 lg:w-18 white-text"
                                style={inputStyle}
                              />
                              <Tooltip title="Maximum number of participants">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                            <div className="flex items-center">
                              <ColorPicker
                                value={type.color}
                                onChange={(color) => handleUpdateAppointmentType(index, "color", color)}
                              />
                              <Tooltip title="Calendar display color">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                            <div className="flex items-center">
                              <InputNumber
                                placeholder="Interval"
                                value={type.interval}
                                onChange={(value) => handleUpdateAppointmentType(index, "interval", value)}
                                className="w-full sm:w-20 md:w-16 lg:w-18 white-text"
                                style={inputStyle}
                              />
                              <Tooltip title="Time between appointments in minutes">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => setAppointmentTypes(appointmentTypes.filter((_, i) => i !== index))}
                              className="w-full sm:w-auto"
                              style={buttonStyle}
                            >
                              Remove
                            </Button>
                          </div>
                          <Form.Item label={<span className="text-white">Upload Images</span>}>
                            <Upload
                              accept="image/*"
                              multiple
                              fileList={type.images}
                              onChange={({ fileList }) => handleUpdateAppointmentTypeImages(index, fileList)}
                              listType="picture"
                            >
                              <Button icon={<UploadOutlined />} style={buttonStyle}>
                                Upload Images
                              </Button>
                            </Upload>
                          </Form.Item>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        onClick={handleAddAppointmentType}
                        icon={<PlusOutlined />}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                      >
                        Add Appointment Type
                      </Button>
                    </div>
                  </Panel>
                  <Panel header="Trial Training Settings" key="2" className="bg-[#252525]">
                    <div className="space-y-4">
                      <Form layout="vertical">
                        <Form.Item
                          label={
                            <div className="flex items-center">
                              <span className="text-white">Duration (minutes)</span>
                              <Tooltip title="Length of the trial training session">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                          }
                        >
                          <div className="white-text">
                            <InputNumber
                              value={trialTraining.duration}
                              onChange={(value) =>
                                setTrialTraining({
                                  ...trialTraining,
                                  duration: value || 60,
                                })
                              }
                              style={inputStyle}
                            />
                          </div>
                        </Form.Item>
                        <Form.Item
                          label={
                            <div className="flex items-center">
                              <span className="white-text">Capacity</span>
                              <Tooltip title="Maximum number of participants">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                          }
                        >
                          <div className="white-text">
                            <InputNumber
                              value={trialTraining.capacity}
                              onChange={(value) =>
                                setTrialTraining({
                                  ...trialTraining,
                                  capacity: value || 1,
                                })
                              }
                              max={maxCapacity}
                              style={inputStyle}
                            />
                          </div>
                        </Form.Item>
                        <Form.Item
                          label={
                            <div className="flex items-center">
                              <span className="text-white">Color</span>
                              <Tooltip title="Calendar display color">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                          }
                        >
                          <ColorPicker
                            value={trialTraining.color}
                            onChange={(color) => setTrialTraining({ ...trialTraining, color })}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  </Panel>
                </Collapse>
              </Panel>
              <Panel header="Staff Management" key="2" className="bg-[#202020]">
                <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
                  <Panel header="General Settings" key="2" className="bg-[#252525]">
                    <div className="space-y-4">
                      <Form.Item>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <label className="text-white sm:w-38">Default Vacation Days</label>
                          <InputNumber
                            min={0}
                            max={365}
                            value={defaultVacationDays}
                            onChange={(value) => setDefaultVacationDays(value || 0)}
                            style={inputStyle}
                            className="white-text"
                          />
                        </div>
                      </Form.Item>
                    </div>
                  </Panel>
                  <Panel header="Staff Roles" key="1" className="bg-[#252525]">
                    <div className="space-y-4">
                      {roles.map((role, index) => (
                        <div key={index} className="flex flex-col gap-4 p-3 border border-[#303030] rounded-lg">
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <Input
                              placeholder="Role Name"
                              value={role.name}
                              onChange={(e) => {
                                const updatedRoles = [...roles]
                                updatedRoles[index].name = e.target.value
                                setRoles(updatedRoles)
                              }}
                              className="!w-full sm:!w-48 !py-3.5"
                              style={inputStyle}
                            />

                            <div className="flex items-center gap-2">
                              <ColorPicker
                                value={role.color}
                                onChange={(color) => {
                                  const updatedRoles = [...roles]
                                  updatedRoles[index].color = color
                                  setRoles(updatedRoles)
                                }}
                              />
                            </div>

                            <Button
                              icon={<SecurityScanOutlined />}
                              onClick={() => openPermissionModal(index)}
                              className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                            >
                              Permissions ({role.permissions?.length || 0})
                            </Button>

                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => setRoles(roles.filter((_, i) => i !== index))}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="dashed"
                        onClick={handleAddRole}
                        icon={<PlusOutlined />}
                      >
                        Add Role
                      </Button>
                    </div>
                  </Panel>
                </Collapse>
              </Panel>
              <Panel header="Member Management" key="4" className="bg-[#202020]">
                <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
                  <Panel header="QR Code Check-In" key="1" className="bg-[#252525]">
                    <div className="space-y-6">
                      <Form.Item>
                        <div className="flex items-center">
                          <label className="text-white mr-4">Allow Member Check-In with QR-Code</label>
                          <Switch
                            checked={allowMemberQRCheckIn}
                            onChange={setAllowMemberQRCheckIn}
                          />
                        </div>
                      </Form.Item>

                      {allowMemberQRCheckIn && (
                        <div className="space-y-6 p-4 border border-[#303030] rounded-lg">
                          <div className="flex flex-col items-center space-y-4">
                            <h1 className="text-white text-center text-xl">
                              Member Check-In QR Code
                            </h1>

                            <div className="relative p-4 bg-white rounded-lg">
                              <QRCode
                                value={memberQRCodeUrl || "https://your-studio-app.com/member-checkin"}
                                size={200}
                                level="H"
                                className="qr-code"
                              />
                              {logoUrl && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                  <div className="w-8 h-8 rounded overflow-hidden">
                                    <img
                                      src={logoUrl || "/placeholder.svg"}
                                      alt="Studio Logo"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-4">
                              <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                style={saveButtonStyle}
                                onClick={downloadQRCode}
                              >
                                Download QR Code
                              </Button>

                              <Button
                                icon={<QrcodeOutlined />}
                                style={buttonStyle}
                                onClick={() => window.print()}
                              >
                                Print QR Code
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Panel>
                </Collapse>
              </Panel>
              <Panel header="Lead Sources" key="3" className="bg-[#202020]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg text-white font-medium">Manage Lead Sources</h3>
                    <Button onClick={handleAddLeadSource} icon={<PlusOutlined />} style={saveButtonStyle}>
                      Add Lead Source
                    </Button>
                  </div>
                  {leadSources.map((source, index) => (
                    <div key={source.id} className="flex flex-wrap gap-4 items-center">
                      <Input
                        value={source.name}
                        onChange={(e) => handleUpdateLeadSource(source.id, "name", e.target.value)}
                        style={inputStyle}
                        placeholder="Source name"
                        className="!w-full md:!w-32 lg:!w-90 !py-3"
                      />
                      <ColorPicker
                        value={source.color}
                        onChange={(color) => {
                          const updatedTags = [...tags]
                          updatedTags[index].color = color
                          setTags(updatedTags)
                        }}
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
              <Panel header="TO-DO" key="4" className="bg-[#202020]">
                <div className="space-y-4">
                  <h3 className="text-lg text-white font-medium">To-Do Tags</h3>
                  {tags.map((tag, index) => (
                    <div key={index} className="flex flex-wrap gap-4 items-center">
                      <Input
                        placeholder="Tag Name"
                        value={tag.name}
                        onChange={(e) => {
                          const updatedTags = [...tags]
                          updatedTags[index].name = e.target.value
                          setTags(updatedTags)
                        }}
                        className="!w-full md:!w-32 lg:!w-90 !py-3"
                        style={inputStyle}
                      />
                      <ColorPicker
                        value={tag.color}
                        onChange={(color) => {
                          const updatedTags = [...tags]
                          updatedTags[index].color = color
                          setTags(updatedTags)
                        }}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={handleAddTag}
                    icon={<PlusOutlined />}
                    className="w-full sm:w-auto"
                    style={buttonStyle}
                  >
                    Add Tag
                  </Button>
                </div>
              </Panel>
            </Collapse>
          </TabPane>
          <TabPane tab="Contracts" key="3">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              <Panel header="Contract Settings" key="5" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item
                      label={
                        <div className="flex items-center">
                          <span className="text-white">Allow Member Self-Cancellation</span>
                          <Tooltip title="When enabled, members can cancel their contracts on their own">
                            <InfoCircleOutlined style={tooltipStyle} />
                          </Tooltip>
                        </div>
                      }
                    >
                      <Switch checked={allowMemberSelfCancellation} onChange={setAllowMemberSelfCancellation} />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Default Notice Period (days)</span>}>
                      <InputNumber
                        min={0}
                        value={noticePeriod}
                        onChange={setNoticePeriod}
                        style={inputStyle}
                        className="white-text"
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Default Extension Period (months)</span>}>
                      <InputNumber
                        min={0}
                        value={extensionPeriod}
                        onChange={setExtensionPeriod}
                        style={inputStyle}
                        className="white-text"
                      />
                    </Form.Item>
                  </Form>
                </div>
              </Panel>
              <Panel header="Contract Types" key="1" className="bg-[#202020]">
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
                              className="!w-full md:!w-32 lg:!w-90 white-text"
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
                              className="!w-full md:!w-32 lg:!w-36 white-text"
                            >
                              <Option value="weekly">Weekly</Option>
                              <Option value="monthly">Monthly</Option>
                              <Option value="annually">Annually</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label={
                              <div className="flex items-center">
                                <span className="text-white white-text">User Capacity</span>
                                <Tooltip title="Maximum number of appointments a member can book per billing period">
                                  <InfoCircleOutlined style={tooltipStyle} />
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="white-text">
                              <InputNumber
                                value={type.userCapacity || 0}
                                onChange={(value) => {
                                  const updated = [...contractTypes]
                                  updated[index].userCapacity = value || 0
                                  setContractTypes(updated)
                                }}
                                style={inputStyle}
                                min={0}
                              />
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Based on the {type.billingPeriod} billing period. For example, if set to 4 with weekly
                              billing, members can book 4 appointments per week.
                            </div>
                          </Form.Item>
                          <Form.Item label={<span className="text-white">Automatic Renewal</span>}>
                            <Switch
                              checked={type.autoRenewal || false}
                              onChange={(checked) => {
                                const updated = [...contractTypes]
                                updated[index].autoRenewal = checked
                                setContractTypes(updated)
                              }}
                            />
                          </Form.Item>

                          {type.autoRenewal && (
                            <>
                              <Form.Item label={<span className="text-white">Renewal Period (months)</span>}>
                                <InputNumber
                                  min={1}
                                  value={type.renewalPeriod || 1}
                                  onChange={(value) => {
                                    const updated = [...contractTypes]
                                    updated[index].renewalPeriod = value || 1
                                    setContractTypes(updated)
                                  }}
                                  style={inputStyle}
                                  className="white-text"
                                />
                              </Form.Item>
                              <Form.Item label={<span className="text-white">Price after Renewal</span>}>
                                <InputNumber
                                  value={type.renewalPrice || 0}
                                  onChange={(value) => {
                                    const updated = [...contractTypes]
                                    updated[index].renewalPrice = value || 0
                                    setContractTypes(updated)
                                  }}
                                  style={inputStyle}
                                  className="white-text"
                                  precision={2}
                                />
                              </Form.Item>
                            </>
                          )}

                          <Form.Item label={<span className="text-white">Cancellation Period (days)</span>}>
                            <InputNumber
                              min={0}
                              value={type.cancellationPeriod || 30}
                              onChange={(value) => {
                                const updated = [...contractTypes]
                                updated[index].cancellationPeriod = value || 30
                                setContractTypes(updated)
                              }}
                              style={inputStyle}
                              className="white-text"
                            />
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
              <Panel header="Contract Form" key="2" className="bg-[#202020]">
                <ContractBuilder />
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
                        className="!w-full md:!w-32 lg:!w-90 white-text"
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
                    className="w-full sm:w-auto"
                    style={buttonStyle}
                  >
                    Add Pause Reason
                  </Button>
                </div>
              </Panel>
            </Collapse>
          </TabPane>

          {/* <CHANGE> Communication Tab - Completely Replaced with Settings Modal Logic */}
          <TabPane tab="Communication" key="4">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              <Panel header="General Communication Settings" key="1" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item label={<span className="text-white">Auto-Archive Duration (days)</span>}>
                      <InputNumber
                        min={1}
                        max={365}
                        value={settings.autoArchiveDuration}
                        onChange={(value) => setSettings({ ...settings, autoArchiveDuration: value || 30 })}
                        style={inputStyle}
                        className="white-text"
                      />
                    </Form.Item>
                  </Form>
                </div>
              </Panel>

              {/* <CHANGE> Email and App Notification Sub-Tabs */}
              <Panel header="Notifications" key="2" className="bg-[#202020]">
                <div className="space-y-4">
                  <div className="flex gap-1 mb-4 border-b border-gray-600">
                    <button
                      onClick={() => setSettings({ ...settings, notificationSubTab: "email" })}
                      className={`px-4 py-2 text-sm ${notificationSubTab === "email"
                        ? "bg-blue-500 text-white rounded-t"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      E-Mail Notification
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, notificationSubTab: "app" })}
                      className={`px-4 py-2 text-sm ${notificationSubTab === "app"
                        ? "bg-blue-500 text-white rounded-t"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      App Notification
                    </button>
                  </div>

                  {/* <CHANGE> E-Mail Notification Tab */}
                  {notificationSubTab === "email" && (
                    <div>
                      <div className="mb-6 p-4 bg-[#252525] rounded-lg">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={bool(settings?.emailNotificationEnabled, false)}
                            onChange={(e) =>
                              setSettings({ ...settings, emailNotificationEnabled: e.target.checked })
                            }
                            className="rounded border-gray-600 bg-transparent cursor-pointer w-4 h-4"
                          />
                          <span className="text-sm font-medium text-white text-gray-200">Activate E-Mail Notifications</span>
                        </label>
                      </div>

                      {bool(settings?.emailNotificationEnabled, false) && (
                        <div className="space-y-4 pl-4 border-l-2 border-blue-500">
                          {/* Birthday Message */}
                          <div>
                            <label className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={bool(settings?.birthdayMessageEnabled, false)}
                                onChange={(e) =>
                                  setSettings({ ...settings, birthdayMessageEnabled: e.target.checked })
                                }
                                className="rounded border-gray-600 bg-transparent w-4 h-4"
                              />
                              <span className="text-sm text-gray-300">Send automatic Birthday Messages</span>
                            </label>
                            {bool(settings?.birthdayMessageEnabled, false) && (
                              <div className="ml-6">
                                <div className="flex gap-2 mb-2 flex-wrap">
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Studio_Name",
                                        birthdayTextareaRef,
                                        settings.birthdayMessageTemplate || "",
                                        (value) => setSettings({ ...settings, birthdayMessageTemplate: value }),
                                      )
                                    }
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                  >
                                    Studio Name
                                  </button>
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Member_First_Name",
                                        birthdayTextareaRef,
                                        settings.birthdayMessageTemplate || "",
                                        (value) => setSettings({ ...settings, birthdayMessageTemplate: value }),
                                      )
                                    }
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                  >
                                    Member First Name
                                  </button>
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Member_Last_Name",
                                        birthdayTextareaRef,
                                        settings.birthdayMessageTemplate || "",
                                        (value) => setSettings({ ...settings, birthdayMessageTemplate: value }),
                                      )
                                    }
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                  >
                                    Member Last Name
                                  </button>
                                </div>
                                <textarea
                                  ref={birthdayTextareaRef}
                                  value={settings.birthdayMessageTemplate || ""}
                                  onChange={(e) => setSettings({ ...settings, birthdayMessageTemplate: e.target.value })}
                                  style={inputStyle}
                                  className="w-full rounded-xl text-sm h-20"
                                  placeholder="Happy Birthday, {Member_First_Name} {Member_Last_Name}! Best wishes from {Studio_Name}!"
                                />
                              </div>
                            )}
                          </div>

                          {/* Appointment Notifications */}
                          <div>
                            <label className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={bool(settings?.appointmentNotificationEnabled, false)}
                                onChange={(e) =>
                                  setSettings({ ...settings, appointmentNotificationEnabled: e.target.checked })
                                }
                                className="rounded border-gray-600 bg-transparent w-4 h-4"
                              />
                              <span className="text-sm text-gray-300">Appointment Notifications</span>
                            </label>

                            {bool(settings?.appointmentNotificationEnabled, false) && (
                              <div className="ml-6 space-y-4">
                                {/* Confirmation */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <input
                                      type="checkbox"
                                      checked={conf.enabled}
                                      onChange={(e) =>
                                        setAppointmentNotificationTypes((prev) => ({
                                          ...prev,
                                          confirmation: { ...(prev.confirmation || {}), enabled: e.target.checked },
                                        }))
                                      }
                                      className="rounded border-gray-600 bg-transparent w-4 h-4"
                                    />
                                    <span className="text-sm text-white font-medium">Appointment Confirmation</span>
                                  </div>
                                  {conf.enabled && (
                                    <div className="ml-6">
                                      <div className="flex gap-2 mb-2 flex-wrap">
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Studio_Name",
                                              confirmationTextareaRef,
                                              appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  confirmation: { ...(prev.confirmation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Studio Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Member_First_Name",
                                              confirmationTextareaRef,
                                              appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  confirmation: { ...(prev.confirmation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Member First Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Member_Last_Name",
                                              confirmationTextareaRef,
                                              appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  confirmation: { ...(prev.confirmation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Member Last Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Appointment_Type",
                                              confirmationTextareaRef,
                                              appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  confirmation: { ...(prev.confirmation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Appointment Type
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Booked_Time",
                                              confirmationTextareaRef,
                                              appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  confirmation: { ...(prev.confirmation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Booked Time
                                        </button>
                                      </div>
                                      <textarea
                                        ref={confirmationTextareaRef}
                                        value={appointmentNotificationTypes?.confirmation?.template || ""}
                                        onChange={(e) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            confirmation: { ...(prev.confirmation || {}), template: e.target.value },
                                          }))
                                        }
                                        style={inputStyle}
                                        className="w-full rounded-xl text-sm h-20"
                                        placeholder="Hello {Member_First_Name} {Member_Last_Name}, your {Appointment_Type} has been booked for {Booked_Time}."
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Cancellation */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <input
                                      type="checkbox"
                                      checked={canc.enabled}
                                      onChange={(e) =>
                                        setAppointmentNotificationTypes((prev) => ({
                                          ...prev,
                                          cancellation: { ...(prev.cancellation || {}), enabled: e.target.checked },
                                        }))
                                      }
                                      className="rounded border-gray-600 bg-transparent w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-white">Appointment Cancellation</span>
                                  </div>
                                  {canc.enabled && (
                                    <div className="ml-6">
                                      <div className="flex gap-2 mb-2 flex-wrap">
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Studio_Name",
                                              cancellationTextareaRef,
                                              appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  cancellation: { ...(prev.cancellation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Studio Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Member_First_Name",
                                              cancellationTextareaRef,
                                              appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  cancellation: { ...(prev.cancellation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Member First Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Member_Last_Name",
                                              cancellationTextareaRef,
                                              appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  cancellation: { ...(prev.cancellation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Member Last Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Appointment_Type",
                                              cancellationTextareaRef,
                                              appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  cancellation: { ...(prev.cancellation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Appointment Type
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Booked_Time",
                                              cancellationTextareaRef,
                                              appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  cancellation: { ...(prev.cancellation || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Booked Time
                                        </button>
                                      </div>
                                      <textarea
                                        ref={cancellationTextareaRef}
                                        value={appointmentNotificationTypes?.cancellation?.template || ""}
                                        onChange={(e) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            cancellation: { ...(prev.cancellation || {}), template: e.target.value },
                                          }))
                                        }
                                        style={inputStyle}
                                        className="w-full rounded-xl text-sm h-20"
                                        placeholder="Hello {Member_First_Name} {Member_Last_Name}, your {Appointment_Type} has been cancelled."
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Rescheduled */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <input
                                      type="checkbox"
                                      checked={resch.enabled}
                                      onChange={(e) =>
                                        setAppointmentNotificationTypes((prev) => ({
                                          ...prev,
                                          rescheduled: { ...(prev.rescheduled || {}), enabled: e.target.checked },
                                        }))
                                      }
                                      className="rounded border-gray-600 bg-transparent w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-white">Appointment Rescheduled</span>
                                  </div>
                                  {resch.enabled && (
                                    <div className="ml-6">
                                      <div className="flex gap-2 mb-2 flex-wrap">
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Studio_Name",
                                              rescheduledTextareaRef,
                                              appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  rescheduled: { ...(prev.rescheduled || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Studio Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Member_First_Name",
                                              rescheduledTextareaRef,
                                              appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  rescheduled: { ...(prev.rescheduled || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Member First Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Member_Last_Name",
                                              rescheduledTextareaRef,
                                              appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  rescheduled: { ...(prev.rescheduled || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Member Last Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Appointment_Type",
                                              rescheduledTextareaRef,
                                              appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  rescheduled: { ...(prev.rescheduled || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Appointment Type
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Booked_Time",
                                              rescheduledTextareaRef,
                                              appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  rescheduled: { ...(prev.rescheduled || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Booked Time
                                        </button>
                                      </div>
                                      <textarea
                                        ref={rescheduledTextareaRef}
                                        value={appointmentNotificationTypes?.rescheduled?.template || ""}
                                        onChange={(e) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            rescheduled: { ...(prev.rescheduled || {}), template: e.target.value },
                                          }))
                                        }
                                        style={inputStyle}
                                        className="w-full rounded-xl text-sm h-20"
                                        placeholder="Hello {Member_First_Name} {Member_Last_Name}, your {Appointment_Type} has been rescheduled to {Booked_Time}."
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="border-t border-gray-700 my-4" />

                                {/* Reminder */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <input
                                      type="checkbox"
                                      checked={reminder.enabled}
                                      onChange={(e) =>
                                        setAppointmentNotificationTypes((prev) => ({
                                          ...prev,
                                          reminder: { ...(prev.reminder || {}), enabled: e.target.checked },
                                        }))
                                      }
                                      className="rounded border-gray-600 bg-transparent w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-white">Appointment Reminder</span>
                                  </div>
                                  {reminder.enabled && (
                                    <div className="ml-6">
                                      <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <label className="text-sm text-gray-300">Send reminder</label>
                                        <input
                                          type="number"
                                          min="1"
                                          value={reminder.hoursBefore}
                                          onChange={(e) =>
                                            setAppointmentNotificationTypes((prev) => ({
                                              ...prev,
                                              reminder: {
                                                ...(prev.reminder || {}),
                                                hoursBefore: Number.parseInt(e.target.value || "1", 10),
                                              },
                                            }))
                                          }
                                          style={inputStyle}
                                          className="w-24 rounded text-sm"
                                        />
                                        <span className="text-sm text-gray-300">hours before</span>
                                      </div>

                                      <div className="flex gap-2 mb-2 flex-wrap">
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Studio_Name",
                                              reminderTextareaRef,
                                              appointmentNotificationTypes?.reminder?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  reminder: { ...(prev.reminder || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Studio Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Member_First_Name",
                                              reminderTextareaRef,
                                              appointmentNotificationTypes?.reminder?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  reminder: { ...(prev.reminder || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Member First Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Member_Last_Name",
                                              reminderTextareaRef,
                                              appointmentNotificationTypes?.reminder?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  reminder: { ...(prev.reminder || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Member Last Name
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Appointment_Type",
                                              reminderTextareaRef,
                                              appointmentNotificationTypes?.reminder?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  reminder: { ...(prev.reminder || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Appointment Type
                                        </button>
                                        <button
                                          onClick={() =>
                                            insertVariable(
                                              "Booked_Time",
                                              reminderTextareaRef,
                                              appointmentNotificationTypes?.reminder?.template || "",
                                              (value) =>
                                                setAppointmentNotificationTypes((prev) => ({
                                                  ...prev,
                                                  reminder: { ...(prev.reminder || {}), template: value },
                                                })),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Booked Time
                                        </button>
                                      </div>

                                      <textarea
                                        ref={reminderTextareaRef}
                                        value={appointmentNotificationTypes?.reminder?.template || ""}
                                        onChange={(e) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            reminder: { ...(prev.reminder || {}), template: e.target.value },
                                          }))
                                        }
                                        style={inputStyle}
                                        className="w-full rounded-xl text-sm h-20"
                                        placeholder="Hello {Member_First_Name} {Member_Last_Name}, this is a reminder for your {Appointment_Type} at {Booked_Time}."
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* <CHANGE> App Notification Tab */}
                  {notificationSubTab === "app" && (
                    <div>
                      <div className="mb-6 p-4 bg-[#252525] rounded-lg">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={bool(settings?.appNotificationEnabled, false)}
                            onChange={(e) =>
                              setSettings({ ...settings, appNotificationEnabled: e.target.checked })
                            }
                            className="rounded border-gray-600 bg-transparent cursor-pointer w-4 h-4"
                          />
                          <span className="text-sm font-medium text-white ">Activate App Notifications</span>
                        </label>
                      </div>

                      {bool(settings?.appNotificationEnabled, false) && (
                        <div className="space-y-4 pl-4 border-l-2 border-purple-500">
                          <div>
                            <label className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={bool(settings?.birthdayAppNotificationEnabled, false)}
                                onChange={(e) =>
                                  setSettings({ ...settings, birthdayAppNotificationEnabled: e.target.checked })
                                }
                                className="rounded border-gray-600 bg-transparent w-4 h-4"
                              />
                              <span className="text-sm text-gray-300">Send automatic Birthday Messages</span>
                            </label>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={bool(settings?.appointmentAppNotificationEnabled, false)}
                                onChange={(e) =>
                                  setSettings({ ...settings, appointmentAppNotificationEnabled: e.target.checked })
                                }
                                className="rounded border-gray-600 bg-transparent w-4 h-4"
                              />
                              <span className="text-sm text-gray-300">Appointment Notifications</span>
                            </label>

                            {bool(settings?.appointmentAppNotificationEnabled, false) && (
                              <div className="ml-6 space-y-3">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={bool(settings?.appConfirmationEnabled, false)}
                                    onChange={(e) =>
                                      setSettings({ ...settings, appConfirmationEnabled: e.target.checked })
                                    }
                                    className="rounded border-gray-600 bg-transparent w-4 h-4"
                                  />
                                  <span className="text-sm text-white">Appointment Confirmation</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={bool(settings?.appCancellationEnabled, false)}
                                    onChange={(e) =>
                                      setSettings({ ...settings, appCancellationEnabled: e.target.checked })
                                    }
                                    className="rounded border-gray-600 bg-transparent w-4 h-4"
                                  />
                                  <span className="text-sm text-white">Appointment Cancellation</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={bool(settings?.appRescheduledEnabled, false)}
                                    onChange={(e) =>
                                      setSettings({ ...settings, appRescheduledEnabled: e.target.checked })
                                    }
                                    className="rounded border-gray-600 bg-transparent w-4 h-4"
                                  />
                                  <span className="text-sm text-white">Appointment Rescheduled</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={bool(settings?.appReminderEnabled, false)}
                                    onChange={(e) =>
                                      setSettings({ ...settings, appReminderEnabled: e.target.checked })
                                    }
                                    className="rounded border-gray-600 bg-transparent w-4 h-4"
                                  />
                                  <span className="text-sm text-white">Appointment Reminder</span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Panel>

              {/* <CHANGE> SMTP Setup Panel */}
              <Panel header="SMTP Setup" key="3" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item label={<span className="text-white">SMTP Host</span>}>
                      <Input
                        value={settings.smtpHost}
                        onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                        style={inputStyle}
                        placeholder="smtp.example.com"
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">SMTP Port</span>}>
                      <InputNumber
                        value={settings.smtpPort}
                        onChange={(value) => setSettings({ ...settings, smtpPort: value || 587 })}
                        style={inputStyle}
                        className="white-text"
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Username</span>}>
                      <Input
                        value={settings.smtpUser}
                        onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                        style={inputStyle}
                        placeholder="your-email@example.com"
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Password</span>}>
                      <Input.Password
                        value={settings.smtpPass}
                        onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Form>
                </div>
              </Panel>

              {/* <CHANGE> Email Signature Panel */}
              <Panel header="Email Signature" key="4" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item label={<span className="text-white">Default Email Signature</span>}>
                      <div className="bg-[#222222] rounded-xl">
                        <WysiwygEditor
                          value={settings.emailSignature}
                          onChange={(value) => setSettings({ ...settings, emailSignature: value })}
                          placeholder="Enter your default email signature..."
                        />
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </Panel>

              {/* <CHANGE> Save Settings Button */}
              <div className="mt-6">
                <Button
                  onClick={handleSaveSettings}
                  style={saveButtonStyle}
                  className="w-full"
                >
                  Save Settings
                </Button>
              </div>
            </Collapse>
          </TabPane>

          <TabPane tab="Finances" key="5">
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
                    </Form.Item>
                  </Form>
                </div>
              </Panel>
              <Panel header="VAT Rates" key="2" className="bg-[#202020]">
                <div className="space-y-4 white-text">
                  {vatRates.map((rate, index) => (
                    <div key={index} className="flex flex-wrap gap-4 items-center">
                      <Input
                        placeholder="VAT Name (e.g. Standard, Reduced)"
                        value={rate.name}
                        onChange={(e) => {
                          const updatedRates = [...vatRates]
                          updatedRates[index].name = e.target.value
                          setVatRates(updatedRates)
                        }}
                        className="!w-full md:!w-32 lg:!w-90 white-text"
                        style={inputStyle}
                      />
                      <InputNumber
                        placeholder="Rate (%)"
                        value={rate.percentage}
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                        onChange={(value) => {
                          const updatedRates = [...vatRates]
                          updatedRates[index].percentage = value || 0
                          setVatRates(updatedRates)
                        }}
                        className="w-full sm:w-32"
                        style={inputStyle}
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={rate.description}
                        onChange={(e) => {
                          const updatedRates = [...vatRates]
                          updatedRates[index].description = e.target.value
                          setVatRates(updatedRates)
                        }}
                        className="w-full sm:flex-1"
                        style={inputStyle}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => setVatRates(vatRates.filter((_, i) => i !== index))}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={handleAddVatRate}
                    icon={<PlusOutlined />}
                    className="w-full sm:w-auto"
                    style={buttonStyle}
                  >
                    Add VAT Rate
                  </Button>
                </div>
              </Panel>
              <Panel header="Payment Settings" key="3" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item label={<span className="text-white">Creditor ID</span>}>
                      <Input
                        value={creditorId}
                        onChange={(e) => setCreditorId(e.target.value)}
                        placeholder="Enter Creditor ID"
                        style={inputStyle}
                        maxLength={50}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">VAT Number</span>}>
                      <Input
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        placeholder="Enter VAT number"
                        style={inputStyle}
                        maxLength={30}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Bank Name</span>}>
                      <Input
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Enter bank name"
                        style={inputStyle}
                        maxLength={50}
                      />
                    </Form.Item>
                  </Form>
                </div>
              </Panel>
            </Collapse>
          </TabPane>
          <TabPane tab="Appearance" key="6">
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
                    <Form.Item label={<span className="text-white">Allow Staff to Toggle Theme</span>}>
                      <Switch
                        checked={appearance.allowStaffThemeToggle}
                        onChange={(checked) => setAppearance({ ...appearance, allowStaffThemeToggle: checked })}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Allow Member to Toggle Theme</span>}>
                      <Switch
                        checked={appearance.allowMemberThemeToggle}
                        onChange={(checked) => setAppearance({ ...appearance, allowMemberThemeToggle: checked })}
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
                          <SettingOutlined />
                        </div>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </Panel>
            </Collapse>
          </TabPane>
          <TabPane
            tab={
              <span>
                Importing
              </span>
            }
            key="7"
          >
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] text-white border-[#303030]">
              <Panel header="Data Import" key="1" className="bg-[#202020]">
                <div className="space-y-6">
                  <Alert
                    message="Import Data from Other Platforms"
                    description="You can import your existing data from other fitness studio platforms. This will help you migrate all important files like member data, contracts, leads, and more."
                    type="info"
                    showIcon
                    style={{ backgroundColor: "#202020", border: "1px solid #303030" }}
                  />

                  <div className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-[#303030] rounded-lg">
                      <h1 className="text-white mb-4 text-xl">
                        <TeamOutlined className="mr-2" />
                        Member Data
                      </h1>
                      <p className="text-gray-400 mb-4">
                        Import member profiles, contact information, and membership details
                      </p>
                      <Upload
                        accept=".csv,.xlsx,.xls"
                        beforeUpload={(file) => {
                          notification.info({
                            message: "Member Data Import",
                            description: `Preparing to import ${file.name}`
                          })
                          return false
                        }}
                      >
                        <Button icon={<UploadOutlined />} style={buttonStyle}>
                          Upload Member Data
                        </Button>
                      </Upload>
                    </div>

                    <div className="p-4 border border-[#303030] rounded-lg">
                      <h2 className="text-white mb-4 text-xl">
                        <FileProtectOutlined className="mr-2" />
                        Contracts
                      </h2>
                      <p className="text-gray-400 mb-4">
                        Import contract templates, terms, and existing member contracts
                      </p>
                      <Upload
                        accept=".pdf,.doc,.docx,.csv"
                        beforeUpload={(file) => {
                          notification.info({
                            message: "Contracts Import",
                            description: `Preparing to import ${file.name}`
                          })
                          return false
                        }}
                      >
                        <Button icon={<UploadOutlined />} style={buttonStyle}>
                          Upload Contracts
                        </Button>
                      </Upload>
                    </div>

                    <div className="p-4 border border-[#303030] rounded-lg">
                      <h1 className="text-white mb-4 text-xl">
                        <UserAddOutlined className="mr-2" />
                        Leads
                      </h1>
                      <p className="text-gray-400 mb-4">
                        Import lead information, contact details, and lead sources
                      </p>
                      <Upload
                        accept=".csv,.xlsx,.xls"
                        beforeUpload={(file) => {
                          notification.info({
                            message: "Leads Import",
                            description: `Preparing to import ${file.name}`
                          })
                          return false
                        }}
                      >
                        <Button icon={<UploadOutlined />} style={buttonStyle}>
                          Upload Leads
                        </Button>
                      </Upload>
                    </div>

                    <div className="p-4 border border-[#303030] rounded-lg">
                      <h1 className="text-white mb-4 text-xl">
                        <FileTextOutlined className="mr-2" />
                        Additional Files
                      </h1>
                      <p className="text-gray-400 mb-4">
                        Import other important documents and studio data
                      </p>
                      <Upload
                        accept=".pdf,.doc,.docx,.xlsx,.csv,.zip"
                        beforeUpload={(file) => {
                          notification.info({
                            message: "Additional Files Import",
                            description: `Preparing to import ${file.name}`
                          })
                          return false
                        }}
                      >
                        <Button icon={<UploadOutlined />} style={buttonStyle}>
                          Upload Additional Files
                        </Button>
                      </Upload>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-[#252525] rounded-lg">
                    <h1 className="text-white mb-2 text-xl">
                      Import Instructions
                    </h1>
                    <ul className="text-gray-400 list-disc list-inside space-y-2">
                      <li>Ensure your files are in supported formats (CSV, Excel, PDF, Word)</li>
                      <li>Backup your current data before importing</li>
                      <li>Large imports may take several minutes to process</li>
                      <li>Review imported data for accuracy after completion</li>
                      <li>Contact support if you encounter any issues during import</li>
                    </ul>
                  </div>
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
      </div>

      <PermissionModal
        visible={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
        role={selectedRoleIndex !== null ? roles[selectedRoleIndex] : null}
        onPermissionChange={handlePermissionChange}
      />
    </>
  )
}

export default ConfigurationPage