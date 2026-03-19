const mongoose = require("mongoose")

const MedicalHistoryFormSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        active: {
            type: Boolean,
            default: true,
        },

        signatureSettings: {
            showDate: { type: Boolean, default: true },
            showLocation: { type: Boolean, default: true },
            defaultLocation: { type: String, default: "" },
        },

        // Entire form structure stored as JSON
        sections: [
            {
                id: { type: String, required: true },
                name: { type: String, required: true },

                items: [
                    {
                        itemType: {
                            type: String,
                            enum: ["question", "textBlock", "variableField"],
                            required: true,
                        },

                        // Shared
                        text: { type: String },

                        // Question-specific
                        type: {
                            type: String,
                            enum: ["yesno", "yesnodontknow", "multiple", "text"],
                        },
                        options: [{ type: String }],

                        // Variable field
                        variable: {
                            type: String,
                            enum: [
                                "firstName",
                                "lastName",
                                "gender",
                                "birthdate",
                                "email",
                                "telephone",
                                "mobile",
                                "street",
                                "zipCode",
                                "city",
                                "country",
                                "source",
                            ],
                        },

                        required: { type: Boolean, default: false },

                        // Auto-numbered (optional to store, frontend can generate)
                        number: { type: Number },
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

const MedicalHistoryModel = mongoose.model("MedicalHistoryForm", MedicalHistoryFormSchema);
module.exports = MedicalHistoryModel