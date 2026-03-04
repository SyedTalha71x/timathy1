const express = require('express')
const router = express.Router();

const { createRelations, AllRelationByIdz, allRelation } = require('../controllers/RelationController')

const { verifyAccessToken } = require('../middleware/verifyToken');


router.post('/create', verifyAccessToken, createRelations)
router.get('/all/:id', verifyAccessToken, AllRelationByIdz)
router.get('/all', verifyAccessToken, allRelation)
module.exports = router;