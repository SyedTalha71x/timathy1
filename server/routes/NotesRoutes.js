const express = require('express')

const router = express.Router();


const { notesOfStudio, notesOfUser, getNotesOfStudio, getNotesOfStaff, updateNotes, deleteNotes } = require('../controllers/NotesController')

const { verifyAccessToken } = require('../middleware/verifyToken')
const { uploadImage } = require('../config/upload')




router.use(verifyAccessToken)

router.post('/studio/create', uploadImage.single('attachment'), notesOfStudio)
router.post('/user/create', uploadImage.single('attachment'), notesOfUser)
router.get('/studio/get', getNotesOfStudio)
router.get('/user/get', getNotesOfStaff)



router.put('/:noteId', updateNotes)
router.delete('/:noteId', deleteNotes)


module.exports = router