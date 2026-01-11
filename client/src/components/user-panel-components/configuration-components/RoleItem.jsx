/* eslint-disable react/prop-types */
import { Button, ColorPicker, Input } from "antd";
import SecurityScanOutlined from "@ant-design/icons/SecurityScanOutlined";
import TeamOutlined from "@ant-design/icons/TeamOutlined";
import CopyOutlined from "@ant-design/icons/CopyOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";

const inputStyle = {
    backgroundColor: "#101010",
    border: "none",
    color: "#fff",
    padding: "10px 10px",
    outline: "none",
  }

export const RoleItem = ({ 
    role, 
    index, 
    onUpdate, 
    onDelete, 
    onCopy, 
    onOpenPermissionModal, 
    onOpenStaffAssignment,
    isAdminRole = false 
  }) => {
    return (
      <div className="flex flex-col gap-4 p-3 border border-[#303030] rounded-lg">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Role Name - Always editable for Admin */}
        <Input
          placeholder="Role Name"
          value={role.name}
          onChange={(e) => onUpdate(index, "name", e.target.value)}
          className="!w-full sm:!w-48 !py-3.5"
          style={inputStyle}
        />

        {/* Color Picker - Always editable for Admin */}
        <div className="flex items-center gap-2">
          <ColorPicker
            value={role.color}
            onChange={(color) => onUpdate(index, "color", color)}
          />
        </div>

        {/* Staff Count Indicator */}
        <Button
          type="text"
          onClick={() => onOpenStaffAssignment(index)}
          className="flex items-center gap-2"
          style={{ color: role.color }}
        >
          <TeamOutlined />
          ({role.staffCount || 0})
        </Button>

        {/* Permissions Button - Disabled for Admin */}
        <Button
  icon={<SecurityScanOutlined />}
  onClick={() => onOpenPermissionModal(index)}
  className={`bg-blue-600 text-white border-blue-600 hover:bg-blue-700 ${isAdminRole ? "admin-disabled-btn" : ""}`}
  disabled={isAdminRole}
>

          Permissions ({role.permissions?.length || 0})
        </Button>

        {/* Copy Role Button - Available for all roles */}
        <Button
          icon={<CopyOutlined />}
          onClick={() => onCopy(index)}
          className="bg-green-600 text-white border-green-600 hover:bg-green-700"
        >
          Copy
        </Button>

        {/* Delete Button - Hidden for Admin */}
        {!isAdminRole && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(index)}
          >
            Remove
          </Button>
        )}
      </div>

      {isAdminRole && (
        <div className="text-sm text-orange-400 bg-orange-400/10 p-2 rounded">
          This is the Admin role with all permissions. Permissions cannot be modified, 
          but you can change the role name and color.
        </div>
      )}
    </div>
  );
};