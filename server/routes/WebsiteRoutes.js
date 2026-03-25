const express = require('express')
const {
    createWebsite,
    updateWebsite,
    deleteWebsite,
    getWebsites
} = require('../controllers/websiteController')
const { isStaff } = require('../middleware/RoleCheck')
const { verifyAccessToken } = require('../middleware/verifyToken')



const router = express.Router()


router.use(verifyAccessToken);


router.post('/create', createWebsite)
router.get('/', getWebsites)
router.put('/:id', isStaff, updateWebsite)
router.delete('/:id', isStaff, deleteWebsite)


module.exports = router

