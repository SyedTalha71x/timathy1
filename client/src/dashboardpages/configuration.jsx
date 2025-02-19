/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
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
} from "antd"
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons"

const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

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


const ConfigurationPage = () => {
  const [studioName, setStudioName] = useState("")
  const [studioLocation, setStudioLocation] = useState("")
  const [openingHours, setOpeningHours] = useState([])
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

  const [maxCapacity, setMaxCapacity] = useState(10)
  const [logo, setLogo] = useState([])
  const [contractTypes, setContractTypes] = useState([])
  const [contractSections, setContractSections] = useState([
    { title: "Personal Information", content: "", editable: true },
    { title: "Contract Terms", content: "", editable: true },
  ])
  const [noticePeriod, setNoticePeriod] = useState(30)
  const [extensionPeriod, setExtensionPeriod] = useState(12)
  const [additionalDocs, setAdditionalDocs] = useState([])
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

  const handleAddOpeningHour = () => {
    setOpeningHours([...openingHours, { day: "", startTime: "", endTime: "" }])
  }

  const handleRemoveOpeningHour = (index) => {
    const updatedHours = openingHours.filter((_, i) => i !== index)
    setOpeningHours(updatedHours)
  }

  const handleAddRole = () => {
    setRoles([...roles, { name: "", permissions: [] }])
  }

  const handleAddAppointmentType = () => {
    setAppointmentTypes([...appointmentTypes, { name: "", duration: 30, capacity: 1, color: "#1890ff" }])
  }

  const handleAddTag = () => {
    setTags([...tags, { name: "", color: "#1890ff" }])
  }

  const handleAddContractStatus = () => {
    setContractStatuses([...contractStatuses, { name: "" }])
  }

  const handleSaveConfiguration = () => {
    if (!studioName || !studioLocation) {
      notification.error({ message: "Please fill in all required fields." })
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

              <Form.Item label={<span className="text-white">Studio Logo</span>}>
                <Upload accept="image/*" maxCount={1} onChange={handleLogoUpload} fileList={logo}>
                  <Button icon={<UploadOutlined />} style={buttonStyle}>
                    Upload Logo
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item label={<span className="text-white">Studio Location</span>} required>
                <Input
                  value={studioLocation}
                  onChange={(e) => setStudioLocation(e.target.value)}
                  placeholder="Enter studio location"
                  style={inputStyle}
                />
              </Form.Item>
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
            </Form>
          </div>
        </TabPane>

        <TabPane tab="Resources" key="2">
          <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Maximum Capacity</h3>
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
                    onChange={(e) => setTrialTraining({ ...trialTraining, name: e.target.value })}
                    style={inputStyle}
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">Duration (minutes)</span>}>
                  <InputNumber
                    value={trialTraining.duration}
                    onChange={(value) => setTrialTraining({ ...trialTraining, duration: value || 60 })}
                    style={inputStyle}
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">Capacity</span>}>
                  <InputNumber
                    value={trialTraining.capacity}
                    onChange={(value) => setTrialTraining({ ...trialTraining, capacity: value || 1 })}
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

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appointment Types</h3>
              <div className="space-y-4">
                {appointmentTypes.map((type, index) => (
                  <div key={index} className="flex flex-wrap gap-4 items-center">
                    <Input
                      placeholder="Appointment Type Name"
                      value={type.name}
                      onChange={(e) => {
                        const updatedTypes = [...appointmentTypes]
                        updatedTypes[index].name = e.target.value
                        setAppointmentTypes(updatedTypes)
                      }}
                      className="w-full sm:w-64"
                      style={inputStyle}
                    />
                    <Input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={type.duration}
                      onChange={(e) => {
                        const updatedTypes = [...appointmentTypes]
                        updatedTypes[index].duration = Number.parseInt(e.target.value, 10) || 0
                        setAppointmentTypes(updatedTypes)
                      }}
                      className="w-full sm:w-40"
                      style={inputStyle}
                    />
                    <Input
                      type="number"
                      placeholder="Capacity (1-100)"
                      value={type.capacity}
                      onChange={(e) => {
                        const updatedTypes = [...appointmentTypes]
                        updatedTypes[index].capacity = Number.parseInt(e.target.value, 10) || 0
                        setAppointmentTypes(updatedTypes)
                      }}
                      className="w-full sm:w-40"
                      style={inputStyle}
                    />
                    <ColorPicker
                      value={type.color}
                      onChange={(color) => {
                        const updatedTypes = [...appointmentTypes]
                        updatedTypes[index].color = color
                        setAppointmentTypes(updatedTypes)
                      }}
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

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tags</h3>
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
          <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contract Settings</h3>
              <Form layout="vertical">
                <Form.Item label={<span className="text-white">Notice Period (days)</span>}>
                  <InputNumber
                    value={noticePeriod}
                    onChange={(value) => setNoticePeriod(value || 30)}
                    style={inputStyle}
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">Extension Period (months)</span>}>
                  <InputNumber
                    value={extensionPeriod}
                    onChange={(value) => setExtensionPeriod(value || 12)}
                    style={inputStyle}
                  />
                </Form.Item>
              </Form>
            </div>

            <Divider className="border-[#303030]" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contract Types</h3>
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
                    <Form.Item label={<span className="text-white">Editable</span>}>
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
              <h3 className="text-lg font-medium">Additional Documents</h3>
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
          <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Birthday Messages</h3>
              <Form layout="vertical">
                <Form.Item label={<span className="text-white">Enable Birthday Messages</span>}>
                  <Switch
                    checked={birthdayMessage.enabled}
                    onChange={(checked) => setBirthdayMessage({ ...birthdayMessage, enabled: checked })}
                  />
                </Form.Item>
                <Form.Item label={<span className="text-white">Message Template</span>}>
                  <TextArea
                    value={birthdayMessage.message}
                    onChange={(e) => setBirthdayMessage({ ...birthdayMessage, message: e.target.value })}
                    rows={4}
                    style={inputStyle}
                    placeholder="Use {studio_name} as a placeholder for your studio name"
                  />
                </Form.Item>
              </Form>
            </div>
          </div>
        </TabPane>

        <TabPane tab="Payment" key="5">
          <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
            <Form layout="vertical" className="space-y-4">
              <Form.Item label={<span className="text-white">Creditor Name</span>}>
                <Input
                  value={bankDetails.creditorName}
                  onChange={(e) => setBankDetails({ ...bankDetails, creditorName: e.target.value })}
                  placeholder="Enter creditor name"
                  style={inputStyle}
                />
              </Form.Item>
              <Form.Item label={<span className="text-white">Bank Name</span>}>
                <Input
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  placeholder="Enter bank name"
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
                  onChange={(e) => setBankDetails({ ...bankDetails, creditorId: e.target.value })}
                  placeholder="Enter Creditor ID"
                  style={inputStyle}
                />
              </Form.Item>
            </Form>
          </div>
        </TabPane>
      </Tabs>

      <div className="flex justify-end">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => notification.success({ message: "Configuration saved successfully!" })}
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
`

const styleElement = document.createElement("style")
styleElement.innerHTML = styleOverrides
document.head.appendChild(styleElement)

export default ConfigurationPage

