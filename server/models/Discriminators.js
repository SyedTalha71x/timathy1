const mongoose = require('mongoose')
const UserModel = require('./UserModel');


const AdminModel = UserModel.discriminator('admin', new mongoose.Schema({
    permissions: [{
        type: String,
        enum: ["manage_users", "manage_staff", "manage_contracts", "manage_payments", "view_reports"]
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    leads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    }],
    studios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    }],
    video: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingVideo'
    }],

}));

const MemberModel = UserModel.discriminator('member', new mongoose.Schema({
    memberNumber: {
        type: String,
    },
    archivedAt: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    specialsNotes: [{
        status: {
            type: String,
            enum: ['contract_attempt', 'callback_request', 'interest', 'objection', 'personal_info', 'health', 'follow_up', 'general'],
            default: 'general'
        },
        note: {
            type: String,
            // required: true
        },
        isImportant: {
            type: Boolean,
            default: false
        },
        valid: {
            from: {
                type: Date
            },
            until: {
                type: Date
            }
        },
    }],
    trainingGoal: {
        type: String,
    },
    checkIn: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'canceled', 'archived'],
        default: 'active',
    },
    memberType: {
        type: String,
        enum: ['full', 'temporary', 'archived'],
        default: 'full'
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    // bookTrials: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'BookTrial'
    // }],
    relations: [{
        entryType: {
            type: String,
            enum: ['manual', 'member', 'lead'],
            default: 'manual'
        },
        name: {
            type: String,
            required: true
        },
        // ownerMemberId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'member'
        // },
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'member'
        },
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'lead'
        },
        category: {
            type: String,
            enum: ['family', 'relationship', 'friendship', 'work', 'other'],
            default: 'family'
        },
        relationType: {
            type: String,
        },
        customRelation: {
            type: String,
        }
    }],
    // relations: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'relations'
    // }],
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
    },
    idlePeriod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IdlePeriod',
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    createdPlans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingPlan'
    }],
    goals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserGoals'
    }],
    dailyLogs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DailyLog'
    },
    pendingUpdates: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    profileUpdateStatus: {
        type: String,
        enum: ['approved', 'pending', 'rejected', null],
        default: null
    },

    profileUpdateRequestedAt: {
        type: Date,
        default: null
    },

    profileUpdateRejectedReason: {
        type: String,
        default: null
    }

}))


const StaffModel = UserModel.discriminator('staff', new mongoose.Schema({
    permission: [{
        type: String,
    }],
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    username: {
        type: String,
        required: true
    },
    input: {
        type: String,
    },
    staffRole: {
        type: String,
        enum: ['manager', 'employee', 'admin'],
        // required: true,
    },
    staffColor: {
        type: String
    },
    vacationEntitlement: {
        type: Number,
        min: 30,
        default: 30,
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    leads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    }],
    bookTrials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookTrial'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }],
    relations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Relation',
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    }],
    contracts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
    }],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlockedSlot',
    }],
    video: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingVideo'
    }],
    img: {
        url: String,
        public_id: String
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes'
    }],
    shifts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shift'
    }]
}))

module.exports = { AdminModel, MemberModel, StaffModel }