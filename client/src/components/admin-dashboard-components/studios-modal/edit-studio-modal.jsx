/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import {
  Modal,
  Tabs,
  Collapse,
  Form,
  Input,
  Button,
  Upload,
  InputNumber,
  Select,
  Switch,
  Tooltip,
  Space,
  Radio,
  Alert,
  Checkbox,
  notification,
  Transfer,
  Tag,
} from "antd"
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  QrcodeOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileProtectOutlined,
  UserAddOutlined,
  FileTextOutlined,
  BgColorsOutlined,
  SettingOutlined,
  MailOutlined,
  MessageOutlined,
  FileSearchOutlined,
  CheckSquareOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ReadOutlined,
  LineChartOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import { toast } from "react-hot-toast"
import { QRCode, Typography } from "antd"
import { PERMISSION_GROUPS } from "../../../utils/user-panel-states/configuration-states"
import CustomModal from "./custom-modal"


// Map icon name to actual component
const GROUP_ICONS = {
  CalendarOutlined: <CalendarOutlined />,
  MailOutlined: <MailOutlined />,
  MessageOutlined: <MessageOutlined />,
  FileSearchOutlined: <FileSearchOutlined />,
  CheckSquareOutlined: <CheckSquareOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  TeamOutlined: <TeamOutlined />,
  UserAddOutlined: <UserAddOutlined />,
  FileProtectOutlined: <FileProtectOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  DollarOutlined: <DollarOutlined />,
  ReadOutlined: <ReadOutlined />,
  LineChartOutlined: <LineChartOutlined />,
  SettingOutlined: <SettingOutlined />,
}

const PERMISSION_DATA = PERMISSION_GROUPS.flatMap((g) =>
  g.items.map((perm) => ({
    key: perm,
    title: perm,
    group: g.group,
    iconName: g.icon,
  })),
)

