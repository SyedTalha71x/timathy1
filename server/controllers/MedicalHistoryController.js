const MedicalHistoryModel = require("../models/documents/MedicalHistoryModel");

// Create Form
const createForm = async (req, res) => {
    try {
        const form = await MedicalHistoryModel.create(req.body);
        res.status(201).json({ success: true, form: form });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Forms
const getAllForms = async (req, res) => {
    try {
        const forms = await MedicalHistoryModel.find().sort({ createdAt: -1 });
        res.json({ success: true, forms: forms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Form
const getFormById = async (req, res) => {
    try {
        const form = await MedicalHistoryModel.findById(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found",
            });
        }

        res.json({ success: true, form });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Form
const updateForm = async (req, res) => {
    try {
        const form = await MedicalHistoryModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found",
            });
        }

        res.json({ success: true, form: form });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Form
const deleteForm = async (req, res) => {
    try {
        const form = await MedicalHistoryModel.findByIdAndDelete(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found",
            });
        }

        res.json({ success: true, message: "Form deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle Active
const toggleFormActive = async (req, res) => {
    try {
        const userId = req.user?._id
        const form = await MedicalHistoryModel.findById(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found",
            });
        }

        form.active = !form.active;
        await form.save();

        res.json({ success: true, form: form });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createForm,
    toggleFormActive,
    deleteForm,
    updateForm,
    getFormById,
    getAllForms

}