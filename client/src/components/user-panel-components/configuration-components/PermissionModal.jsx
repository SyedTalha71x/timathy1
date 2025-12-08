/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { PERMISSION_GROUPS } from "../../../utils/user-panel-states/configuration-states";
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
    MailOutlined, // Added import for MailOutlined
    MessageOutlined, // Added import for MessageOutlined
    FileSearchOutlined, // Added import for FileSearchOutlined
    CheckSquareOutlined, // Added import for CheckSquareOutlined
    FileTextOutlined, // Added import for FileTextOutlined
    TeamOutlined, // Added import for TeamOutlined
    UserAddOutlined, // Added import for UserAddOutlined
    FileProtectOutlined, // Added import for FileProtectOutlined
    ShoppingCartOutlined, // Added import for ShoppingCartOutlined
    DollarOutlined, // Added import for DollarOutlined
    ReadOutlined, // Added import for ReadOutlined
    LineChartOutlined,
    DownloadOutlined,
    SecurityScanOutlined, // Added import for LineChartOutlined
  } from "@ant-design/icons"

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
  
  // eslint-disable-next-line react-refresh/only-export-components
  export const PERMISSION_DATA = PERMISSION_GROUPS.flatMap((g) =>
    g.items.map((perm) => ({
      key: perm, // Transfer uses key for selection
      title: perm, // shown in search
      group: g.group, // custom field for rendering
      iconName: g.icon,
    })),
  )

export const PermissionModal = ({ visible, onClose, role, onPermissionChange, isAdminRole = false }) => {
  const [selectedPermissions, setSelectedPermissions] = useState(
    isAdminRole ? PERMISSION_DATA.map(p => p.key) : (role?.permissions || [])
  );

  // For admin role, always show all permissions selected and disabled
  const handlePermissionToggle = (permission) => {
    if (isAdminRole) return; // Disable permission toggling for admin role
    
    const newPermissions = selectedPermissions.includes(permission)
      ? selectedPermissions.filter(p => p !== permission)
      : [...selectedPermissions, permission];
    setSelectedPermissions(newPermissions);
  };

  const handleGroupToggle = (groupItems) => {
    if (isAdminRole) return; // Disable group toggling for admin role
    
    const allGroupSelected = groupItems.every(item =>
      selectedPermissions.includes(item)
    );

    if (allGroupSelected) {
      setSelectedPermissions(selectedPermissions.filter(
        p => !groupItems.includes(p)
      ));
    } else {
      const newPermissions = [...selectedPermissions];
      groupItems.forEach(item => {
        if (!newPermissions.includes(item)) {
          newPermissions.push(item);
        }
      });
      setSelectedPermissions(newPermissions);
    }
  };

  const handleSave = () => {
    if (isAdminRole) {
      // For admin role, always save with all permissions
      onPermissionChange(PERMISSION_DATA.map(p => p.key));
    } else {
      onPermissionChange(selectedPermissions);
    }
    onClose();
  };

  const handleClearAll = () => {
    if (isAdminRole) return; // Disable clear all for admin role
    setSelectedPermissions([]);
  };

  const handleSelectAll = () => {
    if (isAdminRole) return; // Disable select all for admin role
    setSelectedPermissions(PERMISSION_DATA.map(p => p.key));
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
      <div className="bg-[#1C1C1C] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Manage Permissions</h2>
              <p className="text-gray-400 text-sm">{role?.name || "Role"}</p>
              {isAdminRole && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-orange-400 text-xs bg-orange-400/10 px-2 py-1 rounded">
                    Admin Role
                  </span>
                  <span className="text-gray-500 text-xs">(All permissions required)</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isAdminRole && (
            <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-orange-300">
                <InfoCircleOutlined />
                <span className="text-sm">
                  This is the Admin role with all permissions. Permissions cannot be modified.
                </span>
              </div>
            </div>
          )}

          <div className="mb-6 p-4 bg-[#161616] rounded-lg">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleClearAll}
                disabled={isAdminRole}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isAdminRole 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Clear All
              </button>
              <button
                onClick={handleSelectAll}
                disabled={isAdminRole}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isAdminRole 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Select All
              </button>
              <div className="ml-auto flex items-center gap-2 text-sm text-gray-300">
                <span className={`px-2 py-1 rounded ${
                  isAdminRole ? 'bg-orange-600' : 'bg-blue-600'
                }`}>
                  {isAdminRole ? 'All' : selectedPermissions.length}
                </span>
                permissions selected
                {isAdminRole && (
                  <span className="text-orange-400 text-xs">(Required)</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {PERMISSION_GROUPS.map((group) => {
              const groupItems = group.items;
              const allGroupSelected = isAdminRole ? true : groupItems.every(item =>
                selectedPermissions.includes(item)
              );
              const someGroupSelected = isAdminRole ? false : groupItems.some(item =>
                selectedPermissions.includes(item)
              );
              const selectedCount = isAdminRole ? groupItems.length : groupItems.filter(item => selectedPermissions.includes(item)).length;

              return (
                <div key={group.group} className="border border-gray-700 rounded-lg overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-500 text-lg">
                        {GROUP_ICONS[group.icon]}
                      </span>
                      <div>
                        <h3 className="text-white font-medium text-base">{group.group}</h3>
                        <p className="text-gray-400 text-sm">
                          {selectedCount} of {groupItems.length} selected
                          {isAdminRole && <span className="text-orange-400 ml-1">(Required)</span>}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGroupToggle(groupItems)}
                      disabled={isAdminRole}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isAdminRole
                          ? 'bg-orange-600 text-white cursor-not-allowed'
                          : allGroupSelected
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : someGroupSelected
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      {isAdminRole ? 'All Required' : allGroupSelected ? 'Deselect All' : someGroupSelected ? 'Some Selected' : 'Select All'}
                    </button>
                  </div>

                  {/* Permissions Grid */}
                  <div className="p-4 bg-[#161616]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupItems.map((permission) => {
                        const isSelected = isAdminRole ? true : selectedPermissions.includes(permission);
                        return (
                          <div
                            key={permission}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              isAdminRole 
                                ? 'cursor-not-allowed border-orange-500/30 bg-orange-500/5' 
                                : 'cursor-pointer group hover:border-gray-500 hover:bg-[#1e1e1e]'
                            } ${
                              isSelected
                                ? isAdminRole
                                  ? 'border-orange-500/50 bg-orange-500/10'
                                  : 'border-gray-500 bg-[#1f1f1f]'
                                : 'border-gray-700 bg-[#1a1a1a]'
                            }`}
                            onClick={() => !isAdminRole && handlePermissionToggle(permission)}
                          >
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                isAdminRole
                                  ? 'bg-orange-500/20 border-orange-400'
                                  : isSelected
                                    ? 'bg-[#2a2a2a] border-gray-400'
                                    : 'bg-[#242424] border-gray-600 group-hover:border-gray-400'
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className={`w-3 h-3 ${
                                    isAdminRole ? 'text-orange-400' : 'text-gray-200'
                                  }`}
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
                            <span
                              className={`text-sm font-medium flex-1 ${
                                isAdminRole
                                  ? 'text-orange-300'
                                  : isSelected
                                    ? 'text-gray-200'
                                    : 'text-gray-400 group-hover:text-gray-100'
                              }`}
                            >
                              {permission}
                              {isAdminRole && (
                                <span className="text-orange-400 text-xs ml-1">(Required)</span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-sm text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-500 text-sm text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isAdminRole ? 'Confirm' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
};