const express = require('express');
const router = express.Router();
const { createPlan, showMyPlan } = require('../controllers/TrainingPlanController');
const { verifyAccessToken } = require('../middleware/verifyToken');

router.post('/create', verifyAccessToken, createPlan);
router.get('/myPlan', verifyAccessToken, showMyPlan);

module.exports = router;