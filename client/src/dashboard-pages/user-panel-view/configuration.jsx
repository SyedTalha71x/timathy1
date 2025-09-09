
import { Checkbox, Row } from "antd"
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
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
} from "@ant-design/icons"
import VariablePicker from "../../components/variable-picker" // Assuming VariablePicker is in components folder
import defaultLogoUrl from '../../../public/default-avatar.avif'

const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input
const { Panel } = Collapse
const { RangePicker } = DatePicker

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
const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  backgroundColor: "#202020",
  borderRadius: "8px",
  marginBottom: "16px",
  cursor: "default",
}
const tooltipStyle = {
  marginLeft: "8px",
  color: "rgba(255, 255, 255, 0.5)",
}

const ConfigurationPage = () => {
  // Add near other state variables
const [allowMemberSelfCancellation, setAllowMemberSelfCancellation] = useState(true);

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
  const [logoUrl, setLogoUrl] = useState("") // New state to store logo URL
  const [roles, setRoles] = useState([])
  const [appointmentTypes, setAppointmentTypes] = useState([]) // Added images array to each type
  const [tags, setTags] = useState([])
  const [contractStatuses, setContractStatuses] = useState([])
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
  const [holidaysDialogVisible, setHolidaysDialogVisible] = useState(false)

  // Communication Configuration States (updated and new)
  const [autoArchiveDuration, setAutoArchiveDuration] = useState(30)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [chatNotifications, setChatNotifications] = useState(true)
  const [studioChatNotifications, setStudioChatNotifications] = useState(true)
  const [memberChatNotifications, setMemberChatNotifications] = useState(true)
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
      enabled: true, // Added enabled field
    },
    {
      type: "cancellation",
      title: "Appointment Cancellation",
      message: "Hello {Member_Name}, your {Appointment_Type} scheduled for {Booked_Time} has been cancelled.",
      sendVia: ["email", "platform"],
      enabled: true, // Added enabled field
    },
    {
      type: "rescheduled",
      title: "Appointment Rescheduled",
      message: "Hello {Member_Name}, your {Appointment_Type} has been rescheduled to {Booked_Time}.",
      sendVia: ["email", "platform"],
      enabled: true, // Added enabled field
    },
  ])
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: "",
    smtpPort: 587,
    emailAddress: "",
    password: "",
    useSSL: false,
    senderName: "",
    smtpUser: "", // Added from reference
    smtpPass: "", // Added from reference
  })
  const [leadProspectCategories, setLeadProspectCategories] = useState([])
  const [vatRates, setVatRates] = useState([
    { name: "Standard", percentage: 19, description: "Standard VAT rate" },
    {
      name: "Reduced",
      percentage: 7,
      description: "Reduced VAT rate for essential goods",
    },
  ])
  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "dark",
    primaryColor: "#FF843E",
    secondaryColor: "#1890ff",
    allowUserThemeToggle: true,
  })

  // Lead Sources (new state)
  const [leadSources, setLeadSources] = useState([
    { id: 1, name: "Website" },
    { id: 2, name: "Referral" },
  ])
  const nextLeadSourceId = useRef(leadSources.length > 0 ? Math.max(...leadSources.map((s) => s.id)) + 1 : 1)


  // Fetch public holidays when country changes
  useEffect(() => {
    if (studioCountry) {
      fetchPublicHolidays(studioCountry)
      // Set currency based on country
      const selectedCountry = countries.find((c) => c.code === studioCountry)
      if (selectedCountry) {
        setCurrency(selectedCountry.currency)
      }
    }
  }, [studioCountry])

  // Function to fetch public holidays based on country
  const fetchPublicHolidays = async (countryCode) => {
    if (!countryCode) return
    setIsLoadingHolidays(true)
    try {
      // Using Nager.Date API for public holidays
      const currentYear = new Date().getFullYear()
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/${countryCode}`)
      if (!response.ok) {
        throw new Error("Failed to fetch holidays")
      }
      const data = await response.json()
      // Process the holidays data
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

  // Function to add public holidays to closing days
  const addPublicHolidaysToClosingDays = (holidaysToProcess = publicHolidays) => {
    if (holidaysToProcess.length === 0) {
      notification.warning({
        message: "No Holidays Available",
        description: "Please select a country first to load public holidays.",
      })
      return
    }
    // Filter out holidays that are already in closing days
    const existingDates = closingDays.map((day) => day.date?.format("YYYY-MM-DD"))
    const newHolidays = holidaysToProcess.filter((holiday) => !existingDates.includes(holiday.date))
    if (newHolidays.length === 0) {
      notification.info({
        message: "No New Holidays",
        description: "All public holidays are already added to closing days.",
      })
      return
    }
    // Add new holidays to closing days - using dayjs directly instead of DatePicker.dayjs
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

  const renderSectionHeader = (title) => (
    <div style={sectionHeaderStyle}>
      <h3 className="text-lg font-medium m-0">{title}</h3>
    </div>
  )

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
    setRoles([...roles, { name: "", permissions: [] }])
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
        images: [], // Initialize with empty array for images
      },
    ])
  }

  const handleAddTag = () => {
    setTags([...tags, { name: "", color: "#1890ff" }])
  }

  const handleAddContractStatus = () => {
    setContractStatuses([...contractStatuses, { name: "" }])
  }

  const handleAddContractPauseReason = () => {
    setContractPauseReasons([...contractPauseReasons, { name: "", maxDays: 30 }])
  }

  const handleRemoveContractPauseReason = (index) => {
    setContractPauseReasons(contractPauseReasons.filter((_, i) => i !== index))
  }

  const validateClosingDays = () => {
    // Check for duplicate dates
    const dates = closingDays.map((day) => day.date?.format("YYYY-MM-DD")).filter(Boolean)
    const uniqueDates = new Set(dates)
    if (dates.length !== uniqueDates.size) {
      notification.warning({
        message: "Duplicate Dates",
        description: "You have duplicate dates in your closing days. Please remove duplicates.",
      })
      return false
    }
    // Check for missing descriptions
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
        autoRenewal: false, // Add this
        renewalPeriod: 1, // Add this (in months)
        renewalPrice: 0, // Add this
        cancellationPeriod: 30, // Add this (in days)
      },
    ])
  }

  const handleLogoUpload = (info) => {
    if (info.file.status === "uploading") {
      return
    }
    
    if (info.file.status === "done" || info.file) {
      // Create a URL for the uploaded file to display it
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

  const handleAddContractSection = () => {
    setContractSections([
      ...contractSections,
      {
        title: "",
        content: "",
        editable: true,
        requiresAgreement: true,
      },
    ])
  }

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

  const handleViewBlankContract = () => {
    console.log("check handle view blank contract")
  }

  const testEmailConnection = () => {
    console.log("Test Email connection", emailConfig)
    notification.info({
      message: "Test Connection",
      description: "Attempting to connect to SMTP server...",
    })
  }

  const handleAddLeadProspectCategory = () => {
    setLeadProspectCategories([...leadProspectCategories, { name: "", circleColor: "#1890ff" }])
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

  // Lead Sources Handlers
  const handleAddLeadSource = () => {
    setLeadSources([...leadSources, { id: nextLeadSourceId.current++, name: "" }])
  }

  const handleUpdateLeadSource = (id, field, value) => {
    setLeadSources(leadSources.map((source) => (source.id === id ? { ...source, [field]: value } : source)))
  }

  const handleRemoveLeadSource = (id) => {
    setLeadSources(leadSources.filter((source) => source.id !== id))
  }

  // Basic text formatting for contract sections
  const applyFormatting = (index, formatType) => {
    const textarea = document.getElementById(`contract-content-textarea-${index}`)
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    let formattedText = selectedText

    switch (formatType) {
      case "bold":
        formattedText = `<strong>${selectedText}</strong>`
        break
      case "italic":
        formattedText = `<em>${selectedText}</em>`
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        break
      default:
        break
    }

    const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end)
    const updated = [...contractSections]
    updated[index].content = newContent
    setContractSections(updated)

    // Restore selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
    }, 0)
  }

  const renderHtmlContent = (htmlString) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} className="prose prose-invert max-w-none" />
  }

  return (
    <div className=" w-full mx-auto lg:p-10 p-5 rounded-3xl space-y-8 bg-[#181818] min-h-screen text-white">
      <h1 className="lg:text-3xl text-2xl font-bold oxanium_font">Studio Configuration</h1>
      <Tabs defaultActiveKey="1" style={{ color: "white" }}>
        <TabPane tab="Studio Data" key="1">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
          <Panel header="Studio Information" key="1" className="bg-[#202020]">
  <Form layout="vertical" className="space-y-4">
    
    {/* Logo Display Section - Added above all other fields */}
    <div className="flex justify-center mb-8">
      <div className="flex flex-col items-center space-y-4">
        {/* Logo Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden  shadow-lg">
          <img
            src={logoUrl || defaultLogoUrl}
            alt="Studio Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultLogoUrl; // Fallback to default if image fails to load
            }}
          />
        </div>
        {/* Upload Logo Button */}
        <Upload 
          accept="image/*" 
          maxCount={1} 
          onChange={handleLogoUpload} 
          fileList={logo}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />} style={buttonStyle}>
            {logo.length > 0 ? 'Change Logo' : 'Upload Logo'}
          </Button>
        </Upload>
        {logo.length > 0 && (
          <Button 
            type="text" 
            danger 
            size="small"
            onClick={() => {
              setLogo([]);
              setLogoUrl('');
            }}
          >
            Remove Logo
          </Button>
        )}
      </div>
    </div>

    {/* Row 1: Studio Name & Studio Operator */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Form.Item label={<span className="text-white">Studio Name</span>} required>
        <Input
          value={studioName}
          onChange={(e) => setStudioName(e.target.value)}
          placeholder="Enter studio name"
          style={inputStyle}
          maxLength={50}   // 👈 Limit characters
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
      // Extra safety: strip non-digits if pasted
      const onlyDigits = e.target.value.replace(/\D/g, "");
      setStudioPhoneNo(onlyDigits);
    }}
    onKeyPress={(e) => {
      // Block typing anything except digits
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
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
              {country.name} ({country.currency})
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>

    {/* Row 5: Website only (Logo section moved to top) */}
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
    onChange={(e) =>
      handleUpdateAppointmentType(index, "name", e.target.value)
    }
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
                        {/* New: Upload Pictures for Appointment Type */}
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
                <Panel header="Staff Roles" key="1" className="bg-[#252525]">
                  <div className="space-y-4">
                    {roles.map((role, index) => (
                      <div key={index} className="flex flex-wrap gap-4 items-center">
                        <Input
                          placeholder="Role Name"
                          value={role.name}
                          onChange={(e) => {
                            const updatedRoles = [...roles]
                            updatedRoles[index].name = e.target.value
                            setRoles(updatedRoles)
                          }}
                          className="!w-full md:!w-32 lg:!w-90 !py-3.5"
                          style={inputStyle}
                        />
                        <Select
                          mode="multiple"
                          placeholder="Select Permissions"
                          value={role.permissions}
                          onChange={(value) => {
                            const updatedRoles = [...roles]
                            updatedRoles[index].permissions = value
                            setRoles(updatedRoles)
                          }}
                          className="!w-full !rounded-lg md:!w-32 lg:!w-90 !py-2.5 sm:flex-1"
                          style={selectStyle}
                        >
                          <Option value="read">Read</Option>
                          <Option value="write">Write</Option>
                          <Option value="delete">Delete</Option>
                        </Select>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => setRoles(roles.filter((_, i) => i !== index))}
                          className="w-full sm:w-auto"
                          style={buttonStyle}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={handleAddRole}
                      icon={<PlusOutlined />}
                      className="w-full sm:w-auto"
                      style={buttonStyle}
                    >
                      Add Role
                    </Button>
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
            <Panel header="TO-DO" key="4" className="bg-[#202020]">
              <div className="space-y-4">
                <h3 className="text-lg text-white font-medium">TO-DO Tags</h3>
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
        <Switch
          checked={allowMemberSelfCancellation}
          onChange={setAllowMemberSelfCancellation}
        />
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
                              // addonAfter={currency}
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
      const updated = [...contractTypes];
      updated[index].autoRenewal = checked;
      setContractTypes(updated);
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
          const updated = [...contractTypes];
          updated[index].renewalPeriod = value || 1;
          setContractTypes(updated);
        }}
        style={inputStyle}
        className="white-text"
      />
    </Form.Item>
    <Form.Item label={<span className="text-white">Renewal Price</span>}>
      <InputNumber
        value={type.renewalPrice || 0}
        onChange={(value) => {
          const updated = [...contractTypes];
          updated[index].renewalPrice = value || 0;
          setContractTypes(updated);
        }}
        style={inputStyle}
        className="white-text"
        precision={2}
        // addonAfter={currency}
      />
    </Form.Item>
  </>
)}

<Form.Item label={<span className="text-white">Cancellation Period (days)</span>}>
  <InputNumber
    min={0}
    value={type.cancellationPeriod || 30}
    onChange={(value) => {
      const updated = [...contractTypes];
      updated[index].cancellationPeriod = value || 30;
      setContractTypes(updated);
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
                          <div className="flex gap-2 mb-2">
                            <Button
                              icon={<BoldOutlined />}
                              onClick={() => applyFormatting(index, "bold")}
                              style={buttonStyle}
                              size="small"
                            />
                            <Button
                              icon={<ItalicOutlined />}
                              onClick={() => applyFormatting(index, "italic")}
                              style={buttonStyle}
                              size="small"
                            />
                            <Button
                              icon={<UnderlineOutlined />}
                              onClick={() => applyFormatting(index, "underline")}
                              style={buttonStyle}
                              size="small"
                            />
                          </div>
                          <TextArea
                            id={`contract-content-textarea-${index}`}
                            className="resize-none"
                            value={section.content}
                            onChange={(e) => {
                              const updated = [...contractSections]
                              updated[index].content = e.target.value
                              setContractSections(updated)
                            }}
                            rows={8}
                            style={inputStyle}
                          />
                          <div className="mt-4 p-3 border border-[#303030] rounded-md bg-[#101010]">
                            <h4 className="text-white text-sm mb-2">Preview:</h4>
                            {renderHtmlContent(section.content)}
                          </div>
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
            <Panel header="Additional Documents" key="4" className="bg-[#202020]">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-white font-medium">Additional Documents</h3>
                  {/* <Button onClick={handleViewBlankContract} style={buttonStyle}>
                    View Blank Contract
                  </Button> */}
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
        <TabPane tab="Communication" key="4">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
            <Panel header="General Communication Settings" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Auto-Archive Duration (days)</span>}>
                    <InputNumber
                      min={1}
                      max={365}
                      value={autoArchiveDuration}
                      onChange={(value) => setAutoArchiveDuration(value || 30)}
                      style={inputStyle}
                      className="white-text"
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Notifications</span>}>
                    <Space direction="vertical">
                      <Checkbox checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)}>
                        Email Notifications
                      </Checkbox>
                      <Checkbox checked={chatNotifications} onChange={(e) => setChatNotifications(e.target.checked)}>
                        General Chat Notifications
                      </Checkbox>
                      <Checkbox
                        checked={studioChatNotifications}
                        onChange={(e) => setStudioChatNotifications(e.target.checked)}
                      >
                        Studio Chat Notifications
                      </Checkbox>
                      <Checkbox
                        checked={memberChatNotifications}
                        onChange={(e) => setMemberChatNotifications(e.target.checked)}
                      >
                        Member Chat Notifications
                      </Checkbox>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            </Panel>
            <Panel header="Email Signature" key="2" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Default Email Signature</span>}>
                    <div className="bg-[#222222] rounded-xl">
                      <div className="flex items-center gap-2 p-2 border-b border-gray-700">
                        <Button
                          onClick={() => {
                            const textarea = document.getElementById("email-signature-textarea")
                            if (textarea) {
                              const start = textarea.selectionStart
                              const end = textarea.selectionEnd
                              const selectedText = textarea.value.substring(start, end)
                              const newText =
                                textarea.value.substring(0, start) +
                                `<strong>${selectedText}</strong>` +
                                textarea.value.substring(end)
                              setEmailSignature(newText)
                              setTimeout(() => {
                                textarea.focus()
                                textarea.setSelectionRange(
                                  start + `<strong>`.length + selectedText.length,
                                  start + `<strong>`.length + selectedText.length,
                                )
                              }, 0)
                            }
                          }}
                          className="p-1 hover:bg-gray-600 rounded text-sm font-bold"
                          style={buttonStyle}
                          icon={<BoldOutlined />}
                        />
                        <Button
                          onClick={() => {
                            const textarea = document.getElementById("email-signature-textarea")
                            if (textarea) {
                              const start = textarea.selectionStart
                              const end = textarea.selectionEnd
                              const selectedText = textarea.value.substring(start, end)
                              const newText =
                                textarea.value.substring(0, start) +
                                `<em>${selectedText}</em>` +
                                textarea.value.substring(end)
                              setEmailSignature(newText)
                              setTimeout(() => {
                                textarea.focus()
                                textarea.setSelectionRange(
                                  start + `<em>`.length + selectedText.length,
                                  start + `<em>`.length + selectedText.length,
                                )
                              }, 0)
                            }
                          }}
                          className="p-1 hover:bg-gray-600 rounded text-sm italic"
                          style={buttonStyle}
                          icon={<ItalicOutlined />}
                        />
                        <Button
                          onClick={() => {
                            const textarea = document.getElementById("email-signature-textarea")
                            if (textarea) {
                              const start = textarea.selectionStart
                              const end = textarea.selectionEnd
                              const selectedText = textarea.value.substring(start, end)
                              const newText =
                                textarea.value.substring(0, start) +
                                `<u>${selectedText}</u>` +
                                textarea.value.substring(end)
                              setEmailSignature(newText)
                              setTimeout(() => {
                                textarea.focus()
                                textarea.setSelectionRange(
                                  start + `<u>`.length + selectedText.length,
                                  start + `<u>`.length + selectedText.length,
                                )
                              }, 0)
                            }
                          }}
                          className="p-1 hover:bg-gray-600 rounded text-sm underline"
                          style={buttonStyle}
                          icon={<UnderlineOutlined />}
                        />
                      </div>
                      <TextArea
                        id="email-signature-textarea"
                        value={emailSignature}
                        onChange={(e) => setEmailSignature(e.target.value)}
                        className="w-full bg-transparent text-white px-4 py-2 text-sm h-24 resize-none focus:outline-none"
                        placeholder="Enter your default email signature..."
                        style={inputStyle}
                      />
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </Panel>
            <Panel header="SMTP Setup" key="3" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white white-text">SMTP Server</span>}>
                    <Input
                      value={emailConfig.smtpServer}
                      onChange={(e) =>
                        setEmailConfig({
                          ...emailConfig,
                          smtpServer: e.target.value,
                        })
                      }
                      className="!w-full md:!w-32 lg:!w-90 white-text"
                      style={inputStyle}
                      placeholder="smtp.example.com"
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white white-text">SMTP Port</span>}>
                    <div className="white-text">
                      <InputNumber
                        value={emailConfig.smtpPort}
                        onChange={(value) =>
                          setEmailConfig({
                            ...emailConfig,
                            smtpPort: value || 587,
                          })
                        }
                        style={inputStyle}
                        placeholder="587"
                      />
                    </div>
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Email Address (Username)</span>}>
                    <Input
                      value={emailConfig.smtpUser} // Changed to smtpUser
                      onChange={(e) =>
                        setEmailConfig({
                          ...emailConfig,
                          smtpUser: e.target.value,
                        })
                      }
                      className="!w-full md:!w-32 lg:!w-90 white-text"
                      style={inputStyle}
                      placeholder="studio@example.com"
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white white-text">Password</span>}>
                    <Input.Password
                      value={emailConfig.smtpPass} // Changed to smtpPass
                      onChange={(e) =>
                        setEmailConfig({
                          ...emailConfig,
                          smtpPass: e.target.value,
                        })
                      }
                      className="!w-full md:!w-32 lg:!w-90 white-text"
                      style={inputStyle}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Use SSL/TLS</span>}>
                    <Switch
                      checked={emailConfig.useSSL}
                      onChange={(checked) =>
                        setEmailConfig({
                          ...emailConfig,
                          useSSL: checked,
                        })
                      }
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Default Sender Name</span>}>
                    <Input
                      value={emailConfig.senderName}
                      onChange={(e) =>
                        setEmailConfig({
                          ...emailConfig,
                          senderName: e.target.value,
                        })
                      }
                      className="!w-full md:!w-32 lg:!w-90 white-text"
                      style={inputStyle}
                      placeholder="Your Studio Name"
                    />
                  </Form.Item>
                  <Button type="primary" style={buttonStyle} onClick={testEmailConnection}>
                    Test Connection
                  </Button>
                </Form>
              </div>
            </Panel>
            <Panel header="Birthday Messages" key="4" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Enable Birthday Messages</span>}>
                    <Switch
                      checked={birthdayMessage.enabled}
                      onChange={(checked) =>
                        setBirthdayMessage({
                          ...birthdayMessage,
                          enabled: checked,
                        })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <div className="flex items-center">
                        <span className="text-white">Message Template</span>
                        <Tooltip title="Available variables: {Studio_Name}, {Member_Name}">
                          <InfoCircleOutlined style={tooltipStyle} />
                        </Tooltip>
                      </div>
                    }
                  >
                    {/* Variable picker for Birthday Messages */}
                    <VariablePicker
                      variables={[
                        { label: "Studio Name", value: "{Studio_Name}" },
                        { label: "Member Name", value: "{Member_Name}" },
                      ]}
                      onInsert={(variable) => {
                        const textarea = document.getElementById("birthday-message-textarea")
                        if (textarea) {
                          const start = textarea.selectionStart
                          const end = textarea.selectionEnd
                          const text = birthdayMessage.message
                          const newText = text.substring(0, start) + variable + text.substring(end)
                          setBirthdayMessage({
                            ...birthdayMessage,
                            message: newText,
                          })
                          // Focus and set cursor position after the inserted variable
                          setTimeout(() => {
                            textarea.focus()
                            textarea.setSelectionRange(start + variable.length, start + variable.length)
                          }, 0)
                        } else {
                          setBirthdayMessage({
                            ...birthdayMessage,
                            message: birthdayMessage.message + variable,
                          })
                        }
                      }}
                    />
                    <TextArea
                      id="birthday-message-textarea"
                      value={birthdayMessage.message}
                      onChange={(e) =>
                        setBirthdayMessage({
                          ...birthdayMessage,
                          message: e.target.value,
                        })
                      }
                      className="resize-none"
                      rows={4}
                      style={inputStyle}
                      placeholder="Use {Studio_Name} and {Member_Name} as placeholders"
                      disabled={!birthdayMessage.enabled}
                    />
                  </Form.Item>
                </Form>
              </div>
            </Panel>
            <Panel header="Broadcast Messages" key="5" className="bg-[#202020]">
              <div className="space-y-4">
                {broadcastMessages.map((message, index) => (
                  <Collapse key={index} className="border border-[#303030] rounded-lg overflow-hidden">
                    <Panel header={message.title || "New Broadcast Message"} key="1" className="bg-[#252525]">
                      <Form layout="vertical">
                        <Form.Item label={<span className="text-white">Title</span>}>
                          <Input
                            value={message.title}
                            onChange={(e) => handleUpdateBroadcastMessage(index, "title", e.target.value)}
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <div className="flex items-center">
                              <span className="text-white">Message</span>
                              <Tooltip title="Available variables: {Studio_Name}, {Member_Name}">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                          }
                        >
                          {/* Variable picker for Broadcast Messages */}
                          <VariablePicker
                            variables={[
                              { label: "Studio Name", value: "{Studio_Name}" },
                              { label: "Member Name", value: "{Member_Name}" },
                            ]}
                            onInsert={(variable) => {
                              const textarea = document.getElementById(`broadcast-message-textarea-${index}`)
                              if (textarea) {
                                const start = textarea.selectionStart
                                const end = textarea.selectionEnd
                                const text = message.message
                                const newText = text.substring(0, start) + variable + text.substring(end)
                                handleUpdateBroadcastMessage(index, "message", newText)
                                // Focus and set cursor position after the inserted variable
                                setTimeout(() => {
                                  textarea.focus()
                                  textarea.setSelectionRange(start + variable.length, start + variable.length)
                                }, 0)
                              } else {
                                handleUpdateBroadcastMessage(index, "message", message.message + variable)
                              }
                            }}
                          />
                          <TextArea
                            className="resize-none"
                            id={`broadcast-message-textarea-${index}`}
                            value={message.message}
                            onChange={(e) => handleUpdateBroadcastMessage(index, "message", e.target.value)}
                            rows={4}
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white">Send Via</span>}>
                          <Checkbox.Group
                            options={[
                              { label: "Email", value: "email" },
                              { label: "Platform Chat", value: "platform" },
                            ]}
                            value={message.sendVia}
                            onChange={(values) => handleUpdateBroadcastMessage(index, "sendVia", values)}
                          />
                        </Form.Item>
                      </Form>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveBroadcastMessage(index)}
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </Panel>
                  </Collapse>
                ))}
                <Button
                  type="dashed"
                  onClick={handleAddBroadcastMessage}
                  icon={<PlusOutlined />}
                  className="w-full sm:w-auto"
                  style={buttonStyle}
                >
                  Add Broadcast Message
                </Button>
              </div>
            </Panel>
            <Panel header="Appointment Notifications" key="6" className="bg-[#202020]">
              <div className="space-y-4">
                {appointmentNotifications.map((notification, index) => (
                  <Collapse key={index} className="border border-[#303030] rounded-lg overflow-hidden">
                    <Panel header={notification.title || "New Notification"} key="1" className="bg-[#252525]">
                      <Form layout="vertical">
                        <Form.Item label={<span className="text-white">Enable Notification</span>}>
                          <Switch
                            checked={notification.enabled}
                            onChange={(checked) => handleUpdateAppointmentNotification(index, "enabled", checked)}
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <div className="flex items-center">
                              <span className="text-white">Message</span>
                              <Tooltip title="Available variables: {Studio_Name}, {Member_Name}, {Appointment_Type}, {Booked_Time}">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                          }
                        >
                          {/* Variable picker for Appointment Notifications with additional variables */}
                          <VariablePicker
                            variables={[
                              { label: "Studio Name", value: "{Studio_Name}" },
                              { label: "Member Name", value: "{Member_Name}" },
                              { label: "Appointment Type", value: "{Appointment_Type}" },
                              { label: "Booked Time", value: "{Booked_Time}" },
                            ]}
                            onInsert={(variable) => {
                              const textarea = document.getElementById(`appointment-message-textarea-${index}`)
                              if (textarea) {
                                const start = textarea.selectionStart
                                const end = textarea.selectionEnd
                                const text = notification.message
                                const newText = text.substring(0, start) + variable + text.substring(end)
                                handleUpdateAppointmentNotification(index, "message", newText)
                                // Focus and set cursor position after the inserted variable
                                setTimeout(() => {
                                  textarea.focus()
                                  textarea.setSelectionRange(start + variable.length, start + variable.length)
                                }, 0)
                              } else {
                                handleUpdateAppointmentNotification(index, "message", notification.message + variable)
                              }
                            }}
                          />
                          <TextArea
                            id={`appointment-message-textarea-${index}`}
                            value={notification.message}
                            onChange={(e) => handleUpdateAppointmentNotification(index, "message", e.target.value)}
                            rows={4}
                            style={inputStyle}
                            disabled={!notification.enabled}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white">Send Via</span>}>
                          <Checkbox.Group
                            options={[
                              { label: "Email", value: "email" },
                              { label: "Platform Chat", value: "platform" },
                            ]}
                            value={notification.sendVia}
                            onChange={(values) => handleUpdateAppointmentNotification(index, "sendVia", values)}
                            disabled={!notification.enabled}
                          />
                        </Form.Item>
                      </Form>
                    </Panel>
                  </Collapse>
                ))}
              </div>
            </Panel>
            <Panel header="Default Broadcast Distribution" key="7" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Default Broadcast Distribution</span>}>
                    <Space direction="vertical">
                      <Checkbox checked={broadcastEmail} onChange={(e) => setBroadcastEmail(e.target.checked)}>
                        Email
                      </Checkbox>
                      <Checkbox checked={broadcastChat} onChange={(e) => setBroadcastChat(e.target.checked)}>
                        Chat Notification
                      </Checkbox>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            </Panel>
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
                    <div className="text-xs text-gray-400 mt-1">
                      You can now manually select your preferred currency regardless of country selection
                    </div>
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
              <div className="mt-4">
                <p className="text-sm text-gray-400">
                  VAT rates defined here will be available as options in the "Selling" menu's shopping basket.
                </p>
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
                        <SettingOutlined />
                      </div>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </Panel>
            <Panel header="Preview" key="2" className="bg-[#202020]">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-white">Theme Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg border border-[#303030] bg-white">
                    <h4 className="text-black font-medium mb-3">Light Mode</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button style={{ backgroundColor: appearance.primaryColor, color: "white", border: "none" }}>
                        Primary Button
                      </Button>
                      <Button style={{ backgroundColor: appearance.secondaryColor, color: "white", border: "none" }}>
                        Secondary Button
                      </Button>
                    </div>
                    <div className="mt-3">
                      <p className="text-black">Sample text in light mode</p>
                      <p style={{ color: appearance.primaryColor }}>Colored text using primary color</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-[#303030] bg-[#101010]">
                    <h4 className="text-white font-medium mb-3">Dark Mode</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button style={{ backgroundColor: appearance.primaryColor, color: "white", border: "none" }}>
                        Primary Button
                      </Button>
                      <Button style={{ backgroundColor: appearance.secondaryColor, color: "white", border: "none" }}>
                        Secondary Button
                      </Button>
                    </div>
                    <div className="mt-3">
                      <p className="text-white">Sample text in dark mode</p>
                      <p className="text-white" style={{ color: appearance.primaryColor }}>
                        Colored text using primary color
                      </p>
                    </div>
                  </div>
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
  }`
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
  .ant-collapse-header {
    color: white !important;
  }
  .ant-collapse-content {
    background-color: #181818 !important;
    border-color: #303030 !important;
  }
  /* Alert Styles */
  .ant-alert {
    background-color: #202020 !important;
    border-color: #303030 !important;
  }
  .ant-alert-message {
    color: white !important;
  }
  .ant-alert-description {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  /* Prose for rich text preview */
  .prose {
    color: white; /* Default text color for prose */
  }
  .prose strong {
    font-weight: bold;
  }
  .prose em {
    font-style: italic;
  }
  .prose u {
    text-decoration: underline;
  }
  .prose-invert {
    color: white;
  }
`
const styleElement = document.createElement("style")
styleElement.innerHTML = styleOverrides + additionalStyles
document.head.appendChild(styleElement)

export default ConfigurationPage
