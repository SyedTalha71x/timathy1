/* eslint-disable react/prop-types */
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
  SettingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons"
import "../../custom-css/admin-configuration.css"
import defaultLogoUrl from '../../../public/gray-avatar-fotor-20250912192528.png'


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

// Add this component above the ConfigurationPage component
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [activeFormat, setActiveFormat] = useState(null);
  
  const formats = [
    { type: 'bold', icon: 'B', label: 'Bold' },
    { type: 'italic', icon: 'I', label: 'Italic' },
    { type: 'underline', icon: 'U', label: 'Underline' },
    { type: 'heading', icon: 'H', label: 'Heading' },
    { type: 'list', icon: '•', label: 'Bullet List' },
  ];

  const sizes = ['small', 'normal', 'large', 'xlarge'];

  const applyFormat = (formatType) => {
    const formatMap = {
      bold: '<strong>selected text</strong>',
      italic: '<em>selected text</em>',
      underline: '<u>selected text</u>',
      heading: '<h3>selected text</h3>',
      list: '<ul><li>item</li></ul>'
    };

    const textArea = document.activeElement;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = value;
    
    if (formatMap[formatType]) {
      const formattedText = formatMap[formatType].replace('selected text', selectedText || 'text');
      newText = value.substring(0, start) + formattedText + value.substring(end);
    }
    
    onChange(newText);
    setActiveFormat(null);
  };

  const changeTextSize = (size) => {
    const sizeMap = {
      small: '<small>selected text</small>',
      normal: 'selected text',
      large: '<big>selected text</big>',
      xlarge: '<h2>selected text</h2>'
    };

    const textArea = document.activeElement;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = value;
    
    if (sizeMap[size]) {
      const sizedText = sizeMap[size].replace('selected text', selectedText || 'text');
      newText = value.substring(0, start) + sizedText + value.substring(end);
    }
    
    onChange(newText);
  };

  return (
    <div className="rich-text-editor">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 p-3 bg-[#151515] rounded-lg border border-[#303030]">
        <div className="flex items-center gap-1">
          {formats.map((format) => (
            <Tooltip key={format.type} title={format.label}>
              <Button
                type="text"
                onClick={() => applyFormat(format.type)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#303030]"
                style={buttonStyle}
              >
                {format.icon}
              </Button>
            </Tooltip>
          ))}
        </div>
        
        <Divider type="vertical" style={{ borderColor: '#303030', height: '24px' }} />
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-2">Size:</span>
          {sizes.map((size) => (
            <Tooltip key={size} title={size.charAt(0).toUpperCase() + size.slice(1)}>
              <Button
                type="text"
                onClick={() => changeTextSize(size)}
                className="w-8 h-8 flex items-center justify-center text-xs text-white hover:bg-[#303030]"
                style={buttonStyle}
              >
                A
                {size === 'small' && <span className="text-[10px]">↓</span>}
                {size === 'large' && <span className="text-[10px]">↑</span>}
                {size === 'xlarge' && <span className="text-[10px]">↑↑</span>}
              </Button>
            </Tooltip>
          ))}
        </div>
        
        <Divider type="vertical" style={{ borderColor: '#303030', height: '24px' }} />
        
        <Tooltip title="Clear formatting">
          <Button
            type="text"
            onClick={() => onChange(value.replace(/<[^>]*>/g, ''))}
            className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#303030]"
            style={buttonStyle}
          >
            🗑️
          </Button>
        </Tooltip>
      </div>

      {/* Text Area */}
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        style={inputStyle}
        placeholder={placeholder}
        className="rich-text-area"
      />
      
      {/* Preview Toggle */}
      <div className="mt-2 flex justify-end">
        <Tooltip title="Toggle HTML preview">
          <Switch
            checkedChildren="HTML"
            unCheckedChildren="Text"
            onChange={(checked) => {
              if (!checked) {
                // Convert HTML to plain text for editing
                onChange(value.replace(/<[^>]*>/g, ''));
              }
            }}
            size="small"
          />
        </Tooltip>
      </div>
      
      {/* Formatting Help */}
      <div className="mt-2 text-xs text-gray-500">
        <span>Tip: Select text and click formatting buttons, or use shortcuts:</span>
        <br />
        <span className="text-gray-400">Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline)</span>
      </div>
    </div>
  );
};

