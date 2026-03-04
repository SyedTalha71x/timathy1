const express = require('express')
const router = express.Router();

const { verifyAccessToken } = require('../middleware/verifyToken')
const { createLead, allLeads } = require('../controllers/LeadController')
const { uploadImage } = require('../config/upload')


router.post('/create', uploadImage.single('img'), verifyAccessToken, createLead)
router.get('/all', verifyAccessToken, allLeads)

module.exports = router