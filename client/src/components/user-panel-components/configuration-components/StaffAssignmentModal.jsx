/* eslint-disable react/prop-types */
import { Alert, Button, Checkbox, Input, Modal, notification, Tooltip } from "antd"
import { useState } from "react"
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined"
import SearchOutlined from "@ant-design/icons/SearchOutlined"

const inputStyle = {
  backgroundColor: "#101010",
  border: "none",
  color: "#fff",
  padding: "10px 10px",
  outline: "none",
}

export const StaffAssignmentModal = ({
  visible,
  onClose,
  role,
  allStaff = [],
  onStaffAssignmentChange
}) => {
  const [assignedStaff, setAssignedStaff] = useState(role?.assignedStaff || []);
  const [searchText, setSearchText] = useState('');

  // Filter staff based on search
  const filteredStaff = allStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleToggleStaff = (staffId) => {
    const newAssignedStaff = assignedStaff.includes(staffId)
      ? assignedStaff.filter(id => id !== staffId)
      : [...assignedStaff, staffId];

    setAssignedStaff(newAssignedStaff);
  };

  const handleSave = () => {
    // Ensure at least one staff remains for admin role
    if (role.isAdmin && assignedStaff.length === 0) {
      notification.error({
        message: "Cannot Remove All Staff",
        description: "There must be at least one staff member assigned to the Admin role.",
      });
      return;
    }

    onStaffAssignmentChange(role.id, assignedStaff);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      title={`Assign Staff to ${role.name}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save Assignments
        </Button>,
      ]}
      width={600}
      styles={{
        color: "#ffffff",
        content: {
          backgroundColor: "#1c1c1c",
        },
        header: {
          backgroundColor: "#1c1c1c",
        },
        body: {
          backgroundColor: "#1c1c1c",
        },
        footer: {
          backgroundColor: "#1c1c1c",
        }
      }}
    >
      <div className="space-y-4">
        {/* Search Input */}
        <Input
          placeholder="Search staff..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={inputStyle}
          prefix={<SearchOutlined />}
        />

        {/* Staff List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="flex items-center justify-between p-3 border border-[#303030] rounded-lg mb-2 hover:bg-[#252525]"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={assignedStaff.includes(staff.id)}
                  onChange={() => handleToggleStaff(staff.id)}
                  disabled={role.isAdmin && assignedStaff.length === 1 && assignedStaff.includes(staff.id)}
                />
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  {staff.avatar ? (
                    <img src={staff.avatar} alt={staff.name} className="w-full h-full rounded-full" />
                  ) : (
                    <span className="text-white text-sm">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-white font-medium">{staff.name}</div>
                  <div className="text-gray-400 text-sm">{staff.email}</div>
                </div>
              </div>

              {role.isAdmin && assignedStaff.length === 1 && assignedStaff.includes(staff.id) && (
                <Tooltip title="Cannot remove the last staff member from Admin role">
                  <InfoCircleOutlined className="text-orange-400" />
                </Tooltip>
              )}
            </div>
          ))}
        </div>

        {role.isAdmin && (
          <Alert
            message="Admin Role"
            description="This is the Admin role. Name and color can be customized, but all permissions are required and cannot be removed."
            type="info"
            showIcon
          />
        )}
      </div>
    </Modal>
  );
};