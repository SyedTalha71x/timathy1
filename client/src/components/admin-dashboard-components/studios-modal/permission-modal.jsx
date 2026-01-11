/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
    SaveOutlined,
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined,
    CalendarOutlined,
    InfoCircleOutlined,
    BgColorsOutlined,
    SettingOutlined,
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

// YEH WALA DATA USE KAREN - exactly aapke data ke saath
const PERMISSION_GROUPS = [
    {
        group: "Appointments",
        icon: "CalendarOutlined",
        items: [
            "appointments.view",
            "appointments.create",
            "appointments.edit",
            "appointments.cancel",
            "appointments.manage_contingent",
        ],
    },
    {
        group: "Communication",
        icon: "MailOutlined",
        items: [
            "communication.view",
            "emails.send",
            "chat.member_send",
            "chat.studio_send",
            "broadcasts.send",
            "bulletin_board.view",
            "bulletin_board.posts_create",
            "bulletin_board.posts_edit",
            "bulletin_board.posts_delete",
        ],
    },
    {
        group: "Activity Monitor",
        icon: "FileSearchOutlined",
        items: ["activity_monitor.view", "activity_monitor.take_actions"],
    },
    {
        group: "To-Do & Tags",
        icon: "CheckSquareOutlined",
        items: ["todos.view", "todos.create", "todos.edit", "todos.delete", "tags.manage"],
    },
    {
        group: "Notes",
        icon: "FileTextOutlined",
        items: ["notes.view", "notes.personal_create", "notes.studio_create", "notes.studio_delete"],
    },
    {
        group: "Members",
        icon: "TeamOutlined",
        items: ["members.view", "members.create", "members.edit", "members.history_view", "members.documents_manage"],
    },
    {
        group: "Staff",
        icon: "TeamOutlined",
        items: [
            "staff.view",
            "staff.create",
            "staff.edit",
            "staff.history_view",
            "staff.vacation_calendar_view",
            "staff.planning_view",
            "staff.shifts_manage",
        ],
    },
    {
        group: "Leads",
        icon: "UserAddOutlined",
        items: ["leads.view", "leads.create", "leads.edit", "leads.columns_edit"],
    },
    {
        group: "Contracts",
        icon: "FileProtectOutlined",
        items: [
            "contracts.view",
            "contracts.create",
            "contracts.edit",
            "contracts.cancel",
            "contracts.view_details",
            "contracts.documents_manage",
        ],
    },
    {
        group: "Selling & Products",
        icon: "ShoppingCartOutlined",
        items: ["selling.view", "products.manage", "services.manage", "sales_journal.view", "sales_journal.take_actions"],
    },
    {
        group: "Finances",
        icon: "DollarOutlined",
        items: ["finances.view", "payments.run"],
    },
    {
        group: "Training",
        icon: "ReadOutlined",
        items: ["training.view", "training_plans.create", "training_plans.assign"],
    },
    {
        group: "Analytics",
        icon: "LineChartOutlined",
        items: [
            "analytics.view",
            "analytics.finance_view",
            "analytics.members_view",
            "analytics.leads_view",
            "analytics.appointments_view",
        ],
    },
    {
        group: "Configuration",
        icon: "SettingOutlined",
        items: [
            "profile.edit_own",
            "studio.config_manage",
            "appointments.config_manage",
            "staff.config_manage",
            "leads.sources_manage",
            "contracts.config_manage",
            "documents.config_manage",
            "communication.config_manage",
            "finance.config_manage",
            "appearance.manage",
        ],
    },
];

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

// PERMISSION_DATA ko properly define karen
const PERMISSION_DATA = PERMISSION_GROUPS.flatMap((group) =>
    group.items.map((permission) => ({
        key: permission,
        title: permission,
        group: group.group,
        iconName: group.icon,
    }))
)

export const PermissionModal = ({ visible, onClose, role, onPermissionChange }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // Fix: Properly initialize selectedPermissions when modal opens
    useEffect(() => {
        if (visible && role?.permissions) {
            console.log("Initializing permissions:", role.permissions);
            setSelectedPermissions([...role.permissions]);
        } else {
            console.log("No permissions found for role:", role);
            setSelectedPermissions([]);
        }
    }, [visible, role]);

    const handlePermissionToggle = (permission) => {
        const newPermissions = selectedPermissions.includes(permission)
            ? selectedPermissions.filter(p => p !== permission)
            : [...selectedPermissions, permission];
        setSelectedPermissions(newPermissions);
    };

    const handleGroupToggle = (groupItems) => {
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
        if (onPermissionChange) {
            console.log("Saving permissions:", selectedPermissions);
            onPermissionChange([...selectedPermissions]);
        }
        onClose();
    };

    const handleSelectAll = () => {
        const allPermissions = PERMISSION_DATA.map(p => p.key);
        setSelectedPermissions(allPermissions);
    };

    const handleClearAll = () => {
        setSelectedPermissions([]);
    };

    const handleClose = () => {
        // Reset to original permissions when closing without save
        if (role?.permissions) {
            setSelectedPermissions([...role.permissions]);
        }
        onClose();
    };

    // Debugging: Check if data is loading
    console.log("Permission Modal Data:", {
        visible,
        role,
        selectedPermissions,
        permissionGroups: PERMISSION_GROUPS,
        permissionData: PERMISSION_DATA
    });

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
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6 p-4 bg-[#161616] rounded-lg">
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleClearAll}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Clear All
                            </button>
                            <button
                                onClick={handleSelectAll}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Select All
                            </button>
                            <div className="ml-auto flex items-center gap-2 text-sm text-gray-300">
                                <span className="bg-blue-600 px-2 py-1 rounded">{selectedPermissions.length}</span>
                                permissions selected
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {PERMISSION_GROUPS.map((group) => {
                            const groupItems = group.items;
                            const allGroupSelected = groupItems.every(item =>
                                selectedPermissions.includes(item)
                            );
                            const someGroupSelected = groupItems.some(item =>
                                selectedPermissions.includes(item)
                            );
                            const selectedCount = groupItems.filter(item => selectedPermissions.includes(item)).length;

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
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleGroupToggle(groupItems)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                                allGroupSelected
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : someGroupSelected
                                                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                                      : 'bg-gray-600 text-white hover:bg-gray-700'
                                            }`}
                                        >
                                            {allGroupSelected ? 'Deselect All' : someGroupSelected ? 'Some Selected' : 'Select All'}
                                        </button>
                                    </div>

                                    {/* Permissions Grid */}
                                    <div className="p-4 bg-[#161616]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {groupItems.map((permission) => {
                                                const isSelected = selectedPermissions.includes(permission);
                                                return (
                                                    <div
                                                        key={permission}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${
                                                            isSelected
                                                                ? 'border-orange-500 bg-orange-500 bg-opacity-10'
                                                                : 'border-gray-700 bg-[#1a1a1a] hover:border-gray-500 hover:bg-[#1e1e1e]'
                                                        }`}
                                                        onClick={() => handlePermissionToggle(permission)}
                                                    >
                                                        <div
                                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                                                isSelected
                                                                    ? 'bg-orange-500 border-orange-500'
                                                                    : 'bg-[#242424] border-gray-600 group-hover:border-gray-400'
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <svg
                                                                    className="w-3 h-3 text-white"
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
                                                                isSelected
                                                                    ? 'text-orange-300'
                                                                    : 'text-gray-400 group-hover:text-gray-100'
                                                            }`}
                                                        >
                                                            {permission}
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
                        onClick={handleClose}
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
                        Save Permissions
                    </button>
                </div>
            </div>
        </div>
    );
};