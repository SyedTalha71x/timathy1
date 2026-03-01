const express = require("express");
const { updateStudio, getStudioByMemberId, createStudio, deleteStudioById } = require("../controllers/StudioController");
const { verifyAccessToken } = require('../middleware/verifyToken') // to check token
const { uploadImage } = require('../config/upload')
const { isAdmin } = require("../middleware/RoleCheck");
const router = express.Router();

// Update studio details
router.post('/create', verifyAccessToken, isAdmin, uploadImage.single('logo'), createStudio);
router.put("/:id", verifyAccessToken, isAdmin, uploadImage.single('logo'), updateStudio);
router.get("/my-studio", verifyAccessToken, getStudioByMemberId);
router.delete('/:studioId', verifyAccessToken, deleteStudioById)

module.exports = router;
