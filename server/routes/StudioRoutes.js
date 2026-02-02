const express = require("express");
const { updateStudio, getStudioByMemberId, createStudio } = require("../controllers/StudioController");
const { verifyAccessToken } = require('../middleware/verifyToken') // to check token
const upload = require('../config/upload')
const { isAdmin } = require("../middleware/RoleCheck");
const router = express.Router();

// Update studio details
router.post('/create', verifyAccessToken, isAdmin, upload.single('logo'), createStudio);
router.put("/:id", verifyAccessToken,isAdmin, upload.single('logo'), updateStudio);
router.get("/my-studio", verifyAccessToken, getStudioByMemberId);

module.exports = router;
