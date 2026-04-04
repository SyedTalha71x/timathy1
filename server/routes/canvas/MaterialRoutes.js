const express = require('express')


const {
    getAllMaterial,
    createIntroduction,
    updateIntroduction,
    deleteIntroduction
} = require('../../controllers/canvas/MaterialController')


const { verifyAccessToken } = require('../../middleware/verifyToken')

const router = express.Router()

router.use(verifyAccessToken)



router.get('/',getAllMaterial)
router.post('/create',createIntroduction)
router.put('/:id',updateIntroduction)
router.delete('/:id',deleteIntroduction)


module.exports = router