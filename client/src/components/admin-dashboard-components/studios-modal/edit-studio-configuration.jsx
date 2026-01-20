/* eslint-disable react/prop-types */
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
import DefaultAvatar from '../../../../public/gray-avatar-fotor-20250912192528.png'
import "../../../custom-css/user-panel-configuration.css"
import { QRCode, Typography } from "antd"
import { QrcodeOutlined, ImportOutlined } from "@ant-design/icons"

import ContractBuilder from "../../../components/user-panel-components/configuration-components/ContractBuilder"
import { WysiwygEditor } from "../../../components/shared/WysiwygEditor"
import { PermissionModal } from "./permission-modal"

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

const ConfigurationPage = ({studio, onSave}) => {
  // Directly use studio prop for all data - no states needed
  const [logoUrl, setLogoUrl] = useState(studio?.logoUrl || "")
  const [logo, setLogo] = useState(studio?.logo || [])
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null)

  // Countries for selection with currency
  const countries = [
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
  ]

  const birthdayTextareaRef = useRef(null)
  const confirmationTextareaRef = useRef(null)
  const cancellationTextareaRef = useRef(null)
  const rescheduledTextareaRef = useRef(null)
  const reminderTextareaRef = useRef(null)

  // Helper function to check boolean values
  const bool = (v, d = false) => (typeof v === "boolean" ? v : d)

  // Insert variable helper for settings modal textareas
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

  // Get appointment notification type with defaults
  const getType = (key) => {
    const t = studio?.settings?.appointmentNotificationTypes?.[key] || {}
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

  // Handle save settings
  const handleSaveSettings = () => {
    notification.success({
      message: "Settings Saved",
      description: "Your communication settings have been saved successfully!",
    })
  }

  useEffect(() => {
    if (studio?.studioCountry) {
      const selectedCountry = countries.find((c) => c.code === studio.studioCountry)
      // Currency will be handled by parent component
    }
  }, [studio?.studioCountry])

 // Studio Configuration mein yeh update karen
const handlePermissionChange = (permissions) => {
  if (selectedRoleIndex !== null && onSave) {
    console.log("Updating permissions for role:", selectedRoleIndex, permissions);
    
    // Deep copy banao aur properly update karo
    const updatedRoles = studio.roles.map((role, index) => 
      index === selectedRoleIndex ? { 
        ...role, 
        permissions: [...permissions] // New array reference
      } : { ...role } // Other roles ko bhi copy karo
    );
    
    const updatedStudio = {
      ...studio,
      roles: updatedRoles
    };
    
    console.log("Sending to onSave:", updatedStudio);
    onSave(updatedStudio);
    
    // Modal close karo
    setPermissionModalVisible(false);
    setSelectedRoleIndex(null);
    
    // Success notification
    notification.success({
      message: "Permissions Updated",
      description: "Role permissions have been updated successfully."
    });
  }
};

  const openPermissionModal = (index) => {
    setSelectedRoleIndex(index);
    setPermissionModalVisible(true);
  };

  const addPublicHolidaysToClosingDays = (holidaysToProcess = studio?.publicHolidays || []) => {
    if (holidaysToProcess.length === 0) {
      notification.warning({
        message: "No Holidays Available",
        description: "Please select a country first to load public holidays.",
      })
      return
    }
    
    if (onSave) {
      const existingDates = studio?.closingDays?.map((day) => day.date?.format("YYYY-MM-DD")) || []
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
      
      const updatedClosingDays = [...(studio?.closingDays || []), ...holidaysToAdd]
      onSave({
        ...studio,
        closingDays: updatedClosingDays
      })
      
      notification.success({
        message: "Holidays Added",
        description: `Added ${holidaysToAdd.length} public holidays to closing days.`,
      })
    }
  }

  const handleSaveConfiguration = () => {
    if (!studio?.studioName || !studio?.studioStreet || !studio?.studioZipCode || !studio?.studioCity) {
      notification.error({ message: "Please fill in all required fields in Studio Data." })
      return
    }
    
    if (onSave) {
      onSave(studio)
      notification.success({ message: "Configuration saved successfully!" })
    }
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
      link.download = `studio-qr-code-${studio?.studioName || 'checkin'}.png`;
      link.href = url;
      link.click();
    }
  };

  const testEmailConnection = () => {
    console.log("Test Email connection", studio?.emailConfig)
    notification.info({
      message: "Test Connection",
      description: "Attempting to connect to SMTP server...",
    })
  }

  // Handler functions that update the studio data through onSave
  const handleUpdateField = (field, value) => {
    if (onSave) {
      onSave({
        ...studio,
        [field]: value
      })
    }
  }

  const handleUpdateNestedField = (parentField, field, value) => {
    if (onSave) {
      onSave({
        ...studio,
        [parentField]: {
          ...studio[parentField],
          [field]: value
        }
      })
    }
  }

  const handleAddItem = (arrayField, newItem) => {
    if (onSave) {
      onSave({
        ...studio,
        [arrayField]: [...(studio[arrayField] || []), newItem]
      })
    }
  }

  const handleRemoveItem = (arrayField, index) => {
    if (onSave) {
      onSave({
        ...studio,
        [arrayField]: (studio[arrayField] || []).filter((_, i) => i !== index)
      })
    }
  }

  const handleUpdateItem = (arrayField, index, field, value) => {
    if (onSave) {
      const updatedArray = (studio[arrayField] || []).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
      onSave({
        ...studio,
        [arrayField]: updatedArray
      })
    }
  }

  const handleUpdateSettingsField = (field, value) => {
    if (onSave) {
      onSave({
        ...studio,
        settings: {
          ...studio.settings,
          [field]: value
        }
      })
    }
  }

  const handleUpdateAppointmentNotificationTypes = (type, field, value) => {
    if (onSave) {
      onSave({
        ...studio,
        settings: {
          ...studio.settings,
          appointmentNotificationTypes: {
            ...studio.settings?.appointmentNotificationTypes,
            [type]: {
              ...studio.settings?.appointmentNotificationTypes?.[type],
              [field]: value
            }
          }
        }
      })
    }
  }

  const notificationSubTab = studio?.settings?.notificationSubTab || "email"

  return (
    <>
      <div className=" w-full mx-auto lg:p-6 p-5  space-y-8 bg-[#181818] min-h-screen text-white">
        <Tabs defaultActiveKey="1" style={{ color: "white" }}>
          <TabPane tab="Studio Data" key="1">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              <Panel header="Studio Information" key="1" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 rounded-xl overflow-hidden  shadow-lg">
                        <img
                          src={logoUrl || studio?.logoUrl || DefaultAvatar}
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
                        value={studio?.studioName || ""}
                        onChange={(e) => handleUpdateField('studioName', e.target.value)}
                        placeholder="Enter studio name"
                        style={inputStyle}
                        maxLength={50}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Studio Operator</span>}>
                      <Input
                        value={studio?.studioOperator || ""}
                        onChange={(e) => handleUpdateField('studioOperator', e.target.value)}
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
                        value={studio?.studioPhoneNo || ""}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "")
                          handleUpdateField('studioPhoneNo', onlyDigits)
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
                        value={studio?.studioEmail || ""}
                        onChange={(e) => handleUpdateField('studioEmail', e.target.value)}
                        placeholder="Enter email"
                        style={inputStyle}
                        maxLength={60}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">Street (with number)</span>} required>
                      <Input
                        value={studio?.studioStreet || ""}
                        onChange={(e) => handleUpdateField('studioStreet', e.target.value)}
                        placeholder="Enter street and number"
                        style={inputStyle}
                        maxLength={60}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">ZIP Code</span>} required>
                      <Input
                        value={studio?.studioZipCode || ""}
                        onChange={(e) => handleUpdateField('studioZipCode', e.target.value)}
                        placeholder="Enter ZIP code"
                        style={inputStyle}
                        maxLength={10}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">City</span>} required>
                      <Input
                        value={studio?.studioCity || ""}
                        onChange={(e) => handleUpdateField('studioCity', e.target.value)}
                        placeholder="Enter city"
                        style={inputStyle}
                        maxLength={40}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Country</span>} required>
                      <Select
                        value={studio?.studioCountry || ""}
                        onChange={(value) => handleUpdateField('studioCountry', value)}
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
                        value={studio?.studioWebsite || ""}
                        onChange={(e) => handleUpdateField('studioWebsite', e.target.value)}
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
                    
                  {(studio?.openingHours || []).map((hour, index) => (
                    <>

                    <div key={index} className="flex flex-wrap gap-4 items-center">
                      <Select
                        placeholder="Select day"
                        value={hour.day}
                        onChange={(value) => handleUpdateItem('openingHours', index, 'day', value)}
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
                        onChange={(time) => handleUpdateItem('openingHours', index, 'startTime', time)}
                        className="w-full sm:w-32 white-text"
                        style={inputStyle}
                      />
                      <TimePicker
                        format="HH:mm"
                        placeholder="End Time"
                        value={hour.endTime}
                        onChange={(time) => handleUpdateItem('openingHours', index, 'endTime', time)}
                        className="w-full sm:w-32 white-text"
                        style={inputStyle}
                        />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem('openingHours', index)}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                        >
                        Remove
                      </Button>
                    </div>
                          </>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => handleAddItem('openingHours', { day: "", startTime: "", endTime: "" })}
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
                  {studio?.studioCountry && (
                    <div className="mb-4">
                      <Alert
                        message="Public Holidays"
                        description={
                          <div>
                            <p>
                              You can automatically import public holidays for{" "}
                              {countries.find((c) => c.code === studio.studioCountry)?.name || studio.studioCountry}.
                            </p>
                            <Button
                              onClick={() => addPublicHolidaysToClosingDays()}
                              loading={studio?.isLoadingHolidays}
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
                  {(studio?.closingDays || []).map((day, index) => (
                    <div key={index} className="flex flex-wrap gap-4 items-center">
                      <DatePicker
                        placeholder="Select date"
                        value={day.date}
                        onChange={(date) => handleUpdateItem('closingDays', index, 'date', date)}
                        className="w-full sm:w-40 white-text"
                        style={inputStyle}
                      />
                      <Input
                        placeholder="Description (e.g., Public Holiday)"
                        value={day.description}
                        onChange={(e) => handleUpdateItem('closingDays', index, 'description', e.target.value)}
                        className="w-full sm:flex-1"
                        style={inputStyle}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem('closingDays', index)}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => handleAddItem('closingDays', { date: null, description: "" })}
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
          
          {/* Resources Tab */}
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
                          value={studio?.maxCapacity || 10}
                          onChange={(value) => handleUpdateField('maxCapacity', value || 0)}
                          style={inputStyle}
                          className="white-text"
                        />
                      </Form.Item>
                    </div>
                  </Panel>
                  <Panel header="Appointment Types" key="1" className="bg-[#252525]">
                    <div className="space-y-4">
                      {(studio?.appointmentTypes || []).map((type, index) => (
                        <div key={index} className="flex flex-col gap-4 p-4 border border-[#303030] rounded-lg">
                          <div className="flex flex-wrap gap-4 items-center">
                            <Row>
                              <Input
                                placeholder="Appointment Type Name"
                                value={type.name}
                                onChange={(e) => handleUpdateItem('appointmentTypes', index, 'name', e.target.value)}
                                className="!w-full md:!w-32 lg:!w-90 !py-3.5 white-text"
                                style={inputStyle}
                              />
                            </Row>

                            <div className="flex items-center">
                              <InputNumber
                                placeholder="Duration"
                                value={type.duration}
                                onChange={(value) => handleUpdateItem('appointmentTypes', index, 'duration', value)}
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
                                onChange={(value) => handleUpdateItem('appointmentTypes', index, 'capacity', value)}
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
                                onChange={(color) => handleUpdateItem('appointmentTypes', index, 'color', color)}
                              />
                              <Tooltip title="Calendar display color">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip>
                            </div>
                            <div className="flex items-center">
                              <InputNumber
                                placeholder="Interval"
                                value={type.interval}
                                onChange={(value) => handleUpdateItem('appointmentTypes', index, 'interval', value)}
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
                              onClick={() => handleRemoveItem('appointmentTypes', index)}
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
                              onChange={({ fileList }) => handleUpdateItem('appointmentTypes', index, 'images', fileList)}
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
                        onClick={() => handleAddItem('appointmentTypes', {
                          name: "",
                          duration: 30,
                          capacity: 1,
                          color: "#1890ff",
                          interval: 30,
                          images: [],
                        })}
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
                              value={studio?.trialTraining?.duration || 60}
                              onChange={(value) => handleUpdateNestedField('trialTraining', 'duration', value || 60)}
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
                              value={studio?.trialTraining?.capacity || 1}
                              onChange={(value) => handleUpdateNestedField('trialTraining', 'capacity', value || 1)}
                              max={studio?.maxCapacity || 10}
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
                            value={studio?.trialTraining?.color || "#1890ff"}
                            onChange={(color) => handleUpdateNestedField('trialTraining', 'color', color)}
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
                            value={studio?.defaultVacationDays || 20}
                            onChange={(value) => handleUpdateField('defaultVacationDays', value || 0)}
                            style={inputStyle}
                            className="white-text"
                          />
                        </div>
                      </Form.Item>
                    </div>
                  </Panel>
                  <Panel header="Staff Roles" key="1" className="bg-[#252525]">
                    <div className="space-y-4">
                      {(studio?.roles || []).map((role, index) => (
                        <div key={index} className="flex flex-col gap-4 p-3 border border-[#303030] rounded-lg">
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <Input
                              placeholder="Role Name"
                              value={role.name}
                              onChange={(e) => handleUpdateItem('roles', index, 'name', e.target.value)}
                              className="!w-full sm:!w-48 !py-3.5"
                              style={inputStyle}
                            />

                            <div className="flex items-center gap-2">
                              <ColorPicker
                                value={role.color}
                                onChange={(color) => handleUpdateItem('roles', index, 'color', color)}
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
                              onClick={() => handleRemoveItem('roles', index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="dashed"
                        onClick={() => handleAddItem('roles', {
                          name: "",
                          permissions: [],
                          color: "#1890ff",
                          defaultVacationDays: 20,
                        })}
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
                            checked={studio?.allowMemberQRCheckIn || false}
                            onChange={(checked) => handleUpdateField('allowMemberQRCheckIn', checked)}
                          />
                        </div>
                      </Form.Item>

                      {studio?.allowMemberQRCheckIn && (
                        <div className="space-y-6 p-4 border border-[#303030] rounded-lg">
                          <div className="flex flex-col items-center space-y-4">
                            <h1 className="text-white text-center text-xl">
                              Member Check-In QR Code
                            </h1>

                            <div className="relative p-4 bg-white rounded-lg">
                              <QRCode
                                value={studio?.memberQRCodeUrl || "https://your-studio-app.com/member-checkin"}
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
                    <Button onClick={() => handleAddItem('leadSources', { id: Date.now(), name: "", color: "blue" })} icon={<PlusOutlined />} style={saveButtonStyle}>
                      Add Lead Source
                    </Button>
                  </div>
                  {(studio?.leadSources || []).map((source, index) => (
                    <div key={source.id} className="flex flex-wrap gap-4 items-center">
                      <Input
                        value={source.name}
                        onChange={(e) => handleUpdateItem('leadSources', index, 'name', e.target.value)}
                        style={inputStyle}
                        placeholder="Source name"
                        className="!w-full md:!w-32 lg:!w-90 !py-3"
                      />
                      <ColorPicker
                        value={source.color}
                        onChange={(color) => handleUpdateItem('leadSources', index, 'color', color)}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem('leadSources', index)}
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {(studio?.leadSources || []).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">No lead sources configured yet.</p>
                      <Button onClick={() => handleAddItem('leadSources', { id: Date.now(), name: "", color: "blue" })} icon={<PlusOutlined />} style={saveButtonStyle}>
                        Add Your First Lead Source
                      </Button>
                    </div>
                  )}
                </div>
              </Panel>
              <Panel header="TO-DO" key="4" className="bg-[#202020]">
                <div className="space-y-4">
                  <h3 className="text-lg text-white font-medium">To-Do Tags</h3>
                  {(studio?.tags || []).map((tag, index) => (
                    <div key={index} className="flex flex-wrap gap-4 items-center">
                      <Input
                        placeholder="Tag Name"
                        value={tag.name}
                        onChange={(e) => handleUpdateItem('tags', index, 'name', e.target.value)}
                        className="!w-full md:!w-32 lg:!w-90 !py-3"
                        style={inputStyle}
                      />
                      <ColorPicker
                        value={tag.color}
                        onChange={(color) => handleUpdateItem('tags', index, 'color', color)}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem('tags', index)}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => handleAddItem('tags', { name: "", color: "#1890ff" })}
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

          {/* Contracts Tab */}
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
                        checked={studio?.allowMemberSelfCancellation || true} 
                        onChange={(checked) => handleUpdateField('allowMemberSelfCancellation', checked)} 
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Default Notice Period (days)</span>}>
                      <InputNumber
                        min={0}
                        value={studio?.noticePeriod || 30}
                        onChange={(value) => handleUpdateField('noticePeriod', value)}
                        style={inputStyle}
                        className="white-text"
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Default Extension Period (months)</span>}>
                      <InputNumber
                        min={0}
                        value={studio?.extensionPeriod || 12}
                        onChange={(value) => handleUpdateField('extensionPeriod', value)}
                        style={inputStyle}
                        className="white-text"
                      />
                    </Form.Item>
                  </Form>
                </div>
              </Panel>
              <Panel header="Contract Types" key="1" className="bg-[#202020]">
                <div className="space-y-4">
                  {(studio?.contractTypes || []).map((type, index) => (
                    <Collapse key={index} className="border border-[#303030] rounded-lg overflow-hidden">
                      <Panel header={type.name || "New Contract Type"} key="1" className="bg-[#252525]">
                        <Form layout="vertical">
                          <Form.Item label={<span className="text-white">Contract Name</span>}>
                            <Input
                              value={type.name}
                              onChange={(e) => handleUpdateItem('contractTypes', index, 'name', e.target.value)}
                              className="!w-full md:!w-32 lg:!w-90 white-text"
                              style={inputStyle}
                            />
                          </Form.Item>
                          <Form.Item label={<span className="text-white white-text">Duration (months)</span>}>
                            <div className="white-text">
                              <InputNumber
                                value={type.duration}
                                onChange={(value) => handleUpdateItem('contractTypes', index, 'duration', value || 0)}
                                style={inputStyle}
                              />
                            </div>
                          </Form.Item>
                          <Form.Item label={<span className="text-white white-text">Cost</span>}>
                            <div className="white-text">
                              <InputNumber
                                value={type.cost}
                                onChange={(value) => handleUpdateItem('contractTypes', index, 'cost', value || 0)}
                                style={inputStyle}
                                precision={2}
                              />
                            </div>
                          </Form.Item>
                          <Form.Item label={<span className="text-white">Billing Period</span>}>
                            <Select
                              value={type.billingPeriod}
                              onChange={(value) => handleUpdateItem('contractTypes', index, 'billingPeriod', value)}
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
                                onChange={(value) => handleUpdateItem('contractTypes', index, 'userCapacity', value || 0)}
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
                              onChange={(checked) => handleUpdateItem('contractTypes', index, 'autoRenewal', checked)}
                            />
                          </Form.Item>

                          {type.autoRenewal && (
                            <>
                              <Form.Item label={<span className="text-white">Renewal Period (months)</span>}>
                                <InputNumber
                                  min={1}
                                  value={type.renewalPeriod || 1}
                                  onChange={(value) => handleUpdateItem('contractTypes', index, 'renewalPeriod', value || 1)}
                                  style={inputStyle}
                                  className="white-text"
                                />
                              </Form.Item>
                              <Form.Item label={<span className="text-white">Price after Renewal</span>}>
                                <InputNumber
                                  value={type.renewalPrice || 0}
                                  onChange={(value) => handleUpdateItem('contractTypes', index, 'renewalPrice', value || 0)}
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
                              onChange={(value) => handleUpdateItem('contractTypes', index, 'cancellationPeriod', value || 30)}
                              style={inputStyle}
                              className="white-text"
                            />
                          </Form.Item>
                        </Form>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveItem('contractTypes', index)}
                          style={buttonStyle}
                        >
                          Remove
                        </Button>
                      </Panel>
                    </Collapse>
                  ))}
                  <Button 
                    type="dashed" 
                    onClick={() => handleAddItem('contractTypes', {
                      name: "",
                      duration: 12,
                      cost: 0,
                      billingPeriod: "monthly",
                      userCapacity: 0,
                      autoRenewal: false,
                      renewalPeriod: 1,
                      renewalPrice: 0,
                      cancellationPeriod: 30,
                    })} 
                    icon={<PlusOutlined />} 
                    style={buttonStyle}
                  >
                    Add Contract Type
                  </Button>
                </div>
              </Panel>
              <Panel header="Contract Form" key="2" className="bg-[#202020]">
                <ContractBuilder />
              </Panel>
              <Panel header="Contract Pause Reasons" key="3" className="bg-[#202020]">
                <div className="space-y-4">
                  {(studio?.contractPauseReasons || []).map((reason, index) => (
                    <div key={index} className="flex white-text flex-wrap gap-4 items-center">
                      <Input
                        placeholder="Reason Name"
                        value={reason.name}
                        onChange={(e) => handleUpdateItem('contractPauseReasons', index, 'name', e.target.value)}
                        className="!w-full md:!w-32 lg:!w-90 white-text"
                        style={inputStyle}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem('contractPauseReasons', index)}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => handleAddItem('contractPauseReasons', { name: "", maxDays: 30 })}
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

          {/* Communication Tab */}
          <TabPane tab="Communication" key="4">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              <Panel header="General Communication Settings" key="1" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item label={<span className="text-white">Auto-Archive Duration (days)</span>}>
                      <InputNumber
                        min={1}
                        max={365}
                        value={studio?.settings?.autoArchiveDuration || 30}
                        onChange={(value) => handleUpdateSettingsField('autoArchiveDuration', value || 30)}
                        style={inputStyle}
                        className="white-text"
                      />
                    </Form.Item>
                  </Form>
                </div>
              </Panel>

              {/* Email and App Notification Sub-Tabs */}
              <Panel header="Notifications" key="2" className="bg-[#202020]">
                <div className="space-y-4">
                  <div className="flex gap-1 mb-4 border-b border-gray-600">
                    <button
                      onClick={() => handleUpdateSettingsField('notificationSubTab', "email")}
                      className={`px-4 py-2 text-sm ${notificationSubTab === "email"
                        ? "bg-blue-500 text-white rounded-t"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      E-Mail Notification
                    </button>
                    <button
                      onClick={() => handleUpdateSettingsField('notificationSubTab', "app")}
                      className={`px-4 py-2 text-sm ${notificationSubTab === "app"
                        ? "bg-blue-500 text-white rounded-t"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      App Notification
                    </button>
                  </div>

                  {/* E-Mail Notification Tab */}
                  {notificationSubTab === "email" && (
                    <div>
                      <div className="mb-6 p-4 bg-[#252525] rounded-lg">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={bool(studio?.settings?.emailNotificationEnabled, false)}
                            onChange={(e) => handleUpdateSettingsField('emailNotificationEnabled', e.target.checked)}
                            className="rounded border-gray-600 bg-transparent cursor-pointer w-4 h-4"
                          />
                          <span className="text-sm font-medium text-white text-gray-200">Activate E-Mail Notifications</span>
                        </label>
                      </div>

                      {bool(studio?.settings?.emailNotificationEnabled, false) && (
                        <div className="space-y-4 pl-4 border-l-2 border-blue-500">
                          {/* Birthday Message */}
                          <div>
                            <label className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={bool(studio?.settings?.birthdayMessageEnabled, false)}
                                onChange={(e) => handleUpdateSettingsField('birthdayMessageEnabled', e.target.checked)}
                                className="rounded border-gray-600 bg-transparent w-4 h-4"
                              />
                              <span className="text-sm text-gray-300">Send automatic Birthday Messages</span>
                            </label>
                            {bool(studio?.settings?.birthdayMessageEnabled, false) && (
                              <div className="ml-6">
                                <div className="flex gap-2 mb-2 flex-wrap">
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Studio_Name",
                                        birthdayTextareaRef,
                                        studio?.settings?.birthdayMessageTemplate || "",
                                        (value) => handleUpdateSettingsField('birthdayMessageTemplate', value),
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
                                        studio?.settings?.birthdayMessageTemplate || "",
                                        (value) => handleUpdateSettingsField('birthdayMessageTemplate', value),
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
                                        studio?.settings?.birthdayMessageTemplate || "",
                                        (value) => handleUpdateSettingsField('birthdayMessageTemplate', value),
                                      )
                                    }
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                  >
                                    Member Last Name
                                  </button>
                                </div>
                                <textarea
                                  ref={birthdayTextareaRef}
                                  value={studio?.settings?.birthdayMessageTemplate || ""}
                                  onChange={(e) => handleUpdateSettingsField('birthdayMessageTemplate', e.target.value)}
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
                                checked={bool(studio?.settings?.appointmentNotificationEnabled, false)}
                                onChange={(e) => handleUpdateSettingsField('appointmentNotificationEnabled', e.target.checked)}
                                className="rounded border-gray-600 bg-transparent w-4 h-4"
                              />
                              <span className="text-sm text-gray-300">Appointment Notifications</span>
                            </label>

                            {bool(studio?.settings?.appointmentNotificationEnabled, false) && (
                              <div className="ml-6 space-y-4">
                                {/* Confirmation */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <input
                                      type="checkbox"
                                      checked={conf.enabled}
                                      onChange={(e) => handleUpdateAppointmentNotificationTypes('confirmation', 'enabled', e.target.checked)}
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
                                              studio?.settings?.appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('confirmation', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('confirmation', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('confirmation', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('confirmation', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.confirmation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('confirmation', 'template', value),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Booked Time
                                        </button>
                                      </div>
                                      <textarea
                                        ref={confirmationTextareaRef}
                                        value={studio?.settings?.appointmentNotificationTypes?.confirmation?.template || ""}
                                        onChange={(e) => handleUpdateAppointmentNotificationTypes('confirmation', 'template', e.target.value)}
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
                                      onChange={(e) => handleUpdateAppointmentNotificationTypes('cancellation', 'enabled', e.target.checked)}
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
                                              studio?.settings?.appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('cancellation', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('cancellation', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('cancellation', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('cancellation', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.cancellation?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('cancellation', 'template', value),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Booked Time
                                        </button>
                                      </div>
                                      <textarea
                                        ref={cancellationTextareaRef}
                                        value={studio?.settings?.appointmentNotificationTypes?.cancellation?.template || ""}
                                        onChange={(e) => handleUpdateAppointmentNotificationTypes('cancellation', 'template', e.target.value)}
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
                                      onChange={(e) => handleUpdateAppointmentNotificationTypes('rescheduled', 'enabled', e.target.checked)}
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
                                              studio?.settings?.appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('rescheduled', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('rescheduled', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('rescheduled', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('rescheduled', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.rescheduled?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('rescheduled', 'template', value),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Booked Time
                                        </button>
                                      </div>
                                      <textarea
                                        ref={rescheduledTextareaRef}
                                        value={studio?.settings?.appointmentNotificationTypes?.rescheduled?.template || ""}
                                        onChange={(e) => handleUpdateAppointmentNotificationTypes('rescheduled', 'template', e.target.value)}
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
                                      onChange={(e) => handleUpdateAppointmentNotificationTypes('reminder', 'enabled', e.target.checked)}
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
                                          onChange={(e) => handleUpdateAppointmentNotificationTypes('reminder', 'hoursBefore', Number.parseInt(e.target.value || "1", 10))}
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
                                              studio?.settings?.appointmentNotificationTypes?.reminder?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('reminder', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.reminder?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('reminder', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.reminder?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('reminder', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.reminder?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('reminder', 'template', value),
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
                                              studio?.settings?.appointmentNotificationTypes?.reminder?.template || "",
                                              (value) => handleUpdateAppointmentNotificationTypes('reminder', 'template', value),
                                            )
                                          }
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                          Booked Time
                                        </button>
                                      </div>

                                      <textarea
                                        ref={reminderTextareaRef}
                                        value={studio?.settings?.appointmentNotificationTypes?.reminder?.template || ""}
                                        onChange={(e) => handleUpdateAppointmentNotificationTypes('reminder', 'template', e.target.value)}
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

                  {/* App Notification Tab */}
                  {notificationSubTab === "app" && (
                    <div>
                      <div className="mb-6 p-4 bg-[#252525] rounded-lg">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={bool(studio?.settings?.appNotificationEnabled, false)}
                            onChange={(e) => handleUpdateSettingsField('appNotificationEnabled', e.target.checked)}
                            className="rounded border-gray-600 bg-transparent cursor-pointer w-4 h-4"
                          />
                          <span className="text-sm font-medium text-white ">Activate App Notifications</span>
                        </label>
                      </div>

                      {bool(studio?.settings?.appNotificationEnabled, false) && (
                        <div className="space-y-4 pl-4 border-l-2 border-purple-500">
                          <div>
                            <label className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={bool(studio?.settings?.birthdayAppNotificationEnabled, false)}
                                onChange={(e) => handleUpdateSettingsField('birthdayAppNotificationEnabled', e.target.checked)}
                                className="rounded border-gray-600 bg-transparent w-4 h-4"
                              />
                              <span className="text-sm text-gray-300">Send automatic Birthday Messages</span>
                            </label>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={bool(studio?.settings?.appointmentAppNotificationEnabled, false)}
                                onChange={(e) => handleUpdateSettingsField('appointmentAppNotificationEnabled', e.target.checked)}
                                className="rounded border-gray-600 bg-transparent w-4 h-4"
                              />
                              <span className="text-sm text-gray-300">Appointment Notifications</span>
                            </label>

                            {bool(studio?.settings?.appointmentAppNotificationEnabled, false) && (
                              <div className="ml-6 space-y-3">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={bool(studio?.settings?.appConfirmationEnabled, false)}
                                    onChange={(e) => handleUpdateSettingsField('appConfirmationEnabled', e.target.checked)}
                                    className="rounded border-gray-600 bg-transparent w-4 h-4"
                                  />
                                  <span className="text-sm text-white">Appointment Confirmation</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={bool(studio?.settings?.appCancellationEnabled, false)}
                                    onChange={(e) => handleUpdateSettingsField('appCancellationEnabled', e.target.checked)}
                                    className="rounded border-gray-600 bg-transparent w-4 h-4"
                                  />
                                  <span className="text-sm text-white">Appointment Cancellation</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={bool(studio?.settings?.appRescheduledEnabled, false)}
                                    onChange={(e) => handleUpdateSettingsField('appRescheduledEnabled', e.target.checked)}
                                    className="rounded border-gray-600 bg-transparent w-4 h-4"
                                  />
                                  <span className="text-sm text-white">Appointment Rescheduled</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={bool(studio?.settings?.appReminderEnabled, false)}
                                    onChange={(e) => handleUpdateSettingsField('appReminderEnabled', e.target.checked)}
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

              {/* SMTP Setup Panel */}
              <Panel header="SMTP Setup" key="3" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item label={<span className="text-white">SMTP Host</span>}>
                      <Input
                        value={studio?.settings?.smtpHost || ""}
                        onChange={(e) => handleUpdateSettingsField('smtpHost', e.target.value)}
                        style={inputStyle}
                        placeholder="smtp.example.com"
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">SMTP Port</span>}>
                      <InputNumber
                        value={studio?.settings?.smtpPort || 587}
                        onChange={(value) => handleUpdateSettingsField('smtpPort', value || 587)}
                        style={inputStyle}
                        className="white-text"
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Username</span>}>
                      <Input
                        value={studio?.settings?.smtpUser || ""}
                        onChange={(e) => handleUpdateSettingsField('smtpUser', e.target.value)}
                        style={inputStyle}
                        placeholder="your-email@example.com"
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Password</span>}>
                      <Input.Password
                        value={studio?.settings?.smtpPass || ""}
                        onChange={(e) => handleUpdateSettingsField('smtpPass', e.target.value)}
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Form>
                </div>
              </Panel>

              {/* Email Signature Panel */}
              <Panel header="Email Signature" key="4" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item label={<span className="text-white">Default Email Signature</span>}>
                      <div className="bg-[#222222] rounded-xl">
                        <WysiwygEditor
                          value={studio?.settings?.emailSignature || "Best regards,\n{Studio_Name} Team"}
                          onChange={(value) => handleUpdateSettingsField('emailSignature', value)}
                          placeholder="Enter your default email signature..."
                        />
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </Panel>

              {/* Save Settings Button */}
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

          {/* Finances Tab */}
          <TabPane tab="Finances" key="5">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              <Panel header="Currency Settings" key="1" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item label={<span className="text-white">Currency</span>}>
                      <Select
                        value={studio?.currency || "€"}
                        onChange={(value) => handleUpdateField('currency', value)}
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
                  {(studio?.vatRates || []).map((rate, index) => (
                    <div key={index} className="flex flex-wrap gap-4 items-center">
                      <Input
                        placeholder="VAT Name (e.g. Standard, Reduced)"
                        value={rate.name}
                        onChange={(e) => handleUpdateItem('vatRates', index, 'name', e.target.value)}
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
                        onChange={(value) => handleUpdateItem('vatRates', index, 'percentage', value || 0)}
                        className="w-full sm:w-32"
                        style={inputStyle}
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={rate.description}
                        onChange={(e) => handleUpdateItem('vatRates', index, 'description', e.target.value)}
                        className="w-full sm:flex-1"
                        style={inputStyle}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem('vatRates', index)}
                        className="w-full sm:w-auto"
                        style={buttonStyle}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => handleAddItem('vatRates', { name: "", percentage: 0, description: "" })}
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
                        value={studio?.creditorId || ""}
                        onChange={(e) => handleUpdateField('creditorId', e.target.value)}
                        placeholder="Enter Creditor ID"
                        style={inputStyle}
                        maxLength={50}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">VAT Number</span>}>
                      <Input
                        value={studio?.vatNumber || ""}
                        onChange={(e) => handleUpdateField('vatNumber', e.target.value)}
                        placeholder="Enter VAT number"
                        style={inputStyle}
                        maxLength={30}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Bank Name</span>}>
                      <Input
                        value={studio?.bankName || ""}
                        onChange={(e) => handleUpdateField('bankName', e.target.value)}
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

          {/* Appearance Tab */}
          <TabPane tab="Appearance" key="6">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              <Panel header="Theme Settings" key="1" className="bg-[#202020]">
                <div className="space-y-4">
                  <Form layout="vertical">
                    <Form.Item label={<span className="text-white">Default Theme</span>}>
                      <Radio.Group
                        value={studio?.appearance?.theme || "dark"}
                        onChange={(e) => handleUpdateNestedField('appearance', 'theme', e.target.value)}
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
                        checked={studio?.appearance?.allowStaffThemeToggle || true}
                        onChange={(checked) => handleUpdateNestedField('appearance', 'allowStaffThemeToggle', checked)}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Allow Member to Toggle Theme</span>}>
                      <Switch
                        checked={studio?.appearance?.allowMemberThemeToggle || true}
                        onChange={(checked) => handleUpdateNestedField('appearance', 'allowMemberThemeToggle', checked)}
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
                          value={studio?.appearance?.primaryColor || "#FF843E"}
                          onChange={(color) => handleUpdateNestedField('appearance', 'primaryColor', color)}
                        />
                        <div
                          className="h-10 w-20 rounded-md flex items-center justify-center text-white"
                          style={{ backgroundColor: studio?.appearance?.primaryColor || "#FF843E" }}
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
                          value={studio?.appearance?.secondaryColor || "#1890ff"}
                          onChange={(color) => handleUpdateNestedField('appearance', 'secondaryColor', color)}
                        />
                        <div
                          className="h-10 w-20 rounded-md flex items-center justify-center text-white"
                          style={{ backgroundColor: studio?.appearance?.secondaryColor || "#1890ff" }}
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

          {/* Importing Tab */}
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
        role={selectedRoleIndex !== null ? studio?.roles?.[selectedRoleIndex] : null}
        onPermissionChange={handlePermissionChange}
      />
    </>
  )
}

export default ConfigurationPage