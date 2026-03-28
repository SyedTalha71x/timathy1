/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Input,
  Button,
  ColorPicker,
  Form,
  notification,
  Upload,
  Switch,
  Tabs,
  DatePicker,
  Collapse,
  Tag,
  Card,
  Popconfirm,
  Row,
  Col,
} from "antd"
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import "../../../custom-css/admin-configuration.css"
import defaultLogoUrl from "../../../../public/gray-avatar-fotor-20250912192528.png"
import dayjs from "dayjs"

const { TabPane } = Tabs
const { TextArea } = Input
const { Panel } = Collapse
const { RangePicker } = DatePicker

// Responsive styles
const inputStyle = {
  backgroundColor: "#101010",
  border: "1px solid #303030",
  color: "#fff",
  padding: "10px 10px",
  outline: "none",
  borderRadius: "6px",
  width: "100%",
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

// Navigation Menus for Permission Management
const NAVIGATION_MENUS = [
  { key: 'my-area', label: 'My Area', icon: '🏠' },
  { key: 'appointments', label: 'Appointments', icon: '📅' },
  { key: 'communication', label: 'Communication', icon: '💬' },
  { key: 'productivity', label: 'Productivity Area', icon: '📊' },
  { key: 'members', label: 'Member Area', icon: '👥' },
  { key: 'leads', label: 'Leads', icon: '🎯' },
  { key: 'staff', label: 'Staff', icon: '👨‍💼' },
  { key: 'selling', label: 'Selling', icon: '💰' },
  { key: 'marketplace', label: 'Marketplace', icon: '🛒' },
  { key: 'finances', label: 'Finances', icon: '💳' },
  { key: 'fitness', label: 'Fitness Area', icon: '💪' },
  { key: 'analytics', label: 'Analytics', icon: '📈' },
  { key: 'support', label: 'Support Area', icon: '🛟' },
  { key: 'configuration', label: 'Configuration', icon: '⚙️' },
];

// Permission Modal Component
const PermissionModal = ({ visible, onClose, role, onPermissionChange }) => {
  const { t } = useTranslation()
  const [selectedMenus, setSelectedMenus] = useState([])
  const [newRoleName, setNewRoleName] = useState("")
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)

  useEffect(() => {
    if (visible && role) {
      setSelectedMenus(role.permissions || [])
      setNewRoleName(role.name || "")
      setIsCreatingTemplate(false)
    } else {
      setSelectedMenus([])
      setNewRoleName("")
      setIsCreatingTemplate(false)
    }
  }, [visible, role])

  const handleMenuToggle = (menuKey) => {
    const newMenus = selectedMenus.includes(menuKey)
      ? selectedMenus.filter(key => key !== menuKey)
      : [...selectedMenus, menuKey]
    setSelectedMenus(newMenus)
  }

  const handleSelectAll = () => {
    setSelectedMenus(NAVIGATION_MENUS.map(menu => menu.key))
  }

  const handleClearAll = () => {
    setSelectedMenus([])
  }

  const handleSave = () => {
    if (onPermissionChange) {
      onPermissionChange(selectedMenus)
    }
    onClose()
  }

  const handleSaveAsTemplate = () => {
    setIsCreatingTemplate(true)
  }

  const handleTemplateSave = () => {
    if (newRoleName.trim()) {
      const newTemplate = {
        id: Date.now(),
        name: newRoleName,
        permissions: [...selectedMenus],
        createdAt: dayjs().format('YYYY-MM-DD'),
        isDefault: false
      }
      console.log("Saving template:", newTemplate)
      notification.success({
        message: t("admin.customers.editConfig.templateSaved"),
        description: t("admin.customers.editConfig.templateSavedDesc")
      })
      setIsCreatingTemplate(false)
      setNewRoleName("")
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 md:p-4">
      <div className="bg-[#1C1C1C] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                {isCreatingTemplate ? "Save as Template" : "Manage Menu Permissions"}
              </h2>
              <p className="text-gray-400 text-xs md:text-sm">{role?.name || "New Role"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {isCreatingTemplate ? (
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-1 md:mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full bg-[#262626] text-white border border-[#444] rounded-md px-3 py-2 text-sm outline-none"
                    placeholder={t("admin.customers.editConfig.enterTemplateName")}
                  />
                </div>

                <div className="bg-[#161616] p-3 md:p-4 rounded-lg border border-[#303030]">
                  <h4 className="text-white font-medium mb-2">Selected Menus ({selectedMenus.length})</h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {selectedMenus.map(menuKey => {
                      const menu = NAVIGATION_MENUS.find(m => m.key === menuKey)
                      return menu ? (
                        <Tag key={menuKey} color="blue" className="text-xs">
                          {menu.icon} {menu.label}
                        </Tag>
                      ) : null
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <button
                    onClick={() => setIsCreatingTemplate(false)}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-[#444] hover:border-[#666] rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTemplateSave}
                    disabled={!newRoleName.trim()}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      !newRoleName.trim()
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Save Template
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-[#161616] rounded-lg">
                <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                  <button
                    onClick={handleClearAll}
                    className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1 md:gap-2"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleSelectAll}
                    className="px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1 md:gap-2"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleSaveAsTemplate}
                    className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1 md:gap-2"
                  >
                    Save as Template
                  </button>
                  <div className="ml-auto flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-300">
                    <span className="bg-orange-600 px-2 py-1 rounded text-xs">{selectedMenus.length}</span>
                    menus selected
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h3 className="text-base md:text-lg font-medium text-white mb-3 md:mb-4">{t("admin.customers.editConfig.navMenuAccess")}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {NAVIGATION_MENUS.map((menu) => {
                    const isSelected = selectedMenus.includes(menu.key)
                    return (
                      <div
                        key={menu.key}
                        className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500 bg-opacity-10'
                            : 'border-gray-700 bg-[#1a1a1a] hover:border-gray-500 hover:bg-[#1e1e1e]'
                        }`}
                        onClick={() => handleMenuToggle(menu.key)}
                      >
                        <div
                          className={`w-4 h-4 md:w-5 md:h-5 rounded border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-orange-500 border-orange-500'
                              : 'bg-[#242424] border-gray-600'
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-2.5 h-2.5 md:w-3 md:h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {/* <span className="text-base md:text-lg">{menu.icon}</span> */}
                          <span
                            className={`text-xs md:text-sm font-medium ${
                              isSelected
                                ? 'text-orange-300'
                                : 'text-gray-400'
                            }`}
                          >
                            {menu.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isCreatingTemplate && (
          <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 p-4 md:p-6 border-t border-gray-700 bg-gray-800 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 md:px-6 py-2 bg-gray-600 text-xs md:text-sm text-white rounded-lg font-medium hover:bg-gray-700 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 md:px-6 py-2 bg-orange-500 text-xs md:text-sm text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-1 md:gap-2 order-1 sm:order-2"
            >
              Save Permissions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const AdminConfigurationPage = ({ studioData = {} }) => {
  // About Studio Section
  const [aboutStudio, setAboutStudio] = useState(studioData.about || "")

  // Special Note Section
  const [specialNote, setSpecialNote] = useState({
    content: studioData.note || "",
    isImportant: studioData.noteImportance === "important" || false,
    startDate: studioData.noteStartDate ? dayjs(studioData.noteStartDate) : null,
    endDate: studioData.noteEndDate ? dayjs(studioData.noteEndDate) : null,
  })

  // Studio Categories
  const [studioCategories, setStudioCategories] = useState([
    { id: 1, name: t("admin.customers.editConfig.emsStudio"), color: "#FF6B6B", icon: "⚡" },
    { id: 2, name: t("admin.customers.editConfig.fitnessStudio"), color: "#4ECDC4", icon: "💪" },
    { id: 3, name: t("admin.customers.editConfig.selfServiceStudio"), color: "#45B7D1", icon: "🤖" },
  ])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6")

  // Permissions Management
  const [roles, setRoles] = useState(studioData.roles || [])
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false)
  const [currentRole, setCurrentRole] = useState(null)

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

  // Studio Categories Handlers
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now(),
        name: newCategoryName.trim(),
        color: newCategoryColor,
        icon: "🏢"
      }
      setStudioCategories([...studioCategories, newCategory])
      setNewCategoryName("")
      notification.success({
        message: t("admin.customers.editConfig.categoryAdded"),
        description: t("admin.customers.editConfig.categoryAddedDesc")
      })
    }
  }

  const handleUpdateCategory = (id, field, value) => {
    setStudioCategories(studioCategories.map(category => 
      category.id === id ? { ...category, [field]: value } : category
    ))
  }

  const handleDeleteCategory = (id) => {
    setStudioCategories(studioCategories.filter(category => category.id !== id))
    notification.success({
      message: t("admin.customers.editConfig.categoryDeleted"),
      description: t("admin.customers.editConfig.categoryDeletedDesc")
    })
  }

  // Role Management Handlers
  const handleAddRole = () => {
    const newRole = {
      id: Date.now(),
      name: `New Role ${roles.length + 1}`,
      permissions: [],
      color: "#3B82F6",
    }
    setRoles([...roles, newRole])
    setCurrentRole(newRole)
    setIsPermissionModalVisible(true)
  }

  const handleEditRole = (role) => {
    setCurrentRole(role)
    setIsPermissionModalVisible(true)
  }

  // FIXED: Delete role function - Use proper ID filtering
  const handleDeleteRole = (roleId) => {
    console.log("Deleting role ID:", roleId, "Current roles:", roles);
    setRoles(prevRoles => {
      const updatedRoles = prevRoles.filter(role => role.id !== roleId);
      console.log("Updated roles after delete:", updatedRoles);
      return updatedRoles;
    });
    
    // Clear current role if it's the one being deleted
    if (currentRole && currentRole.id === roleId) {
      setCurrentRole(null);
    }
    
    notification.success({
      message: t("admin.customers.editConfig.roleDeleted"),
      description: t("admin.customers.editConfig.roleDeletedDesc")
    })
  }

  const handlePermissionChange = (permissions) => {
    if (currentRole) {
      const updatedRole = {
        ...currentRole,
        permissions: [...permissions]
      }
      setRoles(roles.map(role => 
        role.id === currentRole.id ? updatedRole : role
      ))
      setCurrentRole(updatedRole)
      setIsPermissionModalVisible(false)
      notification.success({
        message: t("admin.customers.editConfig.permissionsUpdated"),
        description: t("admin.customers.editConfig.permissionsUpdatedDesc")
      })
    }
  }

  const handleSaveConfiguration = () => {
    const updatedData = {
      ...studioData,
      about: aboutStudio,
      note: specialNote.content,
      noteImportance: specialNote.isImportant ? "important" : "normal",
      noteStartDate: specialNote.startDate ? specialNote.startDate.format('YYYY-MM-DD') : null,
      noteEndDate: specialNote.endDate ? specialNote.endDate.format('YYYY-MM-DD') : null,
      roles: roles,
      studioCategories: studioCategories,
    }

    console.log("Saving configuration:", updatedData)
    notification.success({ message: t("admin.customers.editConfig.configSaved") })
  }

  return (
    <div className="w-full mx-auto p-2 sm:p-4 md:p-6 lg:p-8 space-y-6 bg-[#181818] min-h-screen text-white">
      <Tabs 
        defaultActiveKey="1" 
        className="responsive-tabs"
        tabBarStyle={{ marginBottom: 16 }}
      >
        <TabPane tab="General" key="1">
          <Collapse 
            defaultActiveKey={["1", "2", "3"]} 
            className="bg-[#181818] border-[#303030]"
            size="small"
          >
            
            {/* About Studio Panel */}
            <Panel 
              header={
                <span className="text-white text-sm md:text-base font-medium">
                  About Studio
                </span>
              } 
              key="1" 
              className="bg-[#202020] text-white"
            >
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white text-sm md:text-base">{t("admin.customers.editConfig.studioDesc")}</span>}>
                    <TextArea
                      value={aboutStudio}
                      onChange={(e) => handleAboutStudioChange(e.target.value)}
                      rows={6}
                      style={inputStyle}
                      placeholder="Describe your studio, its mission, facilities, and what makes it unique..."
                      className="text-sm md:text-base"
                    />
                    <div className="text-xs text-gray-400 mt-1 md:mt-2">
                      Plain text only - no formatting options
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </Panel>

            {/* Special Note Panel */}
            <Panel 
              header={
                <span className="text-white text-sm md:text-base font-medium">
                  Special Note
                </span>
              } 
              key="2" 
              className="bg-[#202020] text-white"
            >
              <div className="space-y-4">
                <Form layout="vertical">
                  <Form.Item label={<span className="text-white text-sm md:text-base">{t("admin.customers.editConfig.noteContent")}</span>}>
                    <TextArea
                      value={specialNote.content}
                      onChange={(e) => handleSpecialNoteChange('content', e.target.value)}
                      rows={4}
                      style={inputStyle}
                      placeholder="Enter special note or announcement..."
                      className="text-sm md:text-base"
                    />
                  </Form.Item>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item label={<span className="text-white text-sm md:text-base">{t("admin.customers.editConfig.markImportant")}</span>}>
                        <Switch
                          checked={specialNote.isImportant}
                          onChange={(checked) => handleSpecialNoteChange('isImportant', checked)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label={<span className="text-white text-sm md:text-base">{t("admin.customers.editConfig.activePeriod")}</span>}>
                        <RangePicker
                          value={[specialNote.startDate, specialNote.endDate]}
                          onChange={(dates) => {
                            handleSpecialNoteChange('startDate', dates ? dates[0] : null)
                            handleSpecialNoteChange('endDate', dates ? dates[1] : null)
                          }}
                          style={{
                            backgroundColor: "#101010",
                            border: "1px solid #303030",
                            color: "#fff",
                            width: "100%"
                          }}
                          className="dark-date-picker"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>

            {/* Studio Categorization Panel */}
            <Panel 
              header={
                <span className="text-white text-sm md:text-base font-medium">
                  Studio Categorization
                </span>
              } 
              key="3" 
              className="bg-[#202020] text-white"
            >
              <div className="space-y-4 md:space-y-6">
                {/* Add New Category */}
                <div className="bg-[#1C1C1C] p-3 md:p-4 rounded-lg border border-[#303030]">
                  <h4 className="text-white font-medium mb-3 md:mb-4 text-sm md:text-base">{t("admin.customers.editConfig.addCategory")}</h4>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder={t("admin.customers.editConfig.categoryName")}
                      style={inputStyle}
                      className="flex-1 text-sm md:text-base"
                    />
                    <div className="flex items-center gap-2 md:gap-3">
                      <ColorPicker
                        value={newCategoryColor}
                        onChange={(color) => setNewCategoryColor(color.toHexString())}
                        size="small"
                        className="w-10 h-10"
                      />
                      <Button
                        onClick={handleAddCategory}
                        disabled={!newCategoryName.trim()}
                        style={saveButtonStyle}
                        size="small"
                        className="text-xs md:text-sm"
                      >
                        Add Category
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Categories List */}
                <div className="space-y-2 md:space-y-3">
                  <h4 className="text-white font-medium text-sm md:text-base">{t("admin.customers.editConfig.studioCategories")}</h4>
                  {studioCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-[#1C1C1C] rounded-lg border border-[#303030] space-y-3 sm:space-y-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <span className="text-base md:text-lg">{category.icon}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm md:text-base">{category.name}</div>
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.color}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            const newName = prompt("Enter new name:", category.name)
                            if (newName) {
                              handleUpdateCategory(category.id, 'name', newName)
                            }
                          }}
                          style={buttonStyle}
                          size="small"
                          className="text-xs md:text-sm"
                        >
                          Rename
                        </Button>
                        <Popconfirm
                          title="Delete Category"
                          description={t("admin.customers.editConfig.deleteCategoryConfirm")}
                          onConfirm={() => handleDeleteCategory(category.id)}
                          okText={t("common.yes")}
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
                            className="text-xs md:text-sm"
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

          </Collapse>
        </TabPane>

        <TabPane tab="Permissions" key="2">
          <div className="space-y-4 md:space-y-6">
            {/* Add Role Button */}
            <div className="flex justify-end">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRole}
                style={saveButtonStyle}
                size="small"
                className="text-xs md:text-sm"
              >
                Add New Role
              </Button>
            </div>

            {/* Roles List */}
            <div className="space-y-3 md:space-y-4">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  className="w-full"
                  style={{
                    backgroundColor: "#1C1C1C",
                    border: "1px solid #303030",
                  }}
                  styles={{
                    body: {
                      backgroundColor: "#1C1C1C",
                      color: "#fff",
                      padding: "12px 16px",
                    },
                  }}
                  title={
                    <div className="flex items-center gap-2 md:gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="text-white text-sm md:text-base">{role.name}</span>
                    </div>
                  }
                  extra={
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditRole(role)}
                        style={buttonStyle}
                        size="small"
                        className="text-xs md:text-sm"
                      >
                        Edit Permissions
                      </Button>
                      <Popconfirm
                        title="Delete Role"
                        description={t("admin.customers.editConfig.deleteRoleConfirm")}
                        onConfirm={() => handleDeleteRole(role.id)}
                        okText={t("common.yes")}
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
                          className="text-xs md:text-sm"
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </div>
                  }
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm">
                      <span className="text-gray-400">{t("admin.customers.editConfig.menuAccess")}</span>
                      <span className="text-white">{role.permissions?.length || 0} menus</span>
                    </div>
                    {role.permissions && role.permissions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.permissions.map((permission, idx) => {
                          const menu = NAVIGATION_MENUS.find(m => m.key === permission)
                          return menu ? (
                            <Tag
                              key={idx}
                              style={{
                                backgroundColor: "#252525",
                                color: "#fff",
                                border: "1px solid #303030",
                                fontSize: '0.7rem',
                                padding: '0 4px',
                                margin: '2px'
                              }}
                            >
                              {menu.icon} {menu.label}
                            </Tag>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {roles.length === 0 && (
                <div className="text-center py-8 md:py-12 border border-[#303030] border-dashed rounded-lg">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">🔐</div>
                  <p className="text-gray-400 text-base md:text-lg">{t("admin.customers.editConfig.noRoles")}</p>
                  <p className="text-gray-500 text-xs md:text-sm mt-1">{t("admin.customers.editConfig.noRolesDesc")}</p>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddRole}
                    style={saveButtonStyle}
                    size="small"
                    className="mt-3 md:mt-4 text-xs md:text-sm"
                  >
                    Create First Role
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabPane>
      </Tabs>

      {/* Permission Modal */}
      <PermissionModal
        visible={isPermissionModalVisible}
        onClose={() => setIsPermissionModalVisible(false)}
        role={currentRole}
        onPermissionChange={handlePermissionChange}
      />

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveConfiguration}
          size="small"
          style={saveButtonStyle}
          className="text-xs md:text-sm"
        >
          Save Configuration
        </Button>
      </div>
    </div>
  )
}

export default AdminConfigurationPage