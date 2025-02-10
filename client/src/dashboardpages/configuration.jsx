import { useState } from "react";
import { Input, Select, Button, ColorPicker, TimePicker, Form, notification } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const inputStyle = {
  backgroundColor: '#101010',
  border: 'none',
  color: '#fff',
  padding: '10px 10px',
  outline: 'none',
};

const selectStyle = {
  backgroundColor: '#101010',
  border: 'none',
  color: '#000',
};

const ButtonStyle = {
  backgroundColor: '#101010',
  border: '1px solid #303030',
  color: '#fff',
};


const SaveButtonStyle = {
    backgroundColor: '#FF843E',
    border: '1px solid #303030',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    outline: 'none',
    fontSize: '14px',
}

const ConfigurationPage = () => {
  const [studioName, setStudioName] = useState("");
  const [studioLocation, setStudioLocation] = useState("");
  const [openingHours, setOpeningHours] = useState([]);
  const [roles, setRoles] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [contractStatuses, setContractStatuses] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    iban: "",
    bic: "",
    creditorId: "",
  });

  const handleAddOpeningHour = () => {
    setOpeningHours([...openingHours, { day: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveOpeningHour = (index) => {
    const updatedHours = openingHours.filter((_, i) => i !== index);
    setOpeningHours(updatedHours);
  };

  const handleAddRole = () => {
    setRoles([...roles, { name: "", permissions: [] }]);
  };

  const handleAddAppointmentType = () => {
    setAppointmentTypes([
      ...appointmentTypes,
      { name: "", duration: 30, capacity: 1, color: "#1890ff" },
    ]);
  };

  const handleAddTag = () => {
    setTags([...tags, { name: "", color: "#1890ff" }]);
  };

  const handleAddContractStatus = () => {
    setContractStatuses([...contractStatuses, { name: "" }]);
  };

  const handleSaveConfiguration = () => {
    if (!studioName || !studioLocation) {
      notification.error({ message: "Please fill in all required fields." });
      return;
    }
    notification.success({ message: "Configuration saved successfully!" });
  };

  return (
    <div className="max-w-7xl mx-auto lg:p-10 p-5 rounded-3xl space-y-8 bg-[#181818] min-h-screen text-white">
      <h1 className="lg:text-3xl text-2xl font-bold oxanium_font">Studio Configuration</h1>

      <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
        <h2 className="text-xl font-semibold">Studio Data</h2>
        <Form layout="vertical" className="space-y-4">
          <Form.Item label={<span className="text-white">Studio Name</span>} required>
            <Input
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              placeholder="Enter studio name"
              className="w-full"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item label={<span className="text-white">Studio Location</span>} required>
            <Input
              value={studioLocation}
              onChange={(e) => setStudioLocation(e.target.value)}
              placeholder="Enter studio location"
              className="w-full"
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
                      const updatedHours = [...openingHours];
                      updatedHours[index].day = value;
                      setOpeningHours(updatedHours);
                    }}
                    className="w-full sm:w-40"
                    style={selectStyle}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <Option key={day} value={day}>{day}</Option>
                    ))}
                  </Select>
                  <TimePicker
                    format="HH:mm"
                    placeholder="Start Time"
                    value={hour.startTime}
                    onChange={(time) => {
                      const updatedHours = [...openingHours];
                      updatedHours[index].startTime = time;
                      setOpeningHours(updatedHours);
                    }}
                    className="w-full sm:w-32"
                    style={inputStyle}
                  />
                  <TimePicker
                    format="HH:mm"
                    placeholder="End Time"
                    value={hour.endTime}
                    onChange={(time) => {
                      const updatedHours = [...openingHours];
                      updatedHours[index].endTime = time;
                      setOpeningHours(updatedHours);
                    }}
                    className="w-full sm:w-32"
                    style={inputStyle}
                  />
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveOpeningHour(index)}
                    className="w-full sm:w-auto"
                    style={ButtonStyle}
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
                style={ButtonStyle}
              >
                Add Opening Hour
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>

      {/* Resources Section */}
      <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
        <h2 className="text-xl font-semibold oxanium_font">Resources</h2>

        {/* Roles */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Roles</h3>
          <div className="space-y-4">
            {roles.map((role, index) => (
              <div key={index} className="flex flex-wrap gap-4 items-center">
                <Input
                  placeholder="Role Name"
                  value={role.name}
                  onChange={(e) => {
                    const updatedRoles = [...roles];
                    updatedRoles[index].name = e.target.value;
                    setRoles(updatedRoles);
                  }}
                  className="w-full sm:w-64"
                  style={inputStyle}
                />
                <Select
                  mode="multiple"
                  placeholder="Select Permissions"
                  value={role.permissions}
                  onChange={(value) => {
                    const updatedRoles = [...roles];
                    updatedRoles[index].permissions = value;
                    setRoles(updatedRoles);
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
                  style={ButtonStyle}
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
              style={ButtonStyle}
            >
              Add Role
            </Button>
          </div>
        </div>

        {/* Appointment Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appointment Types</h3>
          <div className="space-y-4">
            {appointmentTypes.map((type, index) => (
              <div key={index} className="flex flex-wrap gap-4 items-center">
                <Input
                  placeholder="Appointment Type Name"
                  value={type.name}
                  onChange={(e) => {
                    const updatedTypes = [...appointmentTypes];
                    updatedTypes[index].name = e.target.value;
                    setAppointmentTypes(updatedTypes);
                  }}
                  className="w-full sm:w-64"
                  style={inputStyle}
                />
                <Input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={type.duration}
                  onChange={(e) => {
                    const updatedTypes = [...appointmentTypes];
                    updatedTypes[index].duration = e.target.value;
                    setAppointmentTypes(updatedTypes);
                  }}
                  className="w-full sm:w-40"
                  style={inputStyle}
                />
                <Input
                  type="number"
                  placeholder="Capacity (1-100)"
                  value={type.capacity}
                  onChange={(e) => {
                    const updatedTypes = [...appointmentTypes];
                    updatedTypes[index].capacity = e.target.value;
                    setAppointmentTypes(updatedTypes);
                  }}
                  className="w-full sm:w-40"
                  style={inputStyle}
                />
                <ColorPicker
                  value={type.color}
                  onChange={(color) => {
                    const updatedTypes = [...appointmentTypes];
                    updatedTypes[index].color = color;
                    setAppointmentTypes(updatedTypes);
                  }}
                />
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => setAppointmentTypes(appointmentTypes.filter((_, i) => i !== index))}
                  className="w-full sm:w-auto"
                  style={ButtonStyle}
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
              style={ButtonStyle}
            >
              Add Appointment Type
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tags</h3>
          <div className="space-y-4">
            {tags.map((tag, index) => (
              <div key={index} className="flex flex-wrap gap-4 items-center">
                <Input
                  placeholder="Tag Name"
                  value={tag.name}
                  onChange={(e) => {
                    const updatedTags = [...tags];
                    updatedTags[index].name = e.target.value;
                    setTags(updatedTags);
                  }}
                  className="w-full sm:w-64"
                  style={inputStyle}
                />
                <ColorPicker
                  value={tag.color}
                  onChange={(color) => {
                    const updatedTags = [...tags];
                    updatedTags[index].color = color;
                    setTags(updatedTags);
                  }}
                />
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => setTags(tags.filter((_, i) => i !== index))}
                  className="w-full sm:w-auto"
                  style={ButtonStyle}
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
              style={ButtonStyle}
            >
              Add Tag
            </Button>
          </div>
        </div>
      </div>

      {/* Contract Statuses Section */}
      <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
        <h2 className="text-xl font-semibold oxanium_font">Contract Statuses</h2>
        <div className="space-y-4">
          {contractStatuses.map((status, index) => (
            <div key={index} className="flex flex-wrap gap-4 items-center">
              <Input
                placeholder="Status Name"
                value={status.name}
                onChange={(e) => {
                  const updatedStatuses = [...contractStatuses];
                  updatedStatuses[index].name = e.target.value;
                  setContractStatuses(updatedStatuses);
                }}
                className="w-full sm:w-64"
                style={inputStyle}
              />
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => setContractStatuses(contractStatuses.filter((_, i) => i !== index))}
                className="w-full sm:w-auto"
                style={ButtonStyle}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button 
            type="dashed" 
            onClick={handleAddContractStatus} 
            icon={<PlusOutlined />}
            className="w-full sm:w-auto"
            style={ButtonStyle}
          >
            Add Contract Status
          </Button>
        </div>
      </div>

      {/* Payment Configuration Section */}
      <div className="bg-[#181818] rounded-lg border border-[#303030] p-6 space-y-6">
        <h2 className="text-xl font-semibold oxanium_font">Payment Configuration</h2>
        <Form layout="vertical" className="space-y-4">
          <Form.Item label={<span className="text-white">Bank Name</span>}>
            <Input
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              placeholder="Enter bank name"
              className="w-full"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item label={<span className="text-white">IBAN</span>}>
            <Input
              value={bankDetails.iban}
              onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value })}
              placeholder="Enter IBAN"
              className="w-full"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item label={<span className="text-white">BIC</span>}>
            <Input
              value={bankDetails.bic}
              onChange={(e) => setBankDetails({ ...bankDetails, bic: e.target.value })}
              placeholder="Enter BIC"
              className="w-full"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item label={<span className="text-white">Creditor ID</span>}>
            <Input
              value={bankDetails.creditorId}
              onChange={(e) => setBankDetails({ ...bankDetails, creditorId: e.target.value })}
              placeholder="Enter Creditor ID"
              className="w-full"
              style={inputStyle}
            />
          </Form.Item>
        </Form>
      </div>

      <div className="flex justify-end">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveConfiguration}
          size="large"
        //   className="w-full sm:w-auto bg-[#F27A30]"
          style={SaveButtonStyle}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
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
`;

// Inject the style overrides into the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = styleOverrides;
document.head.appendChild(styleElement);

export default ConfigurationPage;