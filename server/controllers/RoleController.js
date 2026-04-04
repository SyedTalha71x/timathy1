const Role = require('../models/Role');
const { StaffModel } = require('../models/Discriminators');
const mongoose = require('mongoose')
// @desc    Get all roles for a studio
// @route   GET /api/studios/:studioId/roles
// @access  Private
const getRoles = async (req, res) => {
    try {
        const studioId = req.user?.studio;

        // Check if user has permission
        if (!req.user.hasPermission('configuration.staff')) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view roles'
            });
        }

        let roles = await Role.find({ studio: studioId })
            .populate('assignedStaff', 'firstName lastName email img username')
            .sort('-priority name')
            .lean();

        // Initialize default roles if none exist
        if (roles.length === 0) {
            roles = await Role.initializeDefaultRoles(studioId, req.user.id);
            roles = await Role.find({ studio: studioId })
                .populate('assignedStaff', 'firstName lastName email img username')
                .sort('-priority name')
                .lean();
        }

        res.status(200).json({
            success: true,
            count: roles.length,
            roles: roles
        });
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching roles',
            error: error.message
        });
    }
};

// @desc    Get single role by ID
// @route   GET /api/studios/:studioId/roles/:roleId
// @access  Private
const getRoleById = async (req, res) => {
    try {
        const studioId = req.user?.studio;
        const { roleId } = req.params;

        const role = await Role.findOne({ _id: roleId, studio: studioId })
            .populate('assignedStaff', 'firstName lastName email img username');

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.status(200).json({
            success: true,
            role: role
        });
    } catch (error) {
        console.error('Get role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching role',
            error: error.message
        });
    }
};

// @desc    Create new role
// @route   POST /api/studios/:studioId/roles
// @access  Private
const createRole = async (req, res) => {
    try {
        const studioId = req.user?.studio;
        const { name, description, permissions, color, isDefault, priority } = req.body;

        // Check permission
        // if (!await req.user.hasPermission('configuration.staff')) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'You do not have permission to create roles'
        //     });
        // }

        // Check if role name already exists
        const existingRole = await Role.findOne({ studio: studioId, name });
        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: 'Role with this name already exists'
            });
        }

        const role = await Role.create({
            name,
            description: description || '',
            permissions: permissions || [],
            color: color || '#FF843E',
            isDefault: isDefault || false,
            isAdmin: false,
            priority: priority || 0,
            studio: studioId,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            role: role
        });
    } catch (error) {
        console.error('Create role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating role',
            error: error.message
        });
    }
};

// @desc    Update role
// @route   PUT /api/studios/:studioId/roles/:roleId
// @access  Private
const updateRole = async (req, res) => {
    try {
        const studioId = req.user?.studio;
        const { roleId } = req.params;
        const { name, description, permissions, color, isDefault, priority } = req.body;

        // // Check permission
        // if (!await req.user.hasPermission('configuration.staff')) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'You do not have permission to update roles'
        //     });
        // }

        const role = await Role.findOne({ _id: roleId, studio: studioId });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        // Don't allow editing admin role name or permissions
        if (role.isAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin role cannot be modified'
            });
        }

        // Check name uniqueness
        if (name && name !== role.name) {
            const existingRole = await Role.findOne({
                studio: studioId,
                name,
                _id: { $ne: roleId }
            });
            if (existingRole) {
                return res.status(400).json({
                    success: false,
                    message: 'Role with this name already exists'
                });
            }
            role.name = name;
        }

        // Update fields
        if (description !== undefined) role.description = description;
        if (permissions !== undefined) role.permissions = permissions;
        if (color !== undefined) role.color = color;
        if (priority !== undefined) role.priority = priority;
        if (isDefault !== undefined) role.isDefault = isDefault;

        role.updatedBy = req.user.id;
        await role.save();

        res.status(200).json({
            success: true,
            role: role
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating role',
            error: error.message
        });
    }
};

