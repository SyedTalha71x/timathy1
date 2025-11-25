
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
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
  Modal,
  Tag,
  Card,
  List,
  Popconfirm,
} from "antd"
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  BgColorsOutlined,
  SettingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  EditOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import "../../../custom-css/admin-configuration.css"
import defaultLogoUrl from "../../../../public/gray-avatar-fotor-20250912192528.png"
import ContractBuilder from "../../../components/admin-dashboard-components/contract-builder"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import dayjs from "dayjs"
import { PermissionModal } from "./permission-modal"

const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input
const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Password } = Input

const inputStyle = {
  backgroundColor: "#101010",
  border: "1px solid #303030",
  color: "#fff",
  padding: "10px 10px",
  outline: "none",
  borderRadius: "6px",
}

const selectStyle = {
  backgroundColor: "#101010",
  border: "1px solid #303030",
  color: "#fff",
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

// Dark theme styles for Ant Design components
const darkThemeStyles = {
  modal: {
    header: {
      background: "#1C1C1C",
      color: "#fff",
      borderBottom: "1px solid #303030"
    },
    body: {
      background: "#1C1C1C",
      color: "#fff"
    },
    footer: {
      background: "#1C1C1C",
      borderTop: "1px solid #303030"
    }
  },
  card: {
    background: "#1C1C1C",
    border: "1px solid #303030",
    color: "#fff"
  },
  tag: {
    background: "#252525",
    color: "#fff",
    border: "1px solid #303030"
  }
}

// Permission Templates Data
const initialPermissionTemplates = [
  // {
  //   id: 1,
  //   name: "Full Admin Access",
  //   description: "Complete administrative access with all permissions",
  //   permissions: ["read", "write", "delete", "manage_staff", "manage_finances", "manage_settings"],
  //   color: "#FF6B6B",
  //   createdAt: "2024-01-15",
  //   isDefault: true
  // },
  // {
  //   id: 2,
  //   name: "Manager Template",
  //   description: "Standard manager permissions for daily operations",
  //   permissions: ["read", "write", "manage_staff", "view_reports"],
  //   color: "#4ECDC4",
  //   createdAt: "2024-01-10",
  //   isDefault: true
  // },
  // {
  //   id: 3,
  //   name: "Trainer Template",
  //   description: "Permissions for fitness trainers and instructors",
  //   permissions: ["read", "write", "view_schedule", "manage_appointments"],
  //   color: "#45B7D1",
  //   createdAt: "2024-01-08",
  //   isDefault: true
  // },
  // {
  //   id: 4,
  //   name: "Reception Template",
  //   description: "Front desk and reception staff permissions",
  //   permissions: ["read", "write", "check_in_members", "view_schedule"],
  //   color: "#96CEB4",
  //   createdAt: "2024-01-05",
  //   isDefault: true
  // }
]

const WysiwygEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'color', 'background',
    'link', 'image'
  ]

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .ql-editor.ql-blank::before {
        color: #ffffff !important;
        opacity: 0.7 !important;
        font-style: normal !important;
      }
      .ql-editor {
        color: #ffffff !important;
        background-color: #101010 !important;
      }
      .ql-toolbar {
        border-color: #303030 !important;
        background-color: #151515 !important;
      }
      .ql-container {
        border-color: #303030 !important;
        background-color: #101010 !important;
      }
      .ql-snow .ql-stroke {
        stroke: #ffffff !important;
      }
      .ql-snow .ql-fill {
        fill: #ffffff !important;
      }
      .ql-snow .ql-picker-label {
        color: #ffffff !important;
      }
      .ql-snow .ql-picker-options {
        background-color: #1C1C1C !important;
        border: 1px solid #303030 !important;
        color: #fff !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      theme="snow"
      style={{
        border: "1px solid #303030",
        borderRadius: "6px"
      }}
    />
  )
}