const ConfigurationPage = () => {
  const [currency, setCurrency] = useState("€")
  const [language, setLanguage] = useState("en")
  const [logoUrl, setLogoUrl] = useState("") // New state to store logo URL
  const [hasExistingPassword, sethasExistingPassword] = useState(false)
  const [newLeadSource, setNewLeadSource] = useState("")



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

  // General settings
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
  if (!newLeadSource.trim()) return;
  
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
  
  setNewLeadSource(""); // Clear the input field
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
    if (!password) return 'None';
    if (password.length < 8) return 'Weak';

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthFactors = [hasUpper, hasLower, hasNumbers, hasSpecial].filter(Boolean).length;

    if (strengthFactors >= 4 && password.length >= 12) return 'Strong';
    if (strengthFactors >= 3) return 'Good';
    return 'Fair';
  };

  const getPasswordStrengthColor = (password) => {
    const strength = getPasswordStrength(password);
    switch (strength) {
      case 'Strong': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Weak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPasswordStrengthPercent = (password) => {
    const strength = getPasswordStrength(password);
    switch (strength) {
      case 'Strong': return 100;
      case 'Good': return 75;
      case 'Fair': return 50;
      case 'Weak': return 25;
      default: return 0;
    }
  };

  const isPasswordFormValid = () => {
    const { currentPassword, newPassword, confirmPassword } = generalSettings.accountLogin;

    // If user has existing password, current password is required
    if (hasExistingPassword && !currentPassword) return false;

    // New password must meet requirements
    if (!newPassword || newPassword.length < 8) return false;

    // Passwords must match
    if (newPassword !== confirmPassword) return false;

    return true;
  };

  


  return (
    <div className=" w-full mx-auto lg:p-10 p-5 rounded-3xl space-y-8 bg-[#181818] min-h-screen text-white">
      <h1 className="lg:text-3xl text-2xl font-bold oxanium_font">Admin Panel Configuration</h1>

      <Tabs defaultActiveKey="1" style={{ color: "white" }}>
        <TabPane tab="General" key="1">
          <Collapse defaultActiveKey={["1"]} className="bg-[#181818] border-[#303030]">
           
<Panel header="Legal Information" key="1" className="bg-[#202020]">
  <div className="space-y-6">
    <Form layout="vertical">
      <Form.Item label={<span className="text-white">Imprint</span>}>
        <RichTextEditor
          value={generalSettings.imprint}
          onChange={(value) => handleUpdateGeneralSettings("imprint", value)}
          placeholder="Enter your company's imprint information with formatting..."
        />
      </Form.Item>
      
      <Form.Item label={<span className="text-white">Privacy Policy</span>}>
        <RichTextEditor
          value={generalSettings.privacyPolicy}
          onChange={(value) => handleUpdateGeneralSettings("privacyPolicy", value)}
          placeholder="Enter your privacy policy with formatting..."
        />
      </Form.Item>
    </Form>
  </div>
</Panel>

            <Panel header="Contact Information" key="2" className="bg-[#202020]">
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

            <Panel header="Account Management" key="3" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  {/* Logo Upload Section (unchanged) */}
                  <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={logoUrl || defaultLogoUrl}
                          alt="Studio Logo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = defaultLogoUrl;
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
                        rules={[
                          { required: true, message: 'Please enter your current password' }
                        ]}
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
                        { required: true, message: 'Please enter a new password' },
                        { min: 8, message: 'Password must be at least 8 characters' },
                        {
                          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Must include uppercase, lowercase, and numbers'
                        }
                      ]}
                    // help="Must be at least 8 characters with uppercase, lowercase, and numbers"
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
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: 'Please confirm your new password' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match'));
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

            <Panel header="Language Settings" key="4" className="bg-[#202020]">
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white">Interface Language</span>}>
                    <Select defaultValue="en" style={selectStyle} onChange={(value) => setLanguage(value)}>
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
                              {/* <Tooltip title="Maximum number of appointments a member can book per billing period">
                                <InfoCircleOutlined style={tooltipStyle} />
                              </Tooltip> */}
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
                          {/* <div className="text-xs text-gray-400 mt-1">
                            Based on the {type.billingPeriod} billing period. For example, if set to 4 with weekly
                            billing, members can book 4 appointments per week.
                          </div> */}
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
                          handleAddLeadSource();
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (newLeadSource.trim()) {
                          handleAddLeadSource();
                          setNewLeadSource(""); // Clear input after adding
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
                        <div key={source.id} className="flex justify-between items-center bg-[#1C1C1C] px-4 py-3 rounded-lg">
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

export default ConfigurationPage
