const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Role name is required'],
        trim: true,
        maxlength: [50, 'Role name cannot exceed 50 characters']
    },
    description: {
        type: String,
        default: '',
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    permissions: [{
        type: String,
        enum: [
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
        ]
    }],
    assignedStaff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    }],
    color: {
        type: String,
        default: '#FF843E',
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
    },
    priority: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: [true, 'Studio reference is required']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by is required']
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
roleSchema.index({ studio: 1, name: 1 }, { unique: true });
roleSchema.index({ studio: 1, isAdmin: 1 });
roleSchema.index({ studio: 1, isDefault: 1 });
roleSchema.index({ priority: -1 });

// Virtuals
roleSchema.virtual('staffCount').get(function () {
    return this.assignedStaff?.length || 0;
});

// Pre-save middleware
roleSchema.pre('save', async function (next) {
    // Ensure only one admin role per studio
    if (this.isAdmin) {
        const existingAdmin = await this.constructor.findOne({
            studio: this.studio,
            isAdmin: true,
            _id: { $ne: this._id }
        });

        if (existingAdmin) {
            const error = new Error('Only one admin role is allowed per studio');
            error.status = 400;
            return next(error);
        }
    }

    // Ensure only one default role per studio
    if (this.isDefault) {
        await this.constructor.updateMany(
            {
                studio: this.studio,
                _id: { $ne: this._id },
                isDefault: true
            },
            { $set: { isDefault: false } }
        );
    }

    next();
});

// Pre-remove middleware
roleSchema.pre('remove', async function (next) {
    // Check if this is the admin role
    if (this.isAdmin) {
        const error = new Error('Cannot delete the admin role');
        error.status = 400;
        return next(error);
    }

    // Check if there are staff assigned
    if (this.assignedStaff.length > 0) {
        const error = new Error(`Cannot delete role with ${this.assignedStaff.length} assigned staff members`);
        error.status = 400;
        return next(error);
    }

    next();
});

// Methods
roleSchema.methods = {
    // Check permission
    hasPermission(permissionKey) {
        if (this.isAdmin) return true;
        return this.permissions?.includes(permissionKey) || false;
    },

    // Check multiple permissions (AND)
    hasAllPermissions(permissionKeys) {
        if (this.isAdmin) return true;
        return permissionKeys.every(key => this.permissions?.includes(key));
    },

    // Check multiple permissions (OR)
    hasAnyPermission(permissionKeys) {
        if (this.isAdmin) return true;
        return permissionKeys.some(key => this.permissions?.includes(key));
    },

    // Add permissions
    addPermissions(permissionKeys) {
        if (this.isAdmin) return;
        const newPermissions = [...new Set([...this.permissions, ...permissionKeys])];
        this.permissions = newPermissions;
    },

    // Remove permissions
    removePermissions(permissionKeys) {
        if (this.isAdmin) return;
        this.permissions = this.permissions.filter(p => !permissionKeys.includes(p));
    }
};

// Statics
roleSchema.statics = {
    // Get default role for studio
    async getDefaultRole(studioId) {
        return this.findOne({ studio: studioId, isDefault: true });
    },

    // Get admin role for studio
    async getAdminRole(studioId) {
        return this.findOne({ studio: studioId, isAdmin: true });
    },

    // Initialize default roles for new studio
    async initializeDefaultRoles(studioId, createdBy) {
        const defaultRoles = [
            {
                name: 'Admin',
                description: 'Full system access with all permissions',
                isAdmin: true,
                isDefault: false,
                color: '#FF843E',
                priority: 100,
                permissions: []
            },
            {
                name: 'Manager',
                description: 'Can manage staff, members, and studio settings',
                isAdmin: false,
                isDefault: false,
                color: '#6366F1',
                priority: 80,
                permissions: [
                    'my_area.view', 'appointments.view', 'appointments.book',
                    'members.view', 'members.edit', 'members.create_temporary',
                    'staff.view', 'staff.create', 'staff.edit',
                    'contracts.view', 'contracts.create', 'contracts.pause',
                    'leads.view', 'leads.edit', 'leads.convert',
                    'analytics.view', 'configuration.view', 'configuration.studio'
                ]
            },
            {
                name: 'Trainer',
                description: 'Can manage training sessions and appointments',
                isAdmin: false,
                isDefault: true,
                color: '#10B981',
                priority: 60,
                permissions: [
                    'my_area.view', 'appointments.view', 'appointments.book',
                    'members.view', 'training.view', 'training.create',
                    'training.edit', 'training.assign', 'checkin.view',
                    'checkin.checkin_members', 'classes.view', 'classes.manage_participants'
                ]
            },
            {
                name: 'Receptionist',
                description: 'Front desk operations and member management',
                isAdmin: false,
                isDefault: false,
                color: '#F59E0B',
                priority: 40,
                permissions: [
                    'my_area.view', 'appointments.view', 'appointments.book',
                    'appointments.book_trial', 'members.view', 'members.create_temporary',
                    'members.edit', 'checkin.view', 'checkin.checkin_members',
                    'leads.view', 'leads.create', 'leads.edit',
                    'selling.view', 'selling.sell', 'messenger.view'
                ]
            }
        ];

        const roles = [];
        for (const roleData of defaultRoles) {
            const role = new this({
                ...roleData,
                studio: studioId,
                createdBy
            });
            await role.save();
            roles.push(role);
        }

        return roles;
    }
};

const Role = mongoose.model('role', roleSchema);
module.exports = Role;