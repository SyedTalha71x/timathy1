const express = require('express');
const { createAdmin, loginAdmin, getUsers, updateAdminById, deleteUser } = require('../controllers/AdminController');
const { isAdmin } = require('../middleware/RoleCheck');
const { verifyAccessToken } = require('../middleware/verifyToken');


const router = express.Router();


router.post('/create', createAdmin)
// router.put('/:id',  updateAdminById)
router.post('/login', loginAdmin)

router.get('/users', verifyAccessToken, isAdmin, getUsers)
router.delete('/:id', verifyAccessToken, isAdmin, deleteUser)


module.exports = router