const mongoose = require('mongoose');
const db = require('../config/db');

const options = {
    discriminatorKey: 'role', // this will store 'user', 'member', or 'admin'
    collection: 'users',       // all types share the same collection
    timestamps: true
};

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        // required: true,
        minlength: 2,
        maxlength: 20,
        trim: true
    },
    lastName: {
        type: String,
        // required: true,
        minlength: 2,
        maxlength: 20,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        // required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter valid email"]
    },
    password: {
        type: String,
        // required: true,
        minlength: 8,
        select: false,
        validate: {
            validator: function (v) {
                return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@.-_$!%*?&])[A-Za-z\d@$!.-_%*?&]{8,}$/.test(v);
            },
            message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
        }

    },
    refreshToken: {
        type: String,
        select: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'male',
        // required: true,
    },
    dateOfBirth: {
        type: Date,
        // required: true,
        trim: true
    },
    city: {
        type: String,
        // required: true,
        trim: true
    },
    street: {
        type: String,
        // required: true,
        trim: true
    },
    country: {
        type: String,
        // required: true,
        trim: true
    },
    houseNumber: {
        type: String,
        // required: true,
        trim: true
    },
    phone: {
        type: String,
        validate: {
            validator: v => /^\d{10,15}$/.test(v),
            message: props => `${props.value} is not a valid phone number!`
        },
        // required: true,
    },
    telephone: {
        type: String,
        validate: {
            validator: v => /^\d{10,15}$/.test(v),
            message: props => `${props.value} is not a valid phone number!`
        },
        // required: true,
    },
    zipCode: {
        type: Number,
        validate: {
            validator: v => /^\d{4,10}$/.test(v),
            message: props => `${props.value} is not valid zip code!`
        },
        // required: true,
    },
    loginHistory: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            ip: String,
            device: String
        }
    ],
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats'
    }],
    about: {
        type: String,
        // required: true,
    },
    img: {
        url: String,
        public_id: String
    }
}, options);

UserSchema.methods.hasPermission = async function (permissionKey) {
    // For members, you might want different logic
    if (this.role === 'member') {
        // Members typically have limited permissions
        const memberPermissions = ['my_area.view', 'appointments.view'];
        return memberPermissions.includes(permissionKey);
    }

    // For staff, check their role
    if (this.role === 'staff') {
        // Populate staffRole if needed
        if (this.staffRole && typeof this.staffRole === 'object') {
            if (this.staffRole.isAdmin) return true;
            return this.staffRole.permissions?.includes(permissionKey) || false;
        }

        // If staffRole is an ID, populate it
        if (this.staffRole && typeof this.staffRole === 'string') {
            const Role = require('./Role');
            const role = await Role.findById(this.staffRole);
            if (role) {
                if (role.isAdmin) return true;
                return role.permissions?.includes(permissionKey) || false;
            }
        }
    }

    return false;
};

UserSchema.index({ email: 1, firstName: 1, lastName: 1, })

const UserModel = mongoose.model('User', UserSchema);


module.exports = UserModel