const AdminConfigurationPage = ({ studioData = {} }) => {
  // Initialize all states with data from props
  const [currency, setCurrency] = useState(studioData.currency || "€")
  const [language, setLanguage] = useState("en")
  const [logoUrl, setLogoUrl] = useState(studioData.logoUrl || "")
  const [hasExistingPassword, sethasExistingPassword] = useState(false)
  const [newLeadSource, setNewLeadSource] = useState("")

  // About Studio Section
  const [aboutStudio, setAboutStudio] = useState(studioData.about || "")

  // Special Note Section
  const [specialNote, setSpecialNote] = useState({
    content: studioData.note || "",
    isImportant: studioData.noteImportance === "important" || false,
    startDate: studioData.noteStartDate ? dayjs(studioData.noteStartDate) : null,
    endDate: studioData.noteEndDate ? dayjs(studioData.noteEndDate) : null,
  })

  // Permissions Management
  const [roles, setRoles] = useState(studioData.roles || [])
  const [permissionTemplates, setPermissionTemplates] = useState(initialPermissionTemplates)
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false)
  const [currentRole, setCurrentRole] = useState(null)
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateColor, setNewTemplateColor] = useState("#3B82F6")

  const [emailSignature, setEmailSignature] = useState(
    studioData.settings?.emailSignature ||
    studioData.emailSignature ||
    "Best regards,\n{Studio_Name} Team"
  )

  const [emailConfig, setEmailConfig] = useState({
    smtpServer: studioData.settings?.smtpHost || studioData.emailConfig?.smtpServer || "",
    smtpPort: studioData.settings?.smtpPort || studioData.emailConfig?.smtpPort || 587,
    emailAddress: studioData.emailConfig?.emailAddress || "",
    password: studioData.emailConfig?.password || "",
    useSSL: studioData.emailConfig?.useSSL || false,
    senderName: studioData.emailConfig?.senderName || studioData.studioName || "",
    smtpUser: studioData.settings?.smtpUser || studioData.emailConfig?.smtpUser || "",
    smtpPass: studioData.settings?.smtpPass || studioData.emailConfig?.smtpPass || "",
  })

  const [autoArchiveDuration, setAutoArchiveDuration] = useState(
    studioData.settings?.autoArchiveDuration || 30
  )

  // Opening hours and closing days
  const [closingDays, setClosingDays] = useState(studioData.closingDays || [])

  // Other studio settings
  const [logo, setLogo] = useState(studioData.logo || [])

  const [contractTypes, setContractTypes] = useState(studioData.contractTypes || [])
  const [contractSections, setContractSections] = useState([
    { title: "Personal Information", content: "", editable: false, requiresAgreement: true },
    { title: "Contract Terms", content: "", editable: false, requiresAgreement: true },
  ])

  const [contractPauseReasons, setContractPauseReasons] = useState(
    studioData.contractPauseReasons || [
      { name: "Vacation", maxDays: 30 },
      { name: "Medical", maxDays: 90 },
    ]
  )

  const [additionalDocs, setAdditionalDocs] = useState(studioData.additionalDocs || [])

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: studioData.appearance?.theme || "dark",
    primaryColor: studioData.appearance?.primaryColor || "#FF843E",
    secondaryColor: studioData.appearance?.secondaryColor || "#1890ff",
    allowUserThemeToggle: studioData.appearance?.allowStaffThemeToggle || true,
  })

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    imprint: studioData.imprint || "",
    privacyPolicy: studioData.privacyPolicy || "",
    termsAndConditions: studioData.termsAndConditions || "",
    contactData: {
      companyName: studioData.studioName || studioData.name || "",
      address: `${studioData.studioStreet || studioData.street || ""}, ${studioData.studioZipCode || studioData.zipCode || ""} ${studioData.studioCity || studioData.city || ""}`,
      phone: studioData.studioPhoneNo || studioData.phone || "",
      email: studioData.studioEmail || studioData.email || "",
      website: studioData.studioWebsite || studioData.website || "",
    },
    accountLogin: {
      email: studioData.studioEmail || studioData.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const [changelog, setChangelog] = useState(studioData.changelog || [])
  const [newChangelog, setNewChangelog] = useState({ version: "", date: null, color: "#3b82f6", content: "" })

  // Lead sources
  const [leadSources, setLeadSources] = useState(
    studioData.leadSources?.map(source => ({
      id: source.id || Math.random(),
      name: source.name,
      description: source.description || "",
      isActive: true,
    })) || [
      { id: 1, name: "Website", description: "Leads from company website", isActive: true },
      { id: 2, name: "Social Media", description: "Facebook, Instagram, etc.", isActive: true },
      { id: 3, name: "Referral", description: "Word of mouth referrals", isActive: true },
    ]
  )

  // Initialize logo URL from studio data
  useEffect(() => {
    if (studioData.logoUrl) {
      setLogoUrl(studioData.logoUrl)
    }
  }, [studioData.logoUrl])

  // About Studio Handlers
  const handleAboutStudioChange = (value) => {
    setAboutStudio(value)
  }

  // Special Note Handlers
  const handleSpecialNoteChange = (field, value) => {
    setSpecialNote(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Role Management Handlers
  const handleAddRole = () => {
    const newRole = {
      name: `New Role ${roles.length + 1}`,
      permissions: [],
      color: "#3B82F6",
      defaultVacationDays: 20
    }
    setRoles([...roles, newRole])
  }

  const handleEditRole = (index) => {
    const roleToEdit = roles[index];
    console.log("Editing role:", roleToEdit);
    setCurrentRole({ 
        ...roleToEdit, 
        index,
        permissions: [...roleToEdit.permissions]
    });
};

  const handleUpdateRole = (field, value) => {
    if (currentRole) {
      const updatedRoles = [...roles]
      updatedRoles[currentRole.index] = {
        ...updatedRoles[currentRole.index],
        [field]: value
      }
      setRoles(updatedRoles)
      setCurrentRole({ ...updatedRoles[currentRole.index], index: currentRole.index })
    }
  }

  const handleDeleteRole = (index) => {
    setRoles(roles.filter((_, i) => i !== index))
    notification.success({
      message: "Role Deleted",
      description: "Role has been successfully deleted."
    })
  }

  const handlePermissionChange = (permissions) => {
    console.log("Received permissions from modal:", permissions);
    if (currentRole) {
        const updatedRoles = [...roles];
        updatedRoles[currentRole.index].permissions = [...permissions];
        setRoles(updatedRoles);
        
        setCurrentRole({
            ...updatedRoles[currentRole.index],
            index: currentRole.index
        });
        
        setIsPermissionModalVisible(false);
        notification.success({
            message: "Permissions Updated",
            description: "Role permissions have been updated successfully."
        });
    }
};

  // Template Management Handlers
  const handleSaveAsTemplate = () => {
    if (currentRole && newTemplateName.trim()) {
      const newTemplate = {
        id: Date.now(),
        name: newTemplateName,
        description: `Template based on ${currentRole.name}`,
        permissions: [...currentRole.permissions],
        color: newTemplateColor,
        createdAt: dayjs().format('YYYY-MM-DD'),
        isDefault: false
      }

      setPermissionTemplates([...permissionTemplates, newTemplate])
      setNewTemplateName("")
      setIsTemplateModalVisible(false)
      notification.success({
        message: "Template Saved",
        description: "Permissions template has been saved successfully."
      })
    }
  }

  const handleApplyTemplate = (template) => {
    if (currentRole) {
      const updatedRoles = [...roles]
      updatedRoles[currentRole.index].permissions = [...template.permissions]
      setRoles(updatedRoles)
      setCurrentRole({ ...updatedRoles[currentRole.index], index: currentRole.index })
      notification.success({
        message: "Template Applied",
        description: `${template.name} template has been applied to the role.`
      })
    }
  }

  const handleDeleteTemplate = (templateId) => {
    setPermissionTemplates(permissionTemplates.filter(template => template.id !== templateId))
    notification.success({
      message: "Template Deleted",
      description: "Permission template has been deleted."
    })
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

  const testEmailConnection = () => {
    console.log("Test Email connection", emailConfig)
    notification.info({
      message: "Test Connection",
      description: "Attempting to connect to SMTP server...",
    })
  }

  const handleSaveConfiguration = () => {
    if (!validateClosingDays()) {
      return
    }

    // Save all configuration including new sections
    const updatedData = {
      ...studioData,
      about: aboutStudio,
      note: specialNote.content,
      noteImportance: specialNote.isImportant ? "important" : "normal",
      noteStartDate: specialNote.startDate ? specialNote.startDate.format('YYYY-MM-DD') : null,
      noteEndDate: specialNote.endDate ? specialNote.endDate.format('YYYY-MM-DD') : null,
      roles: roles,
    }

    console.log("Saving configuration:", updatedData)
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
        editable: true,
        requiresAgreement: true,
      },
    ])
  }

  const handleViewBlankContract = () => {
    console.log("check handle view blank contract")
  }

  // General settings handlers
  const handleUpdateGeneralSettings = (field, value) => {
    setGeneralSettings({ ...generalSettings, [field]: value })
  }

  const handleUpdateContactData = (field, value) => {
    setGeneralSettings({
      ...generalSettings,
      contactData: { ...generalSettings.contactData, [field]: value },
    })
  }

  const handleUpdateAccountLogin = (field, value) => {
    setGeneralSettings({
      ...generalSettings,
      accountLogin: { ...generalSettings.accountLogin, [field]: value },
    })
  }

  const handleChangePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = generalSettings.accountLogin

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

    // Here you would typically make an API call to change the password
    notification.success({
      message: "Password Changed",
      description: "Your password has been successfully updated.",
    })

    // Clear password fields
    setGeneralSettings({
      ...generalSettings,
      accountLogin: {
        ...generalSettings.accountLogin,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    })
  }

  // Lead sources handlers
  const handleAddLeadSource = () => {
    if (!newLeadSource.trim()) return

    const newId = Math.max(...leadSources.map((s) => s.id), 0) + 1
    setLeadSources([
      ...leadSources,
      {
        id: newId,
        name: newLeadSource.trim(),
        description: "",
        isActive: true,
      },
    ])

    setNewLeadSource("") // Clear the input field
    notification.success({
      message: "Lead Source Added",
      description: "New lead source has been successfully added.",
    })
  }

  const handleUpdateLeadSource = (id, field, value) => {
    setLeadSources(leadSources.map((source) => (source.id === id ? { ...source, [field]: value } : source)))
  }

  const handleRemoveLeadSource = (id) => {
    setLeadSources(leadSources.filter((source) => source.id !== id))
    notification.success({
      message: "Lead Source Removed",
      description: "Lead source has been successfully removed.",
    })
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

  // Add these helper functions to your component
  const getPasswordStrength = (password) => {
    if (!password) return "None"
    if (password.length < 8) return "Weak"

    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const strengthFactors = [hasUpper, hasLower, hasNumbers, hasSpecial].filter(Boolean).length

    if (strengthFactors >= 4 && password.length >= 12) return "Strong"
    if (strengthFactors >= 3) return "Good"
    return "Fair"
  }

  const getPasswordStrengthColor = (password) => {
    const strength = getPasswordStrength(password)
    switch (strength) {
      case "Strong":
        return "bg-green-500"
      case "Good":
        return "bg-blue-500"
      case "Fair":
        return "bg-yellow-500"
      case "Weak":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPasswordStrengthPercent = (password) => {
    const strength = getPasswordStrength(password)
    switch (strength) {
      case "Strong":
        return 100
      case "Good":
        return 75
      case "Fair":
        return 50
      case "Weak":
        return 25
      default:
        return 0
    }
  }

  const isPasswordFormValid = () => {
    const { currentPassword, newPassword, confirmPassword } = generalSettings.accountLogin

    // If user has existing password, current password is required
    if (hasExistingPassword && !currentPassword) return false

    // New password must meet requirements
    if (!newPassword || newPassword.length < 8) return false

    // Passwords must match
    if (newPassword !== confirmPassword) return false

    return true
  }

  const addChangelogEntry = () => {
    if (!newChangelog.version || !newChangelog.date || !newChangelog.content) {
      notification.warning({ message: "Missing Fields", description: "Version, date and details are required." })
      return
    }
    setChangelog([{ ...newChangelog }, ...changelog])
    setNewChangelog({ version: "", date: null, color: newChangelog.color, content: "" })
  }

  const removeChangelogEntry = (index) => {
    setChangelog(changelog.filter((_, i) => i !== index))
  }

  return (
    <div className=" w-full mx-auto lg:p-10 p-5 space-y-8 bg-[#181818] min-h-screen text-white">

      <Tabs defaultActiveKey="1" style={{ color: "white" }}>
        <TabPane tab="General" key="1">
          <Collapse defaultActiveKey={["1", "2", "3", "4", "5"]} className="bg-[#181818] border-[#303030]">

            {/* About Studio Panel */}
            <Panel header="About Studio" key="1" className="bg-[#202020] text-white">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Studio Description</span>}>
                    <WysiwygEditor
                      value={aboutStudio}
                      onChange={handleAboutStudioChange}
                      placeholder="Describe your studio, its mission, facilities, and what makes it unique..."
                    />
                  </Form.Item>
                </Form>
              </div>
            </Panel>

            {/* Special Note Panel */}
            <Panel header="Special Note" key="2" className="bg-[#202020] text-white">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Note Content</span>}>
                    <TextArea
                      value={specialNote.content}
                      onChange={(e) => handleSpecialNoteChange('content', e.target.value)}
                      rows={4}
                      style={inputStyle}
                      placeholder="Enter special note or announcement..."
                    />
                  </Form.Item>

                  <div className="flex items-center gap-4">
                    <Form.Item label={<span className="text-white">Mark as Important</span>}>
                      <Switch
                        checked={specialNote.isImportant}
                        onChange={(checked) => handleSpecialNoteChange('isImportant', checked)}
                      />
                    </Form.Item>

                    <Form.Item label={<span className="text-white">Active Period</span>}>
                      <RangePicker
                        value={[specialNote.startDate, specialNote.endDate]}
                        onChange={(dates) => {
                          handleSpecialNoteChange('startDate', dates ? dates[0] : null)
                          handleSpecialNoteChange('endDate', dates ? dates[1] : null)
                        }}
                        style={{
                          backgroundColor: "#101010",
                          border: "1px solid #303030",
                          color: "#fff"
                        }}
                        className="dark-date-picker"
                      />
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </Panel>

            {/* Permissions Management Panel */}
            <Panel header="Permissions Management" key="3" className="bg-[#202020] text-white">
              <div className="space-y-6">
                {/* Add Role Button */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                  {/* <h3 className="text-lg font-medium text-white">Role Management</h3> */}
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddRole}
                    style={saveButtonStyle}
                    className="w-full sm:w-auto"
                  >
                    Add Role
                  </Button>
                </div>

                {/* Roles List */}
                <div className="space-y-4">
                  {roles.map((role, index) => (
                    <Card
                      key={index}
                      className="w-full"
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#1C1C1C",
                        border: "1px solid #303030",
                      }}
                      styles={{
                        header: {
                          backgroundColor: "#1C1C1C",
                          borderBottom: "1px solid #303030",
                          padding: "12px 16px",
                        },
                        body: {
                          backgroundColor: "#1C1C1C",
                          color: "#fff",
                          padding: "16px",
                        },
                      }}
                      title={
                        <div className="flex items-center gap-3">
                          <span style={{ color: "white" }} className="text-base sm:text-lg">{role.name}</span>
                        </div>
                      }
                      extra={
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEditRole(index)}
                            style={buttonStyle}
                            size="small"
                            className="flex-1 sm:flex-none"
                          >
                            <span className="hidden xs:inline">Edit</span>
                            {/* <span className="xs:hidden"><EditOutlined /></span> */}
                          </Button>

                          <Popconfirm
                            title="Delete Role"
                            description="Are you sure you want to delete this role?"
                            onConfirm={() => handleDeleteRole(index)}
                            okText="Yes"
                            cancelText="No"
                            overlayStyle={{
                              background: "#1C1C1C",
                              color: "#fff",
                              border: "1px solid #303030",
                            }}
                          >
                            <Button
                              icon={<DeleteOutlined />}
                              danger
                              size="small"
                              style={buttonStyle}
                              className="flex-1 sm:flex-none"
                            >
                              <span className="hidden xs:inline">Delete</span>
                              {/* <span className="xs:hidden"><DeleteOutlined /></span> */}
                            </Button>
                          </Popconfirm>
                        </div>
                      }
                    >
                      {currentRole?.index === index ? (
                        <div className="space-y-4">
                          <Form layout="vertical">
                            <Form.Item label={<span style={{ color: "white" }}>Role Name</span>}>
                              <Input
                                value={currentRole.name}
                                onChange={(e) => handleUpdateRole("name", e.target.value)}
                                style={inputStyle}
                              />
                            </Form.Item>

                            <Form.Item label={<span style={{ color: "white" }}>Role Color</span>}>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <ColorPicker
                                  value={currentRole.color}
                                  onChange={(color) => handleUpdateRole("color", color.toHexString())}
                                />
                                <div
                                  className="h-8 w-20 rounded-md"
                                  style={{ backgroundColor: currentRole.color }}
                                />
                              </div>
                            </Form.Item>

                            <Form.Item label={<span style={{ color: "white" }}>Permissions</span>}>
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
    <span style={{ color: "#aaa" }} className="text-sm">
      {currentRole.permissions.length} permissions selected
    </span>

    <div className="flex flex-wrap gap-2">
    <Button
    type="primary"
    onClick={() => {
      // Ensure we have the latest permissions before opening modal
      const updatedRole = { 
        ...currentRole, 
        permissions: [...currentRole.permissions] 
      };
      setCurrentRole(updatedRole);
      setIsPermissionModalVisible(true);
    }}
    style={buttonStyle}
    size="small"
    className="flex-1 sm:flex-none"
  >
    <span className="text-xs sm:text-sm">Manage Permissions</span>
  </Button>

      <Button
        icon={<CopyOutlined />}
        onClick={() => setIsTemplateModalVisible(true)}
        style={buttonStyle}
        size="small"
        className="flex-1 sm:flex-none"
      >
        <span className="hidden sm:inline">Save as Template</span>
        <span className="sm:hidden">Template</span>
      </Button>
    </div>
  </div>

  {currentRole.permissions.length > 0 && (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1">
        {currentRole.permissions.slice(0, 5).map((perm, idx) => (
          <Tag
            key={idx}
            color="blue"
            className="text-xs"
            style={darkThemeStyles.tag}
          >
            {perm}
          </Tag>
        ))}

        {currentRole.permissions.length > 5 && (
          <Tag color="blue" className="text-xs" style={darkThemeStyles.tag}>
            +{currentRole.permissions.length - 5} more
          </Tag>
        )}
      </div>
    </div>
  )}
</Form.Item>
                          </Form>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-start items-center gap-2 text-sm">
                            <span style={{ color: "#aaa" }}>Permissions:</span>
                            <span style={{ color: "white" }}>{role.permissions.length}</span>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {/* Permission Templates Section */}
                <Divider style={{ borderColor: "#303030" }} />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Permission Templates</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {permissionTemplates.length === 0 ? (
                      <div
                        className="text-white flex justify-center items-center p-6 bg-[#1C1C1C] border border-[#303030] rounded-lg"
                      >
                        No templates yet
                      </div>
                    ) : (
                      permissionTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className="w-full"
                          styles={{
                            header: {
                              backgroundColor: "#1C1C1C",
                              borderBottom: "1px solid #303030",
                              padding: "12px 16px",
                            },
                            body: {
                              backgroundColor: "#1C1C1C",
                              color: "#fff",
                              padding: "16px",
                            },
                          }}
                          style={{
                            backgroundColor: "#1C1C1C",
                            border: "1px solid #303030",
                          }}
                          title={
                            <div className="flex items-center gap-2 flex-wrap">
                             
                              <span style={{ color: "white" }} className="text-sm sm:text-base">{template.name}</span>
                              {template.isDefault && (
                                <Tag
                                  color="green"
                                  className="text-xs"
                                  style={{ background: "#093f09", border: "none", color: "white" }}
                                >
                                  Default
                                </Tag>
                              )}
                            </div>
                          }
                          extra={
                            <div className="flex gap-1 mt-2 sm:mt-0">
                              <Button
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleApplyTemplate(template)}
                                size="small"
                                style={buttonStyle}
                                disabled={!currentRole}
                                className="flex-1 sm:flex-none"
                              >
                                <span className="hidden md:inline">Apply</span>
                                {/* <span className="xs:hidden"><CheckCircleOutlined /></span> */}
                              </Button>
                              {!template.isDefault && (
                                <Popconfirm
                                  title="Delete Template"
                                  description="Are you sure you want to delete this template?"
                                  onConfirm={() => handleDeleteTemplate(template.id)}
                                  okText="Yes"
                                  cancelText="No"
                                  overlayStyle={{
                                    background: "#1C1C1C",
                                    color: "#fff",
                                    border: "1px solid #303030",
                                  }}
                                >
                                  <Button
                                    icon={<DeleteOutlined />}
                                    danger
                                    size="small"
                                    style={buttonStyle}
                                    className="flex-1 sm:flex-none"
                                  >
                                    <span className="hidden xs:inline">Delete</span>
                                    {/* <span className="xs:hidden"><DeleteOutlined /></span> */}
                                  </Button>
                                </Popconfirm>
                              )}
                            </div>
                          }
                        >
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{template.description}</p>
                          <div className="flex flex-col xs:flex-row xs:justify-between text-xs gap-1">
                            <span className="text-gray-500">{template.permissions.length} permissions</span>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Panel>

            {/* Existing Legal Information Panel */}
            <Panel header="Legal Information" key="4" className="bg-[#202020] text-white">
              <div className="space-y-6">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Imprint</span>}>
                    <WysiwygEditor
                      value={generalSettings.imprint}
                      onChange={(value) => handleUpdateGeneralSettings("imprint", value)}
                      placeholder="Enter your company's imprint information..."
                    />
                  </Form.Item>

                  <Form.Item label={<span className="text-white">Privacy Policy</span>}>
                    <WysiwygEditor
                      value={generalSettings.privacyPolicy}
                      onChange={(value) => handleUpdateGeneralSettings("privacyPolicy", value)}
                      placeholder="Enter your privacy policy..."
                    />
                  </Form.Item>

                  <Form.Item label={<span className="text-white">Terms and Conditions</span>}>
                    <WysiwygEditor
                      value={generalSettings.termsAndConditions}
                      onChange={(value) => handleUpdateGeneralSettings("termsAndConditions", value)}
                      placeholder="Enter your terms and conditions with formatting..."
                    />
                  </Form.Item>
                </Form>
              </div>
            </Panel>

            {/* Existing Contact Information Panel */}
            <Panel header="Contact Information" key="5" className="bg-[#202020] text-white">
              <div className="space-y-4">
                <Form layout="vertical">
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
                    />
                  </Form.Item>
                  <Form.Item label={<span className="text-white">Email</span>}>
                    <Input
                      value={generalSettings.contactData.email}
                      onChange={(e) => handleUpdateContactData("email", e.target.value)}
                      style={inputStyle}
                      placeholder="contact@company.com"
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
                </Form>
              </div>
            </Panel>

            <Panel header="Account Management" key="6" className="bg-[#202020] text-white">
              <div className="space-y-4">
                <Form layout="vertical">
                  {/* Logo Upload Section */}
                  <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={logoUrl || defaultLogoUrl}
                          alt="Studio Logo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = defaultLogoUrl
                          }}
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
                          style={buttonStyle}
                        >
                          Remove Logo
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Email Section */}
                  <Form.Item label={<span className="text-white">Account Email</span>}>
                    <Input
                      value={generalSettings.accountLogin.email}
                      onChange={(e) => handleUpdateAccountLogin("email", e.target.value)}
                      style={inputStyle}
                      placeholder="admin@company.com"
                    />
                  </Form.Item>

                  <Divider style={{ borderColor: "#303030" }} />

                  {/* Improved Password Change Section */}
                  <div className="password-change-section">
                    <h4 className="text-white font-medium mb-4">Change Password</h4>

                    {/* Only show current password if user has a password set */}
                    {hasExistingPassword && (
                      <Form.Item
                        label={<span className="text-white">Current Password</span>}
                        name="currentPassword"
                        rules={[{ required: true, message: "Please enter your current password" }]}
                      >
                        <Password
                          value={generalSettings.accountLogin.currentPassword}
                          onChange={(e) => handleUpdateAccountLogin("currentPassword", e.target.value)}
                          style={inputStyle}
                          placeholder="Enter current password"
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      </Form.Item>
                    )}

                    <Form.Item
                      label={<span className="text-white">New Password</span>}
                      name="newPassword"
                      rules={[
                        { required: true, message: "Please enter a new password" },
                        { min: 8, message: "Password must be at least 8 characters" },
                        {
                          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: "Must include uppercase, lowercase, and numbers",
                        },
                      ]}
                    >
                      <Password
                        value={generalSettings.accountLogin.newPassword}
                        onChange={(e) => handleUpdateAccountLogin("newPassword", e.target.value)}
                        style={inputStyle}
                        placeholder="Enter new password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        className="white-text"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="text-white">Confirm New Password</span>}
                      name="confirmPassword"
                      dependencies={["newPassword"]}
                      rules={[
                        { required: true, message: "Please confirm your new password" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("newPassword") === value) {
                              return Promise.resolve()
                            }
                            return Promise.reject(new Error("Passwords do not match"))
                          },
                        }),
                      ]}
                    >
                      <Password
                        value={generalSettings.accountLogin.confirmPassword}
                        onChange={(e) => handleUpdateAccountLogin("confirmPassword", e.target.value)}
                        style={inputStyle}
                        placeholder="Confirm new password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        className="white-text"
                      />
                    </Form.Item>

                    {/* Password Strength Indicator */}
                    <div className="password-strength mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Password Strength:</span>
                        <span>{getPasswordStrength(generalSettings.accountLogin.newPassword)}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getPasswordStrengthColor(generalSettings.accountLogin.newPassword)}`}
                          style={{ width: `${getPasswordStrengthPercent(generalSettings.accountLogin.newPassword)}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      style={saveButtonStyle}
                      disabled={!isPasswordFormValid()}
                      className="w-auto "
                    >
                      Change Password
                    </Button>
                  </div>
                </Form>
              </div>
            </Panel>

            <Panel header="Language Settings" key="7" className="bg-[#202020] text-white">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Interface Language</span>}>
                    <Select
                      defaultValue="en"
                      style={selectStyle}
                      onChange={(value) => setLanguage(value)}
                      dropdownStyle={{
                        background: "#1C1C1C",
                        border: "1px solid #303030"
                      }}
                    >
                      <Option value="en">English</Option>
                      <Option value="de">Deutsch</Option>
                      <Option value="fr">Français</Option>
                      <Option value="es">Español</Option>
                      <Option value="it">Italiano</Option>
                      <Option value="pt">Português</Option>
                      <Option value="nl">Nederlands</Option>
                      <Option value="pl">Polski</Option>
                      <Option value="ru">Русский</Option>
                    </Select>
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
                        onChange={(color) => setAppearance({ ...appearance, primaryColor: color.toHexString() })}
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
                        onChange={(color) => setAppearance({ ...appearance, secondaryColor: color.toHexString() })}
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
                        <Form.Item label={<span className="text-white">Cost</span>}>
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
                  className="w-full sm:w-auto"
                  style={buttonStyle}
                >
                  Add Pause Reason
                </Button>
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
                </div>

                {/* Add New Lead Source Form */}
                <div className="bg-[#1C1C1C] p-4 rounded-lg mb-4">
                  <div className="flex gap-3 mb-3">
                    <Input
                      value={newLeadSource}
                      onChange={(e) => setNewLeadSource(e.target.value)}
                      placeholder="Enter lead source name"
                      style={inputStyle}
                      onPressEnter={() => {
                        if (newLeadSource.trim()) {
                          handleAddLeadSource()
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (newLeadSource.trim()) {
                          handleAddLeadSource()
                          setNewLeadSource("") // Clear input after adding
                        }
                      }}
                      style={saveButtonStyle}
                      disabled={!newLeadSource.trim()}
                    >
                      Add Source
                    </Button>
                  </div>
                </div>

                {/* Lead Sources List */}
                <div className="max-h-60 overflow-y-auto">
                  {leadSources.length > 0 ? (
                    <div className="space-y-2">
                      {leadSources.map((source) => (
                        <div
                          key={source.id}
                          className="flex justify-between items-center bg-[#1C1C1C] px-4 py-3 rounded-lg"
                        >
                          <span className="text-white text-sm">{source.name}</span>
                          <Button
                            onClick={() => handleRemoveLeadSource(source.id)}
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No lead sources created yet</p>
                      <p className="text-gray-500 text-xs mt-1">Add your first lead source above</p>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        <TabPane tab="Email" key="6">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
            {/* New Demo Access Email Section */}
            <Panel header="Demo Access Email" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Demo Access Email Subject</span>}>
                    <Input
                      placeholder="Enter email subject for demo access"
                      style={inputStyle}
                    />
                  </Form.Item>

                  <Form.Item label={<span className="text-white">Demo Access Email Content</span>}>
                    <WysiwygEditor
                      placeholder="Compose your demo access email content..."
                    />
                    <div className="text-xs text-gray-400 mt-2">
                      <strong>Available variables:</strong> {"{Link}"}, {"{Studio_Name}"}, {"{Recipient_Name}"}, {"{Expiry_Date}"}
                    </div>
                  </Form.Item>

                  <Form.Item label={<span className="text-white">Demo Link Expiry (Days)</span>}>
                    <InputNumber
                      min={1}
                      max={30}
                      defaultValue={7}
                      style={inputStyle}
                      placeholder="7"
                      className="white-text"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Number of days until the demo access link expires
                    </div>
                  </Form.Item>

                  <div className="flex gap-3">
                    <Button type="primary" style={saveButtonStyle}>
                      Save Demo Email Template
                    </Button>
                    <Button style={buttonStyle}>
                      Send Test Email
                    </Button>
                  </div>
                </Form>
              </div>
            </Panel>

            <Panel header="Email Signature" key="2" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Default Email Signature</span>}>
                    <WysiwygEditor
                      value={emailSignature}
                      onChange={setEmailSignature}
                      placeholder="Enter your default email signature..."
                    />
                    <div className="text-xs text-gray-400 mt-2">
                      <strong>Available variables:</strong> {"{Studio_Name}"}, {"{Your_Name}"}, {"{Phone_Number}"}, {"{Email}"}
                    </div>
                  </Form.Item>

                  {/* Signature Pasting Options */}
                  <Form.Item label={<span className="text-white">Signature Pasting Options</span>}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Switch defaultChecked />
                        <span className="text-white text-sm">Automatically append signature to all outgoing emails</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch />
                        <span className="text-white text-sm">Include signature in replies and forwards</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch defaultChecked />
                        <span className="text-white text-sm">Use HTML signature format</span>
                      </div>
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
                      value={emailConfig.smtpUser}
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
                      value={emailConfig.smtpPass}
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
          </Collapse>
        </TabPane>

        <TabPane tab="Changelog" key="7">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
            <Panel header="Manage Version History" key="1" className="bg-[#202020]">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-white font-medium">Changelog Entries</h3>
                </div>

                <div className="bg-[#1C1C1C] p-4 rounded-lg mb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={newChangelog.version}
                      onChange={(e) => setNewChangelog({ ...newChangelog, version: e.target.value })}
                      placeholder="Version (e.g., 2.1.0)"
                      style={inputStyle}
                    />
                    <DatePicker
                      value={newChangelog.date}
                      onChange={(date) => setNewChangelog({ ...newChangelog, date })}
                      placeholder="Release Date"
                      className="bg-[#101010] text-white"
                      style={{ backgroundColor: "#101010", border: "none", color: "#fff", padding: "10px 10px" }}
                    />
                    <ColorPicker
                      value={newChangelog.color}
                      onChange={(c) => setNewChangelog({ ...newChangelog, color: c.toHexString() })}
                      className="col-span-1 md:col-span-2"
                    />
                  </div>
                  <WysiwygEditor
                    value={newChangelog.content}
                    onChange={(val) => setNewChangelog({ ...newChangelog, content: val })}
                    placeholder="Details with formatting..."
                  />
                  <Button
                    onClick={addChangelogEntry}
                    style={saveButtonStyle}
                    disabled={!newChangelog.version || !newChangelog.date || !newChangelog.content}
                  >
                    Add Changelog Entry
                  </Button>
                </div>

                <div className="max-h-96 overflow-y-auto border border-[#303030] rounded-lg">
                  {changelog.length > 0 ? (
                    <div className="space-y-3 p-4">
                      {changelog.map((entry, index) => (
                        <div
                          key={index}
                          className="bg-[#1C1C1C] p-4 rounded-lg flex justify-between items-start"
                          style={{ borderLeft: `6px solid ${entry.color}` }}
                        >
                          <div className="pr-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-white font-semibold text-lg">Version {entry.version}</span>
                              <span className="text-gray-400 text-sm">
                                Released on {entry.date ? entry.date.format("MMMM D, YYYY") : "No Date"}
                              </span>
                            </div>
                            <div
                              className="text-gray-300 text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: entry.content }}
                            />
                          </div>
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => removeChangelogEntry(index)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No changelog entries added yet.</p>
                      <p className="text-gray-500 text-xs mt-1">Add your first entry above.</p>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>

      {/* Permission Modal */}
      <PermissionModal
        visible={isPermissionModalVisible}
        onClose={() => setIsPermissionModalVisible(false)}
        role={currentRole}
        onPermissionChange={handlePermissionChange}
      />

      {/* Save as Template Modal */}
      {isTemplateModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50  bg-opacity-60 p-4">
          <div className="w-full max-w-md bg-[#1C1C1C] rounded-lg border border-[#303030] shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#303030]">
              <h3 className="text-lg font-medium text-white">
                Save as Permission Template
              </h3>
              <button
                onClick={() => setIsTemplateModalVisible(false)}
                className="text-white hover:text-gray-300 text-xl font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#303030] transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Template Name Input */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium block">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="w-full bg-[#262626] text-white border border-[#444] rounded-md px-3 py-1 text-sm outline-none"
                    placeholder="Enter template name..."
                  />
                </div>

               

                {/* Info Box */}
                <div className="bg-[#161616] p-4 rounded-lg border border-[#303030]">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    This will save the current role's permissions as a reusable
                    template. The template will include{" "}
                    <span className="text-white font-medium">
                      {currentRole?.permissions?.length || 0}
                    </span>{" "}
                    permissions.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-[#303030] bg-[#1C1C1C] rounded-b-lg">
              <button
                onClick={() => setIsTemplateModalVisible(false)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-[#444] hover:border-[#666] rounded-md transition-colors w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsTemplate}
                disabled={!newTemplateName.trim()}
                className={`px-4 py-2 text-sm rounded-md transition-colors w-full sm:w-auto order-1 sm:order-2 ${!newTemplateName.trim()
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}


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

export default AdminConfigurationPage