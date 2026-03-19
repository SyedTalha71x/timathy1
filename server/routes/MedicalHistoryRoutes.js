const express = require("express");
const {
    createForm,
    getAllForms,
    getFormById,
    updateForm,
    deleteForm,
    toggleFormActive,
} = require("../controllers/MedicalHistoryController");

const { verifyAccessToken } = require('../middleware/verifyToken')

const router = express.Router();

router.use(verifyAccessToken);
router.post("/", createForm);
router.get("/", getAllForms);
router.get("/:id", getFormById);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);

// toggle active
router.patch("/:id/toggle", toggleFormActive);

module.exports = router;