// @desc    Delete role
// @route   DELETE /api/studios/:studioId/roles/:roleId
// @access  Private
const deleteRole = async (req, res) => {
    try {
        const studioId = req.user?.studio;
        const { roleId } = req.params;

        // Check permission
        if (!await req.user.hasPermission('configuration.staff')) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete roles'
            });
        }

        const role = await Role.findOne({ _id: roleId, studio: studioId });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        // Check if it's admin role
        if (role.isAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin role cannot be deleted'
            });
        }

        // Check if role has assigned staff
        if (role.assignedStaff.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete role with ${role.assignedStaff.length} assigned staff members. Please reassign them first.`
            });
        }

        await role.remove();

        res.status(200).json({
            success: true,
            message: 'Role deleted successfully'
        });
    } catch (error) {
        console.error('Delete role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting role',
            error: error.message
        });
    }
};

// @desc    Assign staff to role
// @route   POST /api/studios/:studioId/roles/:roleId/assign-staff
// @access  Private
const assignStaffToRole = async (req, res) => {
    try {
        const studioId = req.user?.studio;
        const { roleId } = req.params;
        const { staffIds } = req.body;

        if (!staffIds || !Array.isArray(staffIds)) {
            return res.status(400).json({
                success: false,
                message: 'staffIds array is required'
            });
        }

        // Check permission
        // if (!await req.user.hasPermission('configuration.staff')) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'You do not have permission to assign staff'
        //     });
        // }

        const role = await Role.findOne({ _id: roleId, studio: studioId });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        // Check if removing last admin
        if (role.isAdmin && staffIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Admin role must have at least one staff member assigned'
            });
        }

        // Get staff members being assigned
        const staffToAssign = await StaffModel.find({
            _id: { $in: staffIds },
            studio: studioId
        });

        if (staffToAssign.length !== staffIds.length) {
            return res.status(404).json({
                success: false,
                message: 'Some staff members not found'
            });
        }

        // Remove staff from all other roles
        await Role.updateMany(
            { studio: studioId, assignedStaff: { $in: staffIds } },
            { $pull: { assignedStaff: { $in: staffIds } } }
        );

        // Assign to new role
        role.assignedStaff = staffIds;
        await role.save();

        console.log("assigned staff", role.assignedStaff)

        // Update staff documents with role reference
        await StaffModel.updateMany(
            { _id: { $in: staffIds } },
            { staffRole: roleId }
        );

        // Get updated role with populated staff
        const updatedRole = await Role.findById(roleId)
            .populate('assignedStaff', 'firstName lastName email img username');

        res.status(200).json({
            success: true,
            role: updatedRole,
            message: `${staffIds.length} staff member(s) assigned to ${role.name}`
        });
    } catch (error) {
        console.error('Assign staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Error assigning staff to role',
            error: error.message
        });
    }
};


// @desc    Remove staff from role
// @route   DELETE /api/studios/:studioId/roles/:roleId/staff/:staffId
// @access  Private
const removeStaffFromRole = async (req, res) => {
    try {
        const studioId = req.user?.studio;
        const { roleId, staffId } = req.params;

        // Check permission
        if (!await req.user.hasPermission('configuration.staff')) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to remove staff'
            });
        }

        const role = await Role.findOne({ _id: roleId, studio: studioId });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        // Check if removing last admin
        if (role.isAdmin && role.assignedStaff.length === 1 && role.assignedStaff[0].toString() === staffId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot remove the last admin from admin role'
            });
        }

        // Remove staff from role
        role.assignedStaff = role.assignedStaff.filter(id => id.toString() !== staffId);
        await role.save();

        // Clear staffRole from staff document
        await StaffModel.updateOne(
            { _id: staffId },
            { $unset: { staffRole: "" } }
        );

        res.status(200).json({
            success: true,
            message: 'Staff removed from role successfully'
        });
    } catch (error) {
        console.error('Remove staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing staff from role',
            error: error.message
        });
    }
};

// @desc    Get staff by role
// @route   GET /api/studios/:studioId/roles/:roleId/staff
// @access  Private
const getStaffByRole = async (req, res) => {
    try {
        const studioId = req.user?.studio;
        const { roleId } = req.params;

        const role = await Role.findOne({ _id: roleId, studio: studioId })
            .populate('assignedStaff', 'firstName lastName email img username staffColor');

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.status(200).json({
            success: true,
            staff: role.assignedStaff
        });
    } catch (error) {
        console.error('Get staff by role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching staff',
            error: error.message
        });
    }
};



// ============================================
// Permission Operations
// ============================================

// @desc    Get role permissions
// @route   GET /api/roles/:roleId/permissions
// @access  Private
const getRolePermissions = async (req, res) => {
    try {
        const { roleId } = req.params;
        const studioId = req.user?.studio;

        const role = await Role.findOne({ _id: roleId, studio: studioId });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.status(200).json({
            success: true,
            permissions: role.isAdmin ? [] : role.permissions,
            isAdmin: role.isAdmin,
            roleId: role._id,
            roleName: role.name
        });
    } catch (error) {
        console.error('Get role permissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching permissions',
            error: error.message
        });
    }
};

// @desc    Update role permissions
// @route   PUT /api/roles/:roleId/permissions
// @access  Private
const updateRolePermissions = async (req, res) => {
    try {
        const { roleId } = req.params;
        const { permissions } = req.body;
        const studioId = req.user?.studio;

        // Check permission
        // if (!await req.user.hasPermission('configuration.staff')) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'You do not have permission to update role permissions'
        //     });
        // }

        const role = await Role.findOne({ _id: roleId, studio: studioId });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        // Don't allow editing admin role permissions
        if (role.isAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin role permissions cannot be modified. Admin has all permissions by default.'
            });
        }

        // Update permissions
        role.permissions = permissions || [];
        role.updatedBy = req.user.id;
        await role.save();

        // Get updated role with populated data
        const updatedRole = await Role.findById(roleId)
            .populate('assignedStaff', 'firstName lastName email img username');

        res.status(200).json({
            success: true,
            role: updatedRole,
            message: 'Permissions updated successfully'
        });
    } catch (error) {
        console.error('Update role permissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating permissions',
            error: error.message
        });
    }
};

// @desc    Check if staff has specific permission
// @route   GET /api/roles/check-permission/:staffId/:permission
// @access  Private
const checkStaffPermission = async (req, res) => {
    try {
        const { staffId, permission } = req.params;
        const studioId = req.user?.studio;

        const staff = await StaffModel.findOne({ _id: staffId, studio: studioId })
            .populate('staffRole');

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff not found'
            });
        }

        let hasPermission = false;
        let roleName = null;

        if (staff.staffRole) {
            const role = staff.staffRole;
            roleName = role.name;
            if (role.isAdmin) {
                hasPermission = true;
            } else {
                hasPermission = role.permissions?.includes(permission) || false;
            }
        }

        res.status(200).json({
            success: true,
            hasPermission,
            staffId,
            permission,
            roleName
        });
    } catch (error) {
        console.error('Check staff permission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking permission',
            error: error.message
        });
    }
};

// @desc    Get all permissions for current user
// @route   GET /api/roles/my-permissions
// @access  Private
const getMyPermissions = async (req, res) => {
    try {
        const user = req.user?._id;
        let permissions = [];
        let roleName = null;
        let isAdmin = false;

        if (user.staffRole) {
            const role = await Role.findById(user.staffRole);
            if (role) {
                roleName = role.name;
                isAdmin = role.isAdmin;
                if (role.isAdmin) {
                    // Return all possible permissions for admin
                    permissions = getAllPermissionsList();
                } else {
                    permissions = role.permissions || [];
                }
            }
        }

        res.status(200).json({
            success: true,
            permissions,
            roleName,
            isAdmin
        });
    } catch (error) {
        console.error('Get my permissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching permissions',
            error: error.message
        });
    }
};

// Helper function to get all permissions (for admin)
const getAllPermissionsList = () => {
    return [
        "my_area.view", "my_area.edit_widgets", "my_area.manage_view",
        "appointments.view", "appointments.book", "appointments.book_trial", "appointments.block_slots",
        "classes.view", "classes.create", "classes.edit", "classes.cancel", "classes.manage_participants",
        "messenger.view", "messenger.member_chat", "messenger.studio_chat", "messenger.email", "messenger.broadcast",
        "bulletin.view", "bulletin.create", "bulletin.edit", "bulletin.delete",
        "activity_monitor.view", "activity_monitor.appointment_requests", "activity_monitor.expiring_contracts",
        "activity_monitor.contract_pauses", "activity_monitor.member_data_change", "activity_monitor.bank_data_change",
        "activity_monitor.vacation_requests", "activity_monitor.email_errors",
        "todo.view", "todo.create", "todo.assign", "todo.manage_others",
        "notes.view", "notes.create_personal", "notes.manage_studio",
        "media.view", "media.manage_designs",
        "members.view", "members.create_temporary", "members.edit", "members.archive",
        "members.manage_history", "members.manage_documents",
        "checkin.view", "checkin.checkin_members", "checkin.no_show",
        "contracts.view", "contracts.create", "contracts.pause", "contracts.add_bonustime",
        "contracts.renew", "contracts.cancel", "contracts.change", "contracts.view_management", "contracts.view_history",
        "leads.view", "leads.create", "leads.edit", "leads.delete", "leads.book_trial", "leads.convert",
        "staff.view", "staff.create", "staff.edit", "staff.delete", "staff.book_vacation",
        "staff.manage_vacation_others", "staff.shift_management",
        "selling.view", "selling.create_product", "selling.create_service", "selling.sell", "selling.view_journal",
        "finances.view", "finances.run_payments", "finances.check_funds", "finances.view_payment_history",
        "training.view", "training.create", "training.edit", "training.assign",
        "assessment.view", "assessment.create", "assessment.edit", "assessment.delete",
        "analytics.view", "analytics.appointments", "analytics.members", "analytics.leads", "analytics.finances",
        "configuration.view", "configuration.studio", "configuration.appointments", "configuration.staff",
        "configuration.members", "configuration.contracts", "configuration.communication",
        "configuration.finances", "configuration.appearance", "configuration.import"
    ];
};
module.exports = {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    assignStaffToRole,
    removeStaffFromRole,
    getStaffByRole,

    // all permission
    getRolePermissions,
    updateRolePermissions,
    checkStaffPermission,
    getMyPermissions,

};