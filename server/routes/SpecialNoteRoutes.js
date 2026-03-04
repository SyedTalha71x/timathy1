const express = require('express')

const router = express.Router();


const { createSpecialNotes, specialNotesByIdz } = require('../controllers/SpecialNotesController')
const { verifyAccessToken } = require('../middleware/verifyToken');
const { isStaff } = require('../middleware/RoleCheck');



router.post('/create', verifyAccessToken, isStaff, createSpecialNotes)
router.get('/note/:id', verifyAccessToken, specialNotesByIdz)


module.exports = router;