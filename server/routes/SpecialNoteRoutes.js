const express = require('express')

const router = express.Router();


const { createSpecialNotes, specialNotesByIdz,fetchAll } = require('../controllers/SpecialNotesController')
const { verifyAccessToken } = require('../middleware/verifyToken');
const { isStaff } = require('../middleware/RoleCheck');



router.post('/create', verifyAccessToken, isStaff, createSpecialNotes)
router.get('/note/:id', verifyAccessToken, specialNotesByIdz)
router.get('/note/all', verifyAccessToken, fetchAll)


module.exports = router;