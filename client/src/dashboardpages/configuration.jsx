/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
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
  Divider,
  DatePicker,
  Collapse,
  Alert,
} from "antd"
import dayjs from "dayjs"
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, CalendarOutlined } from "@ant-design/icons"

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

const ConfigurationPage = () => {
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

  // Opening hours and closing days
  const [openingHours, setOpeningHours] = useState([])
  const [closingDays, setClosingDays] = useState([])
  const [publicHolidays, setPublicHolidays] = useState([])
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)

  // Other studio settings
  const [logo, setLogo] = useState([])
  const [roles, setRoles] = useState([])
  const [appointmentTypes, setAppointmentTypes] = useState([])
  const [tags, setTags] = useState([])
  const [contractStatuses, setContractStatuses] = useState([])
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    iban: "",
    bic: "",
    creditorId: "",
    creditorName: "",
  })

  // Countries for selection
  const [countries, setCountries] = useState([
    { code: "AT", name: "Austria" },
    { code: "BE", name: "Belgium" },
    { code: "BG", name: "Bulgaria" },
    { code: "CA", name: "Canada" },
    { code: "HR", name: "Croatia" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DK", name: "Denmark" },
    { code: "EE", name: "Estonia" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "GR", name: "Greece" },
    { code: "HU", name: "Hungary" },
    { code: "IE", name: "Ireland" },
    { code: "IT", name: "Italy" },
    { code: "LV", name: "Latvia" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MT", name: "Malta" },
    { code: "NL", name: "Netherlands" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "RO", name: "Romania" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "ES", name: "Spain" },
    { code: "SE", name: "Sweden" },
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
  ])

  const [maxCapacity, setMaxCapacity] = useState(10)
  const [contractTypes, setContractTypes] = useState([])
  const [contractSections, setContractSections] = useState([
    { title: "Personal Information", content: "", editable: true },
    { title: "Contract Terms", content: "", editable: true },
  ])
  const [noticePeriod, setNoticePeriod] = useState(30)
  const [extensionPeriod, setExtensionPeriod] = useState(12)
  const [additionalDocs, setAdditionalDocs] = useState([])
  const [holidaysDialogVisible, setHolidaysDialogVisible] = useState(false);
  const [birthdayMessage, setBirthdayMessage] = useState({
    enabled: false,
    message: "Happy Birthday! 🎉 Best wishes from {studio_name}",
  })

  const [trialTraining, setTrialTraining] = useState({
    name: "Trial Training",
    duration: 60,
    capacity: 1,
    color: "#1890ff",
  })

  const [broadcastMessage, setbroadcastMessage] = useState({
    title: "",
    message: "",
  })

  const [emailConfig, setEmailConfig] = useState({
    smtpServer: "",
    smtpPort: 587,
    emailAddress: "",
    password: "",
    useSSL: false,
    senderName: "",
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

  // Fetch public holidays when country changes
  useEffect(() => {
    if (studioCountry) {
      fetchPublicHolidays(studioCountry)
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
    setAppointmentTypes([...appointmentTypes, { name: "", duration: 30, capacity: 1, color: "#1890ff", interval: 30 }])
  }

  const handleAddTag = () => {
    setTags([...tags, { name: "", color: "#1890ff" }])
  }

  const handleAddContractStatus = () => {
    setContractStatuses([...contractStatuses, { name: "" }])
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
      },
    ])
  }

  const handleLogoUpload = (info) => {
    if (info.file.status === "done") {
      setLogo([info.file])
      notification.success({ message: "Logo uploaded successfully" })
    }
  }

  const handleAddContractSection = () => {
    setContractSections([...contractSections, { title: "", content: "", editable: true }])
  }

  const handleUpdateAppointmentType = (index, field, value) => {
    const updatedTypes = [...appointmentTypes]
    updatedTypes[index][field] = value
    setAppointmentTypes(updatedTypes)
  }

  const handleViewBlankContract = () => {
    console.log("check handle view blank contract")
  }

  const testEmailConnection = () => {
    console.log("Test Email connection")
  }

  const handleAddLeadProspectCategory = () => {
    setLeadProspectCategories([...leadProspectCategories, { name: "", circleColor: "#1890ff" }])
  }

  return (
    <div className="max-w-7xl mx-auto lg:p-10 p-5 rounded-3xl space-y-8 bg-[#181818] min-h-screen text-white">
      <h1 className="lg:text-3xl text-2xl font-bold oxanium_font">Studio Configuration</h1>

      <Tabs defaultActiveKey="1" style={{ color: "white" }}>
        <TabPane tab="Studio Data" key="1">
          <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
            <Form layout="vertical" className="space-y-4">
              <Form.Item label={<span className="text-white">Studio Name</span>} required>
                <Input
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  placeholder="Enter studio name"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item label={<span className="text-white">Studio Operator</span>}>
                <Input
                  value={studioOperator}
                  onChange={(e) => setStudioOperator(e.target.value)}
                  placeholder="Enter studio operator name"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item label={<span className="text-white">Phone No</span>} required>
                <Input
                  value={studioPhoneNo}
                  onChange={(e) => setStudioPhoneNo(e.target.value)}
                  placeholder="Enter phone no"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item label={<span className="text-white">Email</span>} required>
                <Input
                  value={studioEmail}
                  onChange={(e) => setStudioEmail(e.target.value)}
                  placeholder="Enter email"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item label={<span className="text-white">Street (with number)</span>} required>
                <Input
                  value={studioStreet}
                  onChange={(e) => setStudioStreet(e.target.value)}
                  placeholder="Enter street and number"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item label={<span className="text-white">ZIP Code</span>} required>
                <Input
                  value={studioZipCode}
                  onChange={(e) => setStudioZipCode(e.target.value)}
                  placeholder="Enter ZIP code"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item label={<span className="text-white">City</span>} required>
                <Input
                  value={studioCity}
                  onChange={(e) => setStudioCity(e.target.value)}
                  placeholder="Enter city"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-white">Country</span>}
                required
                tooltip="Selecting a country will allow you to import public holidays"
              >
                <Select
                  value={studioCountry}
                  onChange={(value) => setStudioCountry(value)}
                  placeholder="Select country"
                  style={selectStyle}
                >
                  {countries.map((country) => (
                    <Option key={country.code} value={country.code}>
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label={<span className="text-white">Studio Website</span>}>
                <Input
                  value={studioWebsite}
                  onChange={(e) => setStudioWebsite(e.target.value)}
                  placeholder="Enter studio website URL"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item label={<span className="text-white">Studio Logo</span>}>
                <Upload accept="image/*" maxCount={1} onChange={handleLogoUpload} fileList={logo}>
                  <Button icon={<UploadOutlined />} style={buttonStyle}>
                    Upload Logo
                  </Button>
                </Upload>
              </Form.Item>
            </Form>

            {/* Opening Hours Section */}
            <Form.Item label={<span className="text-white">Opening Hours</span>}>
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
                      className="w-full sm:w-32"
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
                      className="w-full sm:w-32"
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
            </Form.Item>

            <Form.Item label={<span className="text-white">Closing Days</span>}>
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
                  <div key={index} className="flex  flex-wrap gap-4 items-center">
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
            </Form.Item>
          </div>
        </TabPane>

        <TabPane tab="Resources" key="2">
          <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6 white-text">
            <div className="space-y-4">
              <Form.Item label={<span className="text-white">Default Maximum Capacity</span>}>
                <InputNumber
                  min={0}
                  max={100}
                  value={maxCapacity}
                  onChange={(value) => setMaxCapacity(value || 0)}
                  style={inputStyle}
                />
              </Form.Item>
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trial Training</h3>
              <Form layout="vertical">
                <Form.Item label={<span className="text-white">Name</span>}>
                  <Input
                    value={trialTraining.name}
                    onChange={(e) =>
                      setTrialTraining({
                        ...trialTraining,
                        name: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">Duration (minutes)</span>}>
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
                </Form.Item>
                <Form.Item label={<span className="text-white">Capacity</span>}>
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
                </Form.Item>
                <Form.Item label={<span className="text-white">Color</span>}>
                  <ColorPicker
                    value={trialTraining.color}
                    onChange={(color) => setTrialTraining({ ...trialTraining, color })}
                  />
                </Form.Item>
              </Form>
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lead Prospect Categories</h3>
              <div className="space-y-4">
                {leadProspectCategories.map((category, index) => (
                  <div key={index} className="flex flex-wrap gap-4 items-center">
                    <Input
                      placeholder="Category Name"
                      value={category.name}
                      onChange={(e) => {
                        const updatedCategories = [...leadProspectCategories]
                        updatedCategories[index].name = e.target.value
                        setLeadProspectCategories(updatedCategories)
                      }}
                      className="w-full sm:w-64"
                      style={inputStyle}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-white">Circle Color:</span>
                      <ColorPicker
                        value={category.circleColor}
                        onChange={(color) => {
                          const updatedCategories = [...leadProspectCategories]
                          updatedCategories[index].circleColor = color
                          setLeadProspectCategories(updatedCategories)
                        }}
                      />
                    </div>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => setLeadProspectCategories(leadProspectCategories.filter((_, i) => i !== index))}
                      className="w-full sm:w-auto"
                      style={buttonStyle}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={handleAddLeadProspectCategory}
                  icon={<PlusOutlined />}
                  className="w-full sm:w-auto"
                  style={buttonStyle}
                >
                  Add Lead Prospect Category
                </Button>
              </div>
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Roles</h3>
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
                      className="w-full sm:w-64"
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
                      className="w-full sm:flex-1"
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
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appointment Types</h3>
              <div className="space-y-4">
                {appointmentTypes.map((type, index) => (
                  <div key={index} className="flex flex-wrap gap-4 items-center">
                    <Input
                      placeholder="Appointment Type Name"
                      value={type.name}
                      onChange={(e) => handleUpdateAppointmentType(index, "name", e.target.value)}
                      className="w-full sm:w-64"
                      style={inputStyle}
                    />
                    <InputNumber
                      placeholder="Duration (minutes)"
                      value={type.duration}
                      onChange={(value) => handleUpdateAppointmentType(index, "duration", value)}
                      className="w-full sm:w-32"
                      style={inputStyle}
                    />
                    <InputNumber
                      placeholder="Capacity (1-100)"
                      value={type.capacity}
                      onChange={(value) => handleUpdateAppointmentType(index, "capacity", value)}
                      className="w-full sm:w-32"
                      style={inputStyle}
                    />
                    <ColorPicker
                      value={type.color}
                      onChange={(color) => handleUpdateAppointmentType(index, "color", color)}
                    />
                    <InputNumber
                      placeholder="Interval (minutes)"
                      value={type.interval}
                      onChange={(value) => handleUpdateAppointmentType(index, "interval", value)}
                      className="w-full sm:w-32"
                      style={inputStyle}
                    />
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
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">TO-DO Tags</h3>
              <div className="space-y-4">
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
                      className="w-full sm:w-64"
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
            </div>
          </div>
        </TabPane>

        <TabPane tab="Contracts" key="3">
          <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6 white-text">
            <div className="space-y-4">
              {contractTypes.map((type, index) => (
                <div key={index} className="space-y-4 p-4 border border-[#303030] rounded-lg">
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
                    <Form.Item label={<span className="text-white">Duration (months)</span>}>
                      <InputNumber
                        value={type.duration}
                        onChange={(value) => {
                          const updated = [...contractTypes]
                          updated[index].duration = value || 0
                          setContractTypes(updated)
                        }}
                        style={inputStyle}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Cost</span>}>
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
                  </Form>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setContractTypes(contractTypes.filter((_, i) => i !== index))}
                    style={buttonStyle}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={handleAddContractType} icon={<PlusOutlined />} style={buttonStyle}>
                Add Contract Type
              </Button>
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contract Sections</h3>
              {contractSections.map((section, index) => (
                <div key={index} className="space-y-4 p-4 border border-[#303030] rounded-lg">
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
                        checked={section.editable}
                        onChange={(checked) => {
                          const updated = [...contractSections]
                          updated[index].editable = checked
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
                </div>
              ))}
              <Button type="dashed" onClick={handleAddContractSection} icon={<PlusOutlined />} style={buttonStyle}>
                Add Contract Section
              </Button>
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Additional Documents</h3>
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
          </div>
        </TabPane>

        <TabPane tab="Communication" key="4">
          <div className="bg-[#181818] white-text rounded-lg border border-[#303030] p-6 space-y-6">
            <div className="space-y-4">
              <Form layout="vertical">
                <Form.Item label={<span className="text-white">SMTP Server</span>}>
                  <Input
                    value={emailConfig.smtpServer}
                    onChange={(e) =>
                      setEmailConfig({
                        ...emailConfig,
                        smtpServer: e.target.value,
                      })
                    }
                    style={inputStyle}
                    placeholder="smtp.example.com"
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">SMTP Port</span>}>
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
                </Form.Item>
                <Form.Item label={<span className="text-white">Email Address</span>}>
                  <Input
                    value={emailConfig.emailAddress}
                    onChange={(e) =>
                      setEmailConfig({
                        ...emailConfig,
                        emailAddress: e.target.value,
                      })
                    }
                    style={inputStyle}
                    placeholder="studio@example.com"
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white white-text">Password</span>}>
                  <Input.Password
                    value={emailConfig.password}
                    onChange={(e) =>
                      setEmailConfig({
                        ...emailConfig,
                        password: e.target.value,
                      })
                    }
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
                    style={inputStyle}
                    placeholder="Your Studio Name"
                  />
                </Form.Item>
                <Button type="primary" style={buttonStyle} onClick={testEmailConnection}>
                  Test Connection
                </Button>
              </Form>
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Birthday Messages</h3>
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
                <Form.Item label={<span className="text-white">Message Template</span>}>
                  <TextArea
                    value={birthdayMessage.message}
                    onChange={(e) =>
                      setBirthdayMessage({
                        ...birthdayMessage,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    style={inputStyle}
                    placeholder="Use {studio_name} as a placeholder for your studio name"
                  />
                </Form.Item>
              </Form>
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Broadcast Messages</h3>
              <Form layout="vertical">
                <Form.Item label={<span className="text-white">Title</span>}>
                  <Input
                    value={broadcastMessage.title}
                    onChange={(e) => {
                      setbroadcastMessage({
                        ...broadcastMessage,
                        title: e.target.value,
                      })
                    }}
                    style={inputStyle}
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">Message</span>}>
                  <TextArea
                    value={broadcastMessage.message}
                    onChange={(e) => {
                      setbroadcastMessage({
                        ...broadcastMessage,
                        message: e.target.value,
                      })
                    }}
                    rows={4}
                    style={inputStyle}
                  />
                </Form.Item>
              </Form>
            </div>
          </div>
        </TabPane>

        <TabPane tab="Finances" key="5">
          <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
            <div className="space-y-4">
              <Form layout="vertical" className="space-y-4">
                <Form.Item label={<span className="text-white">Creditor Name</span>}>
                  <Input
                    value={bankDetails.creditorName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        creditorName: e.target.value,
                      })
                    }
                    placeholder="Enter creditor name"
                    style={inputStyle}
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">IBAN</span>}>
                  <Input
                    value={bankDetails.iban}
                    onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value })}
                    placeholder="Enter IBAN"
                    style={inputStyle}
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">BIC</span>}>
                  <Input
                    value={bankDetails.bic}
                    onChange={(e) => setBankDetails({ ...bankDetails, bic: e.target.value })}
                    placeholder="Enter BIC"
                    style={inputStyle}
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">Creditor ID</span>}>
                  <Input
                    value={bankDetails.creditorId}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        creditorId: e.target.value,
                      })
                    }
                    placeholder="Enter Creditor ID"
                    style={inputStyle}
                  />
                </Form.Item>
              </Form>
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">VAT Rates</h3>
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
                      className="w-full sm:w-64"
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
            </div>
          </div>
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
`

const styleElement = document.createElement("style")
styleElement.innerHTML = styleOverrides
document.head.appendChild(styleElement)

export default ConfigurationPage