export default function EditStudioModal({
  isOpen,
  onClose,
  selectedStudio,
  editForm,
  setEditForm,
  handleEditSubmit,
  DefaultStudioImage,
}) {
  const [form] = Form.useForm()
  const [templateName, setTemplateName] = useState("")
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)

  // Styling constants
  const inputStyle = {
    backgroundColor: "#101010",
    borderColor: "#303030",
    color: "white",
  }

  const selectStyle = {
    backgroundColor: "#101010",
    borderColor: "#303030",
    color: "white",
  }

  const buttonStyle = {
    backgroundColor: "#FF843E",
    borderColor: "#FF843E",
    color: "white",
  }

  const saveButtonStyle = {
    backgroundColor: "#FF843E",
    borderColor: "#FF843E",
    color: "white",
  }

  const tooltipStyle = {
    color: "#FF843E",
    marginLeft: "8px",
    cursor: "pointer",
  }

  // Helper functions
  const setField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateArrayItem = (key, index, patch) => {
    setEditForm((prev) => {
      const list = [...(prev[key] || [])]
      list[index] = { ...(list[index] || {}), ...patch }
      return { ...prev, [key]: list }
    })
  }

  const addArrayItem = (key, item) => {
    setEditForm((prev) => ({ ...prev, [key]: [...(prev[key] || []), item] }))
  }

  const removeArrayItem = (key, index) => {
    setEditForm((prev) => {
      const list = [...(prev[key] || [])]
      list.splice(index, 1)
      return { ...prev, [key]: list }
    })
  }

  const handleLogoUpload = (info) => {
    const file = info.file
    if (file) {
      const url = URL.createObjectURL(file)
      setField("logoUrl", url)
      setField("logoFile", file)
      toast.success("Logo selected")
    }
  }

  const applyFormatting = (textareaId, formatType) => {
    const el = document.getElementById(textareaId)
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const sel = el.value.substring(start, end)
    let wrapped = sel
    if (formatType === "bold") wrapped = `<strong>${sel}</strong>`
    if (formatType === "italic") wrapped = `<em>${sel}</em>`
    if (formatType === "underline") wrapped = `<u>${sel}</u>`
    const newContent = el.value.substring(0, start) + wrapped + el.value.substring(end)
    el.value = newContent
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + wrapped.length, start + wrapped.length)
    }, 0)
  }

  const renderHtmlContent = (html) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} className="text-white text-sm" />
  }

  const savePermissionsTemplate = () => {
    const name = templateName.trim()
    if (!name) {
      toast.error("Please enter a name for the template.")
      return
    }
    const roles = Array.isArray(editForm.roles) ? editForm.roles : []
    const next = [...(editForm.permissionTemplates || [])]

    if (next.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      toast.error("A template with this name already exists.")
      return
    }

    next.push({ name, roles })
    setField("permissionTemplates", next)
    setTemplateName("")
    toast.success("Permissions saved as template.")
  }

  const applyPermissionsTemplate = (tpl) => {
    if (!tpl || !Array.isArray(tpl.roles)) return
    setField("roles", JSON.parse(JSON.stringify(tpl.roles)))
    toast.success(`Applied template "${tpl.name}".`)
  }

  const deletePermissionsTemplate = (name) => {
    const next = (editForm.permissionTemplates || []).filter((t) => t.name !== name)
    setField("permissionTemplates", next)
    toast.success("Template deleted.")
  }

  const addPublicHolidaysToClosingDays = async () => {
    setIsLoadingHolidays(true)
    try {
      // Simulate API call to fetch public holidays
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const sampleHolidays = [
        { date: dayjs("2024-01-01"), description: "New Year" },
        { date: dayjs("2024-12-25"), description: "Christmas" },
      ]
      const currentClosingDays = editForm.closingDaysList || []
      setField("closingDaysList", [...currentClosingDays, ...sampleHolidays])
      toast.success("Public holidays imported successfully")
    } catch (error) {
      toast.error("Failed to import public holidays")
    } finally {
      setIsLoadingHolidays(false)
    }
  }

  const testEmailConnection = () => {
    notification.info({
      message: "Testing Email Connection",
      description: "Attempting to connect to SMTP server...",
    })
    setTimeout(() => {
      notification.success({
        message: "Connection Successful",
        description: "Email configuration is working correctly.",
      })
    }, 2000)
  }

  if (!isOpen || !selectedStudio) return null

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Studio Configuration"
      footer={[
        <button
          key="cancel"
          onClick={onClose}
          className="px-4 py-2 border border-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>,
        <button
          key="submit"
          onClick={handleEditSubmit}
          className="px-4 py-2 bg-[#FF843E] text-white rounded hover:bg-[#E57336] transition-colors"
        >
          Save Changes
        </button>
      ]}
    >
      <Form layout="vertical" form={form} className="space-y-4">
        <Tabs defaultActiveKey="1" style={{ color: "white" }}>
          {/* ==================== STUDIO DATA TAB ==================== */}
          <Tabs.TabPane tab="Studio Data" key="1">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              {/* Studio Information */}
              <Collapse.Panel header="Studio Information" key="1" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={editForm.logoUrl || selectedStudio.image || DefaultStudioImage}
                          alt="Studio Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Upload accept="image/*" maxCount={1} onChange={handleLogoUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />} style={buttonStyle}>
                          {editForm.logoUrl ? "Change Logo" : "Upload Logo"}
                        </Button>
                      </Upload>
                      {editForm.logoUrl && (
                        <Button
                          type="text"
                          danger
                          size="small"
                          onClick={() => {
                            setField("logoUrl", "")
                            setField("logoFile", null)
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
                        value={editForm.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="Enter studio name"
                        style={inputStyle}
                        maxLength={50}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Studio Operator</span>}>
                      <Input
                        value={editForm.ownerName || ""}
                        onChange={(e) => setField("ownerName", e.target.value)}
                        placeholder="Enter studio operator name"
                        style={inputStyle}
                        maxLength={50}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">Phone No</span>}>
                      <Input
                        value={editForm.phone}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "")
                          setField("phone", onlyDigits)
                        }}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                        placeholder="Enter phone number"
                        style={inputStyle}
                        maxLength={15}
                        inputMode="numeric"
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Email</span>}>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="Enter email"
                        style={inputStyle}
                        maxLength={60}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">Street (with number)</span>}>
                      <Input
                        value={editForm.street}
                        onChange={(e) => setField("street", e.target.value)}
                        placeholder="Enter street and number"
                        style={inputStyle}
                        maxLength={60}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">ZIP Code</span>}>
                      <Input
                        value={editForm.zipCode}
                        onChange={(e) => setField("zipCode", e.target.value)}
                        placeholder="Enter ZIP code"
                        style={inputStyle}
                        maxLength={10}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">City</span>}>
                      <Input
                        value={editForm.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder="Enter city"
                        style={inputStyle}
                        maxLength={40}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Country</span>}>
                      <Select
                        value={editForm.country}
                        onChange={(value) => setField("country", value)}
                        placeholder="Select Country"
                        style={inputStyle}
                      >
                        <Select.Option value="DE">Germany (€)</Select.Option>
                        <Select.Option value="AT">Austria (€)</Select.Option>
                        <Select.Option value="CH">Switzerland (fr)</Select.Option>
                        <Select.Option value="NL">Netherlands (€)</Select.Option>
                        <Select.Option value="BE">Belgium (€)</Select.Option>
                        <Select.Option value="FR">France (€)</Select.Option>
                        <Select.Option value="IT">Italy (€)</Select.Option>
                        <Select.Option value="ES">Spain (€)</Select.Option>
                        <Select.Option value="GB">United Kingdom (£)</Select.Option>
                        <Select.Option value="US">United States ($)</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <Form.Item label={<span className="text-white">Studio Website</span>}>
                    <Input
                      value={editForm.website}
                      onChange={(e) => setField("website", e.target.value)}
                      placeholder="Enter studio website URL"
                      style={inputStyle}
                      maxLength={50}
                    />
                  </Form.Item>
                </Form>
              </Collapse.Panel>

              {/* Opening Hours */}
              <Collapse.Panel header="Opening Hours" key="2" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-3">
                    {(editForm.openingHoursList || []).map((row, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                        <Form.Item label={<span className="text-white text-xs">Day</span>} className="mb-0">
                          <Select
                            value={row.day || ""}
                            onChange={(value) => updateArrayItem("openingHoursList", idx, { day: value })}
                            placeholder="Select day"
                            style={inputStyle}
                          >
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                              <Select.Option key={d} value={d}>
                                {d}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item label={<span className="text-white text-xs">Start Time</span>} className="mb-0">
                          <Input
                            type="time"
                            value={row.startTime || ""}
                            onChange={(e) => updateArrayItem("openingHoursList", idx, { startTime: e.target.value })}
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white text-xs">End Time</span>} className="mb-0">
                          <Input
                            type="time"
                            value={row.endTime || ""}
                            onChange={(e) => updateArrayItem("openingHoursList", idx, { endTime: e.target.value })}
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item className="mb-0">
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeArrayItem("openingHoursList", idx)}
                          />
                        </Form.Item>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => addArrayItem("openingHoursList", { day: "", startTime: "", endTime: "" })}
                      style={{ width: "100%" }}
                    >
                      Add Opening Hour
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* Closing Days */}
              <Collapse.Panel header="Closing Days" key="3" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  {editForm.country && (
                    <div className="mb-4">
                      <Alert
                        message="Public Holidays"
                        description={
                          <div>
                            <p>You can automatically import public holidays for {editForm.country}.</p>
                            <Button
                              onClick={addPublicHolidaysToClosingDays}
                              loading={isLoadingHolidays}
                              icon={<CalendarOutlined />}
                              style={{ ...buttonStyle, marginTop: "8px" }}
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
                  <div className="space-y-3">
                    {(editForm.closingDaysList || []).map((row, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                        <Form.Item label={<span className="text-white text-xs">Date</span>} className="mb-0">
                          <Input
                            type="date"
                            value={row.date || ""}
                            onChange={(e) => updateArrayItem("closingDaysList", idx, { date: e.target.value })}
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item
                          label={<span className="text-white text-xs">Description</span>}
                          className="mb-0 md:col-span-3"
                        >
                          <Input
                            value={row.description || ""}
                            onChange={(e) => updateArrayItem("closingDaysList", idx, { description: e.target.value })}
                            placeholder="e.g., Public Holiday"
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item className="mb-0">
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeArrayItem("closingDaysList", idx)}
                          />
                        </Form.Item>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => addArrayItem("closingDaysList", { date: "", description: "" })}
                      style={{ width: "100%" }}
                    >
                      Add Closing Day
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>

          {/* ==================== RESOURCES TAB ==================== */}
          <Tabs.TabPane tab="Resources" key="2">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              {/* Capacity Settings */}
              <Collapse.Panel header="Capacity Settings" key="1" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <Form.Item
                    label={
                      <div className="flex items-center">
                        <span className="text-white">Default Maximum Capacity</span>
                        <Tooltip title="Maximum number of participants for all appointment types">
                          <InfoCircleOutlined style={tooltipStyle} />
                        </Tooltip>
                      </div>
                    }
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      value={editForm.maxCapacity ?? 10}
                      onChange={(value) => setField("maxCapacity", value || 10)}
                      style={inputStyle}
                      className="white-text"
                    />
                  </Form.Item>
                </Form>
              </Collapse.Panel>

              {/* Appointment Types */}
              <Collapse.Panel header="Appointment Types" key="2" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-4">
                    {(editForm.appointmentTypes || []).map((type, index) => (
                      <Collapse key={index} className="border border-[#303030] rounded-lg overflow-hidden">
                        <Collapse.Panel
                          header={type.name || `Appointment Type ${index + 1}`}
                          key="1"
                          className="bg-[#252525]"
                        >
                          <Form layout="vertical" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Form.Item label={<span className="text-white">Appointment Type Name</span>}>
                                <Input
                                  value={type.name || ""}
                                  onChange={(e) => updateArrayItem("appointmentTypes", index, { name: e.target.value })}
                                  placeholder="Appointment Type Name"
                                  style={inputStyle}
                                />
                              </Form.Item>
                              <Form.Item label={<span className="text-white">Duration (minutes)</span>}>
                                <InputNumber
                                  min={0}
                                  value={type.duration ?? 30}
                                  onChange={(value) =>
                                    updateArrayItem("appointmentTypes", index, { duration: value || 30 })
                                  }
                                  style={inputStyle}
                                  className="white-text"
                                />
                              </Form.Item>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Form.Item label={<span className="text-white">Capacity</span>}>
                                <InputNumber
                                  min={0}
                                  value={type.capacity ?? 1}
                                  onChange={(value) =>
                                    updateArrayItem("appointmentTypes", index, { capacity: value || 1 })
                                  }
                                  style={inputStyle}
                                  className="white-text"
                                />
                              </Form.Item>
                              <Form.Item label={<span className="text-white">Interval (minutes)</span>}>
                                <InputNumber
                                  min={0}
                                  value={type.interval ?? 30}
                                  onChange={(value) =>
                                    updateArrayItem("appointmentTypes", index, { interval: value || 30 })
                                  }
                                  style={inputStyle}
                                  className="white-text"
                                />
                              </Form.Item>
                            </div>
                            <Form.Item label={<span className="text-white">Color</span>}>
                              <Input
                                type="color"
                                value={type.color || "#1890ff"}
                                onChange={(e) => updateArrayItem("appointmentTypes", index, { color: e.target.value })}
                                style={{ height: "40px", ...inputStyle }}
                              />
                            </Form.Item>
                            <Form.Item label={<span className="text-white">Upload Images</span>}>
                              <Upload
                                accept="image/*"
                                multiple
                                onChange={(info) => {
                                  const files = info.fileList.map((f) => f.originFileObj).filter(Boolean)
                                  updateArrayItem("appointmentTypes", index, { images: files })
                                  toast.success(`${files.length} image(s) selected`)
                                }}
                              >
                                <Button icon={<UploadOutlined />}>Upload Images</Button>
                              </Upload>
                            </Form.Item>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => removeArrayItem("appointmentTypes", index)}
                              style={{ width: "100%" }}
                            >
                              Remove Appointment Type
                            </Button>
                          </Form>
                        </Collapse.Panel>
                      </Collapse>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        addArrayItem("appointmentTypes", {
                          name: "",
                          duration: 30,
                          capacity: 1,
                          color: "#1890ff",
                          interval: 30,
                          images: [],
                        })
                      }
                      style={{ width: "100%" }}
                    >
                      Add Appointment Type
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* Lead Sources */}
              <Collapse.Panel header="Lead Sources" key="3" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-3">
                    {(editForm.leadSources || []).map((src, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr,48px] gap-2 items-end">
                        <Form.Item label={<span className="text-white text-xs">Source Name</span>} className="mb-0">
                          <Input
                            value={src.name || ""}
                            onChange={(e) => updateArrayItem("leadSources", idx, { name: e.target.value })}
                            placeholder="e.g., Website"
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Button danger icon={<DeleteOutlined />} onClick={() => removeArrayItem("leadSources", idx)} />
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => addArrayItem("leadSources", { name: "" })}
                      style={{ width: "100%" }}
                    >
                      Add Lead Source
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* TO-DO Tags */}
              <Collapse.Panel header="TO-DO Tags" key="4" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-3">
                    {(editForm.tags || []).map((tag, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr,160px,48px] gap-2 items-end">
                        <Form.Item label={<span className="text-white text-xs">Tag Name</span>} className="mb-0">
                          <Input
                            value={tag.name || ""}
                            onChange={(e) => updateArrayItem("tags", idx, { name: e.target.value })}
                            placeholder="Tag Name"
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white text-xs">Color</span>} className="mb-0">
                          <Input
                            type="color"
                            value={tag.color || "#1890ff"}
                            onChange={(e) => updateArrayItem("tags", idx, { color: e.target.value })}
                            style={{ height: "40px", ...inputStyle }}
                          />
                        </Form.Item>
                        <Button danger icon={<DeleteOutlined />} onClick={() => removeArrayItem("tags", idx)} />
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => addArrayItem("tags", { name: "", color: "#1890ff" })}
                      style={{ width: "100%" }}
                    >
                      Add Tag
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* Staff Management */}
             {/* Staff Management */}
<Collapse.Panel header="Staff Management" key="5" className="bg-[#202020]">
  <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
    <Collapse.Panel header="General Settings" key="2" className="bg-[#252525]">
      <div className="space-y-4">
        <Form.Item>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-white sm:w-38">Default Vacation Days</label>
            <InputNumber
              min={0}
              max={365}
              value={editForm.defaultVacationDays ?? 0}
              onChange={(value) => setField("defaultVacationDays", value || 0)}
              style={inputStyle}
              className="white-text"
            />
          </div>
        </Form.Item>
      </div>
    </Collapse.Panel>

    <Collapse.Panel header="Staff Roles" key="1" className="bg-[#252525]">
      <div className="space-y-4">
        {(editForm.roles || []).map((role, index) => (
          <div key={index} className="flex flex-col gap-4 p-3 border border-[#303030] rounded-lg">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Input
                placeholder="Role Name"
                value={role.name}
                onChange={(e) => {
                  const updatedRoles = [...(editForm.roles || [])]
                  updatedRoles[index].name = e.target.value
                  setField("roles", updatedRoles)
                }}
                className="!w-full sm:!w-48 !py-3.5"
                style={inputStyle}
              />

              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={role.color || "#1890ff"}
                  onChange={(e) => {
                    const updatedRoles = [...(editForm.roles || [])]
                    updatedRoles[index].color = e.target.value
                    setField("roles", updatedRoles)
                  }}
                  style={{ height: "40px", width: "60px", ...inputStyle }}
                />
                <Tooltip title="Role display color">
                  <InfoCircleOutlined style={tooltipStyle} />
                </Tooltip>
              </div>

              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeArrayItem("roles", index)}
                className="w-full sm:w-auto mt-2 sm:mt-0"
                style={buttonStyle}
              >
                Remove
              </Button>
            </div>

            {/* NEW PERMISSIONS TRANSFER SYSTEM */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0">
                <Transfer
                  dataSource={PERMISSION_DATA}
                  targetKeys={role.permissions || []}
                  onChange={(nextTargetKeys) => {
                    const updatedRoles = [...(editForm.roles || [])]
                    updatedRoles[index].permissions = nextTargetKeys
                    setField("roles", updatedRoles)
                  }}
                  render={(item) => (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        color: "#ffffff",
                        fontSize: "12px",
                        padding: "4px 0",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          width: 16,
                        }}
                      >
                        {GROUP_ICONS[item.iconName]}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#ffffff",
                        }}
                      >
                        {item.title}
                      </span>
                      <Tag
                        color="blue"
                        style={{
                          marginLeft: 4,
                          fontSize: "10px",
                          padding: "0 4px",
                        }}
                      >
                        {item.group}
                      </Tag>
                    </span>
                  )}
                  titles={["Available Permissions", "Assigned Permissions"]}
                  showSearch
                  filterOption={(inputValue, item) =>
                    item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                    item.group.toLowerCase().includes(inputValue.toLowerCase())
                  }
                  listStyle={{
                    width: "calc(50% - 22px)",
                    height: 280,
                  }}
                  className="!w-full responsive-transfer"
                  operations={["Assign", "Remove"]}
                  selectAllLabels={[
                    (selectedCount, totalCount) =>
                      `Available ${selectedCount}/${totalCount}`,
                    (selectedCount, totalCount) =>
                      `Assigned ${selectedCount}/${totalCount}`,
                  ]}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="dashed"
          onClick={() => addArrayItem("roles", { name: "", permissions: [], color: "#1890ff" })}
          icon={<PlusOutlined />}
          className="w-full sm:w-auto"
          style={buttonStyle}
        >
          Add Role
        </Button>
      </div>
    </Collapse.Panel>
  </Collapse>
</Collapse.Panel>

              {/* Member Management - QR Code Check-In */}
              <Collapse.Panel header="Member Management" key="6" className="bg-[#202020]">
                <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
                  <Collapse.Panel header="QR Code Check-In" key="1" className="bg-[#252525]">
                    <div className="space-y-6">
                      <Form.Item>
                        <div className="flex items-center">
                          <label className="text-white mr-4">Allow Member Check-In with QR-Code</label>
                          <Switch
                            checked={editForm.allowMemberQRCheckIn}
                            onChange={(checked) => setField("allowMemberQRCheckIn", checked)}
                          />
                        </div>
                      </Form.Item>

                      {editForm.allowMemberQRCheckIn && (
                        <div className="space-y-6 p-4 border border-[#303030] rounded-lg">
                          <div className="flex flex-col items-center space-y-4">
                            <h1 className="text-white text-center text-xl">Member Check-In QR Code</h1>

                            <div className="p-4 bg-white rounded-lg">
                              <QRCode
                                value={editForm.memberQRCodeUrl || "https://your-studio-app.com/member-checkin"}
                                size={200}
                                level="H"
                              />
                            </div>

                            {editForm.logoUrl && (
                              <div className="w-24 h-24 rounded-lg overflow-hidden border border-[#303030]">
                                <img
                                  src={editForm.logoUrl || "/placeholder.svg"}
                                  alt="Studio Logo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="flex gap-4">
                              <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                style={saveButtonStyle}
                                onClick={() => {
                                  notification.success({
                                    message: "QR Code Saved",
                                    description: "QR code settings have been saved successfully.",
                                  })
                                }}
                              >
                                Save QR Settings
                              </Button>

                              <Button
                                icon={<QrcodeOutlined />}
                                style={buttonStyle}
                                onClick={() => {
                                  window.print()
                                }}
                              >
                                Print QR Code
                              </Button>
                            </div>

                            <div className="text-center">
                              <p className="text-gray-400 text-sm">
                                Members can scan this QR code to check in for appointments
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>

          {/* ==================== CONTRACTS TAB ==================== */}
          <Tabs.TabPane tab="Contracts" key="3">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              {/* Contract Types */}
              <Collapse.Panel header="Contract Types" key="1" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-4">
                    {(editForm.contractTypes || []).map((row, idx) => (
                      <Collapse key={idx} className="border border-[#303030] rounded-lg overflow-hidden">
                        <Collapse.Panel header={row.name || `Contract ${idx + 1}`} key="1" className="bg-[#252525]">
                          <Form layout="vertical" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Form.Item label={<span className="text-white">Contract Name</span>}>
                                <Input
                                  value={row.name || ""}
                                  onChange={(e) => updateArrayItem("contractTypes", idx, { name: e.target.value })}
                                  placeholder="Name"
                                  style={inputStyle}
                                />
                              </Form.Item>
                              <Form.Item label={<span className="text-white">Duration (months)</span>}>
                                <InputNumber
                                  min={0}
                                  value={row.duration ?? 12}
                                  onChange={(value) => updateArrayItem("contractTypes", idx, { duration: value || 12 })}
                                  style={inputStyle}
                                  className="white-text"
                                />
                              </Form.Item>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Form.Item label={<span className="text-white">Cost</span>}>
                                <InputNumber
                                  min={0}
                                  value={row.cost ?? 0}
                                  onChange={(value) => updateArrayItem("contractTypes", idx, { cost: value || 0 })}
                                  style={inputStyle}
                                  precision={2}
                                  className="white-text"
                                />
                              </Form.Item>
                              <Form.Item label={<span className="text-white">Billing Period</span>}>
                                <Select
                                  value={row.billingPeriod || "monthly"}
                                  onChange={(value) => updateArrayItem("contractTypes", idx, { billingPeriod: value })}
                                  style={inputStyle}
                                >
                                  <Select.Option value="weekly">Weekly</Select.Option>
                                  <Select.Option value="monthly">Monthly</Select.Option>
                                  <Select.Option value="quarterly">Quarterly</Select.Option>
                                  <Select.Option value="yearly">Yearly</Select.Option>
                                  <Select.Option value="annually">Annually</Select.Option>
                                </Select>
                              </Form.Item>
                            </div>
                            <Form.Item
                              label={
                                <div className="flex items-center">
                                  <span className="text-white">User Capacity</span>
                                  <Tooltip title="Maximum number of appointments a member can book per billing period">
                                    <InfoCircleOutlined style={tooltipStyle} />
                                  </Tooltip>
                                </div>
                              }
                            >
                              <InputNumber
                                min={0}
                                value={row.userCapacity ?? 0}
                                onChange={(value) =>
                                  updateArrayItem("contractTypes", idx, { userCapacity: value || 0 })
                                }
                                style={inputStyle}
                                 className="white-text"
                              />
                            </Form.Item>
                            <Form.Item label={<span className="text-white">Auto Renewal</span>}>
                              <Switch
                                checked={!!row.autoRenewal}
                                onChange={(checked) => updateArrayItem("contractTypes", idx, { autoRenewal: checked })}
                              />
                            </Form.Item>
                            {row.autoRenewal && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Form.Item label={<span className="text-white">Renewal Period (months)</span>}>
                                  <InputNumber
                                    min={0}
                                    value={row.renewalPeriod ?? 1}
                                    onChange={(value) =>
                                      updateArrayItem("contractTypes", idx, { renewalPeriod: value || 1 })
                                    }
                                    style={inputStyle}
                                  />
                                </Form.Item>
                                <Form.Item label={<span className="text-white">Renewal Price</span>}>
                                  <InputNumber
                                    min={0}
                                    value={row.renewalPrice ?? 0}
                                    onChange={(value) =>
                                      updateArrayItem("contractTypes", idx, { renewalPrice: value || 0 })
                                    }
                                    style={inputStyle}
                                    precision={2}
                                  />
                                </Form.Item>
                                <Form.Item label={<span className="text-white">Cancellation Period (days)</span>}>
                                  <InputNumber
                                    min={0}
                                    value={row.cancellationPeriod ?? 30}
                                    onChange={(value) =>
                                      updateArrayItem("contractTypes", idx, { cancellationPeriod: value || 30 })
                                    }
                                    style={inputStyle}
                                  />
                                </Form.Item>
                              </div>
                            )}
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => removeArrayItem("contractTypes", idx)}
                              style={{ width: "100%" }}
                            >
                              Remove Contract Type
                            </Button>
                          </Form>
                        </Collapse.Panel>
                      </Collapse>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        addArrayItem("contractTypes", {
                          name: "",
                          duration: 12,
                          cost: 0,
                          billingPeriod: "monthly",
                          userCapacity: 0,
                          autoRenewal: false,
                          renewalPeriod: 1,
                          renewalPrice: 0,
                          cancellationPeriod: 30,
                        })
                      }
                      style={{ width: "100%" }}
                    >
                      Add Contract Type
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* Contract Sections */}
              <Collapse.Panel header="Contract Sections" key="2" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-4">
                    {(editForm.contractSections || []).map((section, index) => (
                      <Collapse key={index} className="border border-[#303030] rounded-lg overflow-hidden">
                        <Collapse.Panel header={section.title || "New Section"} key="1" className="bg-[#252525]">
                          <Form layout="vertical" className="space-y-4">
                            <Form.Item label={<span className="text-white">Section Title</span>}>
                              <Input
                                value={section.title}
                                onChange={(e) => {
                                  const updated = [...(editForm.contractSections || [])]
                                  updated[index].title = e.target.value
                                  setField("contractSections", updated)
                                }}
                                style={inputStyle}
                              />
                            </Form.Item>
                            <Form.Item label={<span className="text-white">Content</span>}>
                              <div className="flex gap-2 mb-2">
                                <Button
                                  icon={<BoldOutlined />}
                                  onClick={() => applyFormatting(`contract-content-textarea-${index}`, "bold")}
                                  style={buttonStyle}
                                  size="small"
                                />
                                <Button
                                  icon={<ItalicOutlined />}
                                  onClick={() => applyFormatting(`contract-content-textarea-${index}`, "italic")}
                                  style={buttonStyle}
                                  size="small"
                                />
                                <Button
                                  icon={<UnderlineOutlined />}
                                  onClick={() => applyFormatting(`contract-content-textarea-${index}`, "underline")}
                                  style={buttonStyle}
                                  size="small"
                                />
                              </div>
                              <Input.TextArea
                                id={`contract-content-textarea-${index}`}
                                value={section.content}
                                onChange={(e) => {
                                  const updated = [...(editForm.contractSections || [])]
                                  updated[index].content = e.target.value
                                  setField("contractSections", updated)
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
                                  const updated = [...(editForm.contractSections || [])]
                                  updated[index].editable = checked
                                  setField("contractSections", updated)
                                }}
                              />
                            </Form.Item>
                            <Form.Item label={<span className="text-white">Requires Agreement</span>}>
                              <Switch
                                checked={section.requiresAgreement}
                                onChange={(checked) => {
                                  const updated = [...(editForm.contractSections || [])]
                                  updated[index].requiresAgreement = checked
                                  setField("contractSections", updated)
                                }}
                              />
                            </Form.Item>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                const updated = (editForm.contractSections || []).filter((_, i) => i !== index)
                                setField("contractSections", updated)
                              }}
                              style={{ width: "100%" }}
                            >
                              Remove Section
                            </Button>
                          </Form>
                        </Collapse.Panel>
                      </Collapse>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        addArrayItem("contractSections", {
                          title: "New Section",
                          content: "",
                          editable: false,
                          requiresAgreement: true,
                        })
                      }
                      style={{ width: "100%" }}
                    >
                      Add Contract Section
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* Pause Reasons */}
              <Collapse.Panel header="Pause Reasons" key="3" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-3">
                    {(editForm.contractPauseReasons || []).map((row, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr,180px,48px] gap-2 items-end">
                        <Form.Item label={<span className="text-white text-xs">Reason</span>} className="mb-0">
                          <Input
                            value={row.name || ""}
                            onChange={(e) => updateArrayItem("contractPauseReasons", idx, { name: e.target.value })}
                            placeholder="Reason (e.g., Vacation)"
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white text-xs">Max Days</span>} className="mb-0">
                          <InputNumber
                            min={0}
                            value={row.maxDays ?? 30}
                            onChange={(value) => updateArrayItem("contractPauseReasons", idx, { maxDays: value || 30 })}
                            style={inputStyle}
                            className="white-text"
                          />
                        </Form.Item>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeArrayItem("contractPauseReasons", idx)}
                        />
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => addArrayItem("contractPauseReasons", { name: "", maxDays: 30 })}
                      style={{ width: "100%" }}
                    >
                      Add Pause Reason
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* Contract Settings */}
              <Collapse.Panel header="Contract Settings" key="4" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">Default Notice Period (days)</span>}>
                      <InputNumber
                        min={0}
                        value={editForm.noticePeriod ?? 30}
                        onChange={(value) => setField("noticePeriod", value || 30)}
                        style={inputStyle}
                        className="white-text"

                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Default Extension Period (months)</span>}>
                      <InputNumber
                        min={0}
                        value={editForm.extensionPeriod ?? 12}
                        onChange={(value) => setField("extensionPeriod", value || 12)}
                        style={inputStyle}
                        className="white-text"

                      />
                    </Form.Item>
                  </div>
                  <Form.Item label={<span className="text-white">Allow Member Self-Cancellation</span>}>
                    <Switch
                      checked={!!editForm.allowMemberSelfCancellation}
                      onChange={(checked) => setField("allowMemberSelfCancellation", checked)}
                    />
                  </Form.Item>
                </Form>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>

          {/* ==================== FINANCES TAB ==================== */}
          <Tabs.TabPane tab="Finances" key="4">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              {/* Currency Settings */}
              <Collapse.Panel header="Currency Settings" key="1" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <Form.Item label={<span className="text-white">Currency</span>}>
                    <Select
                      value={editForm.currency || "€"}
                      onChange={(value) => setField("currency", value)}
                      style={inputStyle}
                    >
                      <Select.Option value="€">€ (Euro)</Select.Option>
                      <Select.Option value="$">$ (US Dollar)</Select.Option>
                      <Select.Option value="£">£ (British Pound)</Select.Option>
                      <Select.Option value="¥">¥ (Japanese Yen)</Select.Option>
                      <Select.Option value="Fr">Fr (Swiss Franc)</Select.Option>
                      <Select.Option value="A$">A$ (Australian Dollar)</Select.Option>
                      <Select.Option value="C$">C$ (Canadian Dollar)</Select.Option>
                      <Select.Option value="kr">kr (Swedish Krona)</Select.Option>
                    </Select>
                  </Form.Item>
                  <p className="text-xs text-gray-400">
                    You can now manually select your preferred currency regardless of country selection.
                  </p>
                </Form>
              </Collapse.Panel>

              {/* VAT Rates */}
              <Collapse.Panel header="VAT Rates" key="2" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-3">
                    {(editForm.vatRates || []).map((rate, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr,180px,1fr,48px] gap-2 items-end">
                        <Form.Item label={<span className="text-white text-xs">VAT Name</span>} className="mb-0">
                          <Input
                            value={rate.name || ""}
                            onChange={(e) => updateArrayItem("vatRates", idx, { name: e.target.value })}
                            placeholder="e.g., Standard"
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white text-xs">Rate (%)</span>} className="mb-0">
                          <InputNumber
                            min={0}
                            max={100}
                            value={rate.percentage ?? 0}
                            onChange={(value) => updateArrayItem("vatRates", idx, { percentage: value || 0 })}
                            style={inputStyle}
                            className="white-text"

                          />
                        </Form.Item>
                        <Form.Item label={<span className="text-white text-xs">Description</span>} className="mb-0">
                          <Input
                            value={rate.description || ""}
                            onChange={(e) => updateArrayItem("vatRates", idx, { description: e.target.value })}
                            placeholder="Optional"
                            style={inputStyle}
                          />
                        </Form.Item>
                        <Button danger icon={<DeleteOutlined />} onClick={() => removeArrayItem("vatRates", idx)} />
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => addArrayItem("vatRates", { name: "", percentage: 0, description: "" })}
                      style={{ width: "100%" }}
                    >
                      Add VAT Rate
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* Payment Settings */}
              <Collapse.Panel header="Payment Settings" key="3" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <Form.Item label={<span className="text-white">VAT Number</span>}>
                    <Input
                      value={editForm.vatNumber || ""}
                      onChange={(e) => setField("vatNumber", e.target.value)}
                      placeholder="Enter VAT number"
                      style={inputStyle}
                      maxLength={30}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Bank Name</span>}>
                    <Input
                      value={editForm.bankName || ""}
                      onChange={(e) => setField("bankName", e.target.value)}
                      placeholder="Enter bank name"
                      style={inputStyle}
                      maxLength={50}
                    />
                  </Form.Item>
                </Form>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>

          {/* ==================== COMMUNICATION TAB ==================== */}
          <Tabs.TabPane tab="Communication" key="5">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              {/* General Notifications */}
              <Collapse.Panel header="General Notifications" key="1" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">Email Notifications</span>}>
                      <Switch
                        checked={!!editForm.emailNotifications}
                        onChange={(checked) => setField("emailNotifications", checked)}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Chat Notifications</span>}>
                      <Switch
                        checked={!!editForm.chatNotifications}
                        onChange={(checked) => setField("chatNotifications", checked)}
                      />
                    </Form.Item>
                  </div>
                  <Form.Item label={<span className="text-white">Auto-Archive Duration (days)</span>}>
                    <InputNumber
                      min={1}
                      max={365}
                      value={editForm.autoArchiveDuration ?? 30}
                      onChange={(value) => setField("autoArchiveDuration", value || 30)}
                      style={inputStyle}
                      className="white-text"

                    />
                  </Form.Item>
                </Form>
              </Collapse.Panel>

              {/* Email Signature */}
              <Collapse.Panel header="Email Signature" key="2" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <Form.Item label={<span className="text-white">Default Email Signature</span>}>
                    <div className="bg-[#222222] rounded-xl">
                      <div className="flex items-center gap-2 p-2 border-b border-gray-700">
                        <Button
                          onClick={() => applyFormatting("email-signature-textarea", "bold")}
                          className="p-1 hover:bg-gray-600 rounded text-sm font-bold"
                          style={buttonStyle}
                          icon={<BoldOutlined />}
                        />
                        <Button
                          onClick={() => applyFormatting("email-signature-textarea", "italic")}
                          className="p-1 hover:bg-gray-600 rounded text-sm italic"
                          style={buttonStyle}
                          icon={<ItalicOutlined />}
                        />
                        <Button
                          onClick={() => applyFormatting("email-signature-textarea", "underline")}
                          className="p-1 hover:bg-gray-600 rounded text-sm underline"
                          style={buttonStyle}
                          icon={<UnderlineOutlined />}
                        />
                      </div>
                      <Input.TextArea
                        id="email-signature-textarea"
                        value={editForm.emailSignature || "Best regards,\n{Studio_Name} Team"}
                        onChange={(e) => setField("emailSignature", e.target.value)}
                        className="w-full bg-transparent text-white px-4 py-2 text-sm h-24 resize-none focus:outline-none"
                        placeholder="Enter your default email signature..."
                        style={inputStyle}
                      />
                    </div>
                  </Form.Item>
                </Form>
              </Collapse.Panel>

              {/* SMTP Setup */}
              <Collapse.Panel header="SMTP Setup" key="3" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <Form.Item label={<span className="text-white">SMTP Server</span>}>
                    <Input
                      value={editForm.emailConfig?.smtpServer || ""}
                      onChange={(e) =>
                        setField("emailConfig", {
                          ...(editForm.emailConfig || {}),
                          smtpServer: e.target.value,
                        })
                      }
                      placeholder="smtp.example.com"
                      style={inputStyle}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">SMTP Port</span>}>
                    <InputNumber
                      value={editForm.emailConfig?.smtpPort ?? 587}
                      onChange={(value) =>
                        setField("emailConfig", {
                          ...(editForm.emailConfig || {}),
                          smtpPort: value || 587,
                        })
                      }
                      style={inputStyle}
                      className="white-text"

                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Email Address (Username)</span>}>
                    <Input
                      value={editForm.emailConfig?.smtpUser || ""}
                      onChange={(e) =>
                        setField("emailConfig", {
                          ...(editForm.emailConfig || {}),
                          smtpUser: e.target.value,
                        })
                      }
                      placeholder="studio@example.com"
                      style={inputStyle}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Password</span>}>
                    <Input.Password
                      value={editForm.emailConfig?.smtpPass || ""}
                      onChange={(e) =>
                        setField("emailConfig", {
                          ...(editForm.emailConfig || {}),
                          smtpPass: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Default Sender Name</span>}>
                    <Input
                      value={editForm.emailConfig?.senderName || ""}
                      onChange={(e) =>
                        setField("emailConfig", {
                          ...(editForm.emailConfig || {}),
                          senderName: e.target.value,
                        })
                      }
                      placeholder="Your Studio Name"
                      style={inputStyle}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Use SSL/TLS</span>}>
                    <Switch
                      checked={!!editForm.emailConfig?.useSSL}
                      onChange={(checked) =>
                        setField("emailConfig", {
                          ...(editForm.emailConfig || {}),
                          useSSL: checked,
                        })
                      }
                    />
                  </Form.Item>
                  <Button type="primary" style={buttonStyle} onClick={testEmailConnection}>
                    Test Connection
                  </Button>
                </Form>
              </Collapse.Panel>

              {/* Birthday Messages */}
              <Collapse.Panel header="Birthday Messages" key="4" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <Form.Item label={<span className="text-white">Enable Birthday Messages</span>}>
                    <Switch
                      checked={!!editForm.birthdayMessages?.enabled}
                      onChange={(checked) =>
                        setField("birthdayMessages", {
                          ...(editForm.birthdayMessages || {}),
                          enabled: checked,
                        })
                      }
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Message Template</span>}>
                    <Input.TextArea
                      value={editForm.birthdayMessages?.message || "Happy Birthday! 🎉 Best wishes from {Studio_Name}"}
                      onChange={(e) =>
                        setField("birthdayMessages", {
                          ...(editForm.birthdayMessages || {}),
                          message: e.target.value,
                        })
                      }
                      rows={5}
                      style={inputStyle}
                      disabled={!editForm.birthdayMessages?.enabled}
                    />
                  </Form.Item>
                  <p className="text-xs text-gray-400">
                    Variables available: {"{Studio_Name}"} and {"{Member_Name}"}.
                  </p>
                </Form>
              </Collapse.Panel>

              {/* Appointment Notifications */}
              <Collapse.Panel header="Appointment Notifications" key="5" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-4">
                    {(editForm.appointmentNotifications || []).map((n, idx) => (
                      <Collapse key={idx} className="border border-[#303030] rounded-lg overflow-hidden">
                        <Collapse.Panel header={n.title || `Notification ${idx + 1}`} key="1" className="bg-[#252525]">
                          <Form layout="vertical" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Form.Item label={<span className="text-white">Type</span>}>
                                <Input
                                  value={n.type || ""}
                                  onChange={(e) =>
                                    updateArrayItem("appointmentNotifications", idx, { type: e.target.value })
                                  }
                                  placeholder="Type (e.g., booking)"
                                  style={inputStyle}
                                />
                              </Form.Item>
                              <Form.Item label={<span className="text-white">Title</span>}>
                                <Input
                                  value={n.title || ""}
                                  onChange={(e) =>
                                    updateArrayItem("appointmentNotifications", idx, { title: e.target.value })
                                  }
                                  placeholder="Title"
                                  style={inputStyle}
                                />
                              </Form.Item>
                            </div>
                            <Form.Item label={<span className="text-white">Message</span>}>
                              <Input.TextArea
                                value={n.message || ""}
                                onChange={(e) =>
                                  updateArrayItem("appointmentNotifications", idx, { message: e.target.value })
                                }
                                rows={5}
                                style={inputStyle}
                              />
                            </Form.Item>
                            <Form.Item label={<span className="text-white">Enabled</span>}>
                              <Switch
                                checked={n.enabled !== false}
                                onChange={(checked) =>
                                  updateArrayItem("appointmentNotifications", idx, { enabled: checked })
                                }
                              />
                            </Form.Item>
                            <Form.Item label={<span className="text-white">Send Via</span>}>
                              <Checkbox.Group
                                value={n.sendVia || []}
                                onChange={(values) =>
                                  updateArrayItem("appointmentNotifications", idx, { sendVia: values })
                                }
                              >
                                <Checkbox value="email">Email</Checkbox>
                                <Checkbox value="platform">Platform</Checkbox>
                              </Checkbox.Group>
                            </Form.Item>
                            <p className="text-xs text-gray-400">
                              Variables: {"{Studio_Name}"}, {"{Member_Name}"}, {"{Appointment_Type}"}, {"{Booked_Time}"}
                            </p>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => removeArrayItem("appointmentNotifications", idx)}
                              style={{ width: "100%" }}
                            >
                              Remove Notification
                            </Button>
                          </Form>
                        </Collapse.Panel>
                      </Collapse>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        addArrayItem("appointmentNotifications", {
                          type: "booking",
                          title: "Appointment Confirmation",
                          message: "Hello {Member_Name}, your {Appointment_Type} has been booked for {Booked_Time}.",
                          sendVia: ["email", "platform"],
                          enabled: true,
                        })
                      }
                      style={{ width: "100%" }}
                    >
                      Add Notification
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* Broadcast Messages */}
              <Collapse.Panel header="Broadcast Messages" key="6" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <div className="space-y-4">
                    {(editForm.broadcastMessages || []).map((m, idx) => (
                      <Collapse key={idx} className="border border-[#303030] rounded-lg overflow-hidden">
                        <Collapse.Panel header={m.title || `Broadcast ${idx + 1}`} key="1" className="bg-[#252525]">
                          <Form layout="vertical" className="space-y-4">
                            <Form.Item label={<span className="text-white">Title</span>}>
                              <Input
                                value={m.title || ""}
                                onChange={(e) => updateArrayItem("broadcastMessages", idx, { title: e.target.value })}
                                placeholder="Title"
                                style={inputStyle}
                              />
                            </Form.Item>
                            <Form.Item label={<span className="text-white">Message</span>}>
                              <Input.TextArea
                                value={m.message || ""}
                                onChange={(e) => updateArrayItem("broadcastMessages", idx, { message: e.target.value })}
                                rows={5}
                                style={inputStyle}
                              />
                            </Form.Item>
                            <Form.Item label={<span className="text-white">Send Via</span>}>
                              <Checkbox.Group
                                value={m.sendVia || []}
                                onChange={(values) => updateArrayItem("broadcastMessages", idx, { sendVia: values })}
                              >
                                <Checkbox value="email">Email</Checkbox>
                                <Checkbox value="platform">Platform</Checkbox>
                              </Checkbox.Group>
                            </Form.Item>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => removeArrayItem("broadcastMessages", idx)}
                              style={{ width: "100%" }}
                            >
                              Remove Broadcast
                            </Button>
                          </Form>
                        </Collapse.Panel>
                      </Collapse>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        addArrayItem("broadcastMessages", { title: "", message: "", sendVia: ["email", "platform"] })
                      }
                      style={{ width: "100%" }}
                    >
                      Add Broadcast
                    </Button>
                  </div>
                </Form>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>

          {/* ==================== APPEARANCE TAB ==================== */}
          <Tabs.TabPane tab="Appearance" key="6">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
              {/* Theme Settings */}
              <Collapse.Panel header="Theme Settings" key="1" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <Form.Item label={<span className="text-white">Default Theme</span>}>
                    <Radio.Group
                      value={editForm.appearance?.theme || "dark"}
                      onChange={(e) =>
                        setField("appearance", {
                          ...(editForm.appearance || {}),
                          theme: e.target.value,
                        })
                      }
                    >
                      <Space direction="vertical">
                        <Radio value="light">
                          <span className="text-white">Light Mode</span>
                        </Radio>
                        <Radio value="dark">
                          <span className="text-white">Dark Mode</span>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Primary Color</span>}>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={editForm.appearance?.primaryColor || "#FF843E"}
                        onChange={(e) =>
                          setField("appearance", {
                            ...(editForm.appearance || {}),
                            primaryColor: e.target.value,
                          })
                        }
                        style={{ height: "40px", width: "80px", ...inputStyle }}
                      />
                      <div
                        className="h-10 w-20 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: editForm.appearance?.primaryColor || "#FF843E" }}
                      >
                        <BgColorsOutlined />
                      </div>
                    </div>
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Secondary Color</span>}>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={editForm.appearance?.secondaryColor || "#1890ff"}
                        onChange={(e) =>
                          setField("appearance", {
                            ...(editForm.appearance || {}),
                            secondaryColor: e.target.value,
                          })
                        }
                        style={{ height: "40px", width: "80px", ...inputStyle }}
                      />
                      <div
                        className="h-10 w-20 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: editForm.appearance?.secondaryColor || "#1890ff" }}
                      >
                        <SettingOutlined />
                      </div>
                    </div>
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Allow User Theme Toggle</span>}>
                    <Switch
                      checked={!!editForm.appearance?.allowUserThemeToggle}
                      onChange={(checked) =>
                        setField("appearance", {
                          ...(editForm.appearance || {}),
                          allowUserThemeToggle: checked,
                        })
                      }
                    />
                  </Form.Item>
                </Form>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>

          {/* ==================== ADMIN CONFIGURATION TAB ==================== */}
          <Tabs.TabPane tab="Admin Configuration" key="7">
            <Collapse defaultActiveKey={["1", "2", "3"]} className="bg-[#181818] border-[#303030]">
              {/* About Studio - MOVED FROM STUDIO CONFIGURATION */}
              <Collapse.Panel header="About Studio" key="1" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <Form.Item label={<span className="text-white">Studio Description</span>}>
                    <Input.TextArea
                      value={editForm.about || ""}
                      onChange={(e) => setField("about", e.target.value)}
                      placeholder="Describe your studio, services, specialties, equipment, atmosphere, etc..."
                      rows={6}
                      style={inputStyle}
                    />
                  </Form.Item>
                  <p className="text-xs text-gray-400">
                    This will be shown on the studio profile and helps members understand what makes your studio unique.
                  </p>
                </Form>
              </Collapse.Panel>

              {/* Special Note - MOVED FROM STUDIO CONFIGURATION */}
              <Collapse.Panel header="Special Note" key="2" className="bg-[#202020]">
                <Form layout="vertical" className="space-y-4">
                  <Form.Item label={<span className="text-white">Mark as Important</span>}>
                    <Switch
                      checked={editForm.noteImportance === "important"}
                      onChange={(checked) => setField("noteImportance", checked ? "important" : "unimportant")}
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Note</span>}>
                    <Input.TextArea
                      value={editForm.note || ""}
                      onChange={(e) => setField("note", e.target.value)}
                      placeholder="Enter internal note for this studio..."
                      rows={5}
                      style={inputStyle}
                    />
                  </Form.Item>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="text-white">Note Valid From</span>}>
                      <Input
                        type="date"
                        value={editForm.noteStartDate || ""}
                        onChange={(e) => setField("noteStartDate", e.target.value)}
                        style={inputStyle}
                      />
                    </Form.Item>
                    <Form.Item label={<span className="text-white">Note Valid Until</span>}>
                      <Input
                        type="date"
                        value={editForm.noteEndDate || ""}
                        onChange={(e) => setField("noteEndDate", e.target.value)}
                        style={inputStyle}
                      />
                    </Form.Item>
                  </div>
                </Form>
              </Collapse.Panel>

              {/* Permissions - REPLACED WITH TRANSFER-BASED UI */}
              <Collapse.Panel header="Permissions" key="3" className="bg-[#202020]">
                <div className="space-y-4">
                  {(editForm.roles || []).map((role, index) => (
                    <div key={index} className="flex flex-col gap-4 p-3 border border-[#303030] rounded-lg">
                      {/* Role Name and Color Row */}
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <Input
                          placeholder="Role Name"
                          value={role.name}
                          onChange={(e) => {
                            const updatedRoles = [...(editForm.roles || [])]
                            updatedRoles[index].name = e.target.value
                            setField("roles", updatedRoles)
                          }}
                          className="!w-full sm:!w-48 !py-3.5"
                          style={inputStyle}
                        />

                        {/* Color Picker */}
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={role.color || "#1890ff"}
                            onChange={(e) => {
                              const updatedRoles = [...(editForm.roles || [])]
                              updatedRoles[index].color = e.target.value
                              setField("roles", updatedRoles)
                            }}
                            style={{ height: "40px", width: "60px", ...inputStyle }}
                          />
                          <Tooltip title="Role display color">
                            <InfoCircleOutlined style={tooltipStyle} />
                          </Tooltip>
                        </div>

                        {/* Remove Button */}
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeArrayItem("roles", index)}
                          className="w-full sm:w-auto mt-2 sm:mt-0"
                          style={buttonStyle}
                        >
                          Remove
                        </Button>
                      </div>

                      {/* Permissions Transfer - Fully Responsive */}
                      <div className="w-full overflow-x-auto">
                        <div className="min-w-[600px] sm:min-w-0">
                          <Transfer
                            dataSource={PERMISSION_DATA}
                            targetKeys={role.permissions || []}
                            onChange={(nextTargetKeys) => {
                              const updatedRoles = [...(editForm.roles || [])]
                              updatedRoles[index].permissions = nextTargetKeys
                              setField("roles", updatedRoles)
                            }}
                            render={(item) => (
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  width: "100%",
                                  color: "#ffffff",
                                  fontSize: "12px",
                                  padding: "4px 0",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    width: 16,
                                  }}
                                >
                                  {GROUP_ICONS[item.iconName]}
                                </span>
                                <span
                                  style={{
                                    flex: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    color: "#ffffff",
                                  }}
                                >
                                  {item.title}
                                </span>
                                <Tag
                                  color="blue"
                                  style={{
                                    marginLeft: 4,
                                    fontSize: "10px",
                                    padding: "0 4px",
                                  }}
                                >
                                  {item.group}
                                </Tag>
                              </span>
                            )}
                            titles={["Available Permissions", "Assigned Permissions"]}
                            showSearch
                            filterOption={(inputValue, item) =>
                              item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                              item.group.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            listStyle={{
                              width: "calc(50% - 22px)",
                              height: 280,
                            }}
                            className="!w-full responsive-transfer"
                            operations={["Assign", "Remove"]}
                            selectAllLabels={[
                              (selectedCount, totalCount) =>
                                `Available ${selectedCount}/${totalCount}`,
                              (selectedCount, totalCount) =>
                                `Assigned ${selectedCount}/${totalCount}`,
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => addArrayItem("roles", { name: "", permissions: [], color: "#1890ff" })}
                    icon={<PlusOutlined />}
                    className="w-full sm:w-auto"
                    style={buttonStyle}
                  >
                    Add Role
                  </Button>

                  {/* Permission Templates */}
                  <div className="mt-6 border-t border-[#303030] pt-4">
                    <h4 className="text-white font-medium mb-3">Permission Templates</h4>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 mb-3">
                      <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template name (e.g., 'Small Studio Default')"
                        style={inputStyle}
                      />
                      <Button style={buttonStyle} onClick={savePermissionsTemplate}>
                        Save as Template
                      </Button>
                    </div>

                    {(editForm.permissionTemplates || []).length === 0 ? (
                      <p className="text-xs text-gray-400">No templates saved yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {(editForm.permissionTemplates || []).map((tpl, i) => (
                          <div
                            key={tpl.name + i}
                            className="flex items-center gap-2 bg-[#101010] rounded-lg px-3 py-2 text-sm"
                          >
                            <span className="text-white">{tpl.name}</span>
                            <span className="text-gray-400">({(tpl.roles || []).length} role(s))</span>
                            <div className="ml-auto flex items-center gap-2">
                              <Button size="small" onClick={() => applyPermissionsTemplate(tpl)}>
                                Apply
                              </Button>
                              <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => deletePermissionsTemplate(tpl.name)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>

          {/* ==================== IMPORTING TAB ==================== */}
          <Tabs.TabPane tab="Importing" key="8">
            <Collapse defaultActiveKey={["1"]} className="bg-[#181818] text-white border-[#303030]">
              <Collapse.Panel header="Data Import" key="1" className="bg-[#202020]">
                <div className="space-y-6">
                  <Alert
                    message="Import Data from Other Platforms"
                    description="You can import your existing data from other fitness studio platforms. This will help you migrate all important files like member data, contracts, leads, and more."
                    type="info"
                    showIcon
                    style={{ backgroundColor: "#202020", border: "1px solid #303030" }}
                  />

                  <div className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-6">
                    {/* Member Data Import */}
                    <div className="p-4 border border-[#303030] rounded-lg">
                      <h3 className="text-white mb-4 text-xl">
                        <TeamOutlined className="mr-2" />
                        Member Data
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Import member profiles, contact information, and membership details
                      </p>
                      <Upload
                        accept=".csv,.xlsx,.xls"
                        beforeUpload={(file) => {
                          notification.info({
                            message: "Member Data Import",
                            description: `Preparing to import ${file.name}`,
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
                      <h3 className="text-white mb-4 text-xl">
                        <FileProtectOutlined className="mr-2" />
                        Contracts
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Import contract templates, terms, and existing member contracts
                      </p>
                      <Upload
                        accept=".pdf,.doc,.docx,.csv"
                        beforeUpload={(file) => {
                          notification.info({
                            message: "Contracts Import",
                            description: `Preparing to import ${file.name}`,
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
                      <h3 className="text-white mb-4 text-xl">
                        <UserAddOutlined className="mr-2" />
                        Leads
                      </h3>
                      <p className="text-gray-400 mb-4">Import lead information, contact details, and lead sources</p>
                      <Upload
                        accept=".csv,.xlsx,.xls"
                        beforeUpload={(file) => {
                          notification.info({
                            message: "Leads Import",
                            description: `Preparing to import ${file.name}`,
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
                      <h3 className="text-white mb-4 text-xl">
                        <FileTextOutlined className="mr-2" />
                        Additional Files
                      </h3>
                      <p className="text-gray-400 mb-4">Import other important documents and studio data</p>
                      <Upload
                        accept=".pdf,.doc,.docx,.xlsx,.csv,.zip"
                        beforeUpload={(file) => {
                          notification.info({
                            message: "Additional Files Import",
                            description: `Preparing to import ${file.name}`,
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
                    <h3 className="text-white mb-2 text-xl">Import Instructions</h3>
                    <ul className="text-gray-400 list-disc list-inside space-y-2">
                      <li>Ensure your files are in supported formats (CSV, Excel, PDF, Word)</li>
                      <li>Backup your current data before importing</li>
                      <li>Large imports may take several minutes to process</li>
                      <li>Review imported data for accuracy after completion</li>
                      <li>Contact support if you encounter any issues during import</li>
                    </ul>
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </CustomModal>
  )
}