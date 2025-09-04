const express = require('express');
const { getEmail } = require('../controllers/EmailController');
const { verifyAccessToken } = require('../middleware/verifyToken');


const router = express.Router();

router.get('/', verifyAccessToken, getEmail);

module.exports = router