const express = require("express");
const {
    createForm,
    getAllForms,
    getFormById,
    updateForm,
    deleteForm,
    toggleFormActive,
} = require("../controllers/MedicalHistoryController");

const { verifyAccessToken } = require('../middleware/verifyToken');
const { isStaff } = require("../middleware/RoleCheck");

const router = express.Router();

router.use(verifyAccessToken);
router.post("/", createForm);
router.get("/", getAllForms);
router.get("/:id", getFormById);
router.put("/:id", isStaff, updateForm);
router.delete("/:id", isStaff, deleteForm);

// toggle active
router.patch("/:id/toggle", isStaff, toggleFormActive);

module.exports = router;