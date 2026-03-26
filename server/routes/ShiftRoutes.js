const express = require('express')
const { createShift, getShifts, updateShift, deleteShift, checkedInShift } = require('../controllers/ShiftController')
const { verifyAccessToken } = require('../middleware/verifyToken')

const router = express.Router()


router.use(verifyAccessToken)


router.post('/create', createShift)
router.get('/', getShifts)
router.put('/:id', updateShift)
router.delete('/:id', deleteShift)


// checked in
router.patch('/:id/check-in', checkedInShift)

module.exports = router