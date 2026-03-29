// routes/MedicalHistoryResponseRoutes.js
const express = require("express");
const {
    createResponse,
    getResponsesByEntity,
    getResponseById,
    updateResponse,
    deleteResponse,
    generateResponsePDF
} = require("../controllers/documents/MedicalHistoryResponseFormController");
const { verifyAccessToken } = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyAccessToken);

// Response routes with entity context
router.post("/:entityType/:entityId/responses", createResponse);
router.get("/:entityType/:entityId/responses", getResponsesByEntity);

// Direct response operations
router.get("/responses/:id", getResponseById);
router.put("/responses/:id", updateResponse);
router.delete("/responses/:id", deleteResponse);
router.get("/responses/:id/pdf", generateResponsePDF);

module.exports = router;