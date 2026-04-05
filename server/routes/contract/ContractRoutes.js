const express = require('express')

const {
    // pause Reason
    createPauseReason,
    updatePauseReason,
    deletePauseReason,
    getAllPauseReason,

    // renew Reason
    createRenewReason,
    updateRenewReason,
    deleteRenewReason,
    getAllRenewReason,

    // bonus Reason
    createBonusReason,
    updateBonusReason,
    deleteBonusReason,
    getAllBonusReason,

    // change Reason
    createChangeReason,
    updateChangeReason,
    deleteChangeReason,
    getAllChangeReason
} = require('../../controllers/contracts/ContractController')





const {
    getContractForms,
    createContractForm,
    updateContractForm,
    deleteContractForm
} = require('../../controllers/contracts/ContractFormController')

const { verifyAccessToken } = require('../../middleware/verifyToken')


const router = express.Router()


router.use(verifyAccessToken)

// **** All Pause Routes ********
router.get('/pauses', getAllPauseReason)
router.post('/pause/create', createPauseReason)
router.put('/pause/:pauseId', updatePauseReason)
router.delete('/pause/:pauseId', deletePauseReason)

// **** All Renew Routes ********
router.get('/renew', getAllRenewReason)
router.post('/renew/create', createRenewReason)
router.put('/renew/:renewId', updateRenewReason)
router.delete('/renew/:renewId', deleteRenewReason)

// **** All Change Routes ********
router.get('/changes', getAllChangeReason)
router.post('/change/create', createChangeReason)
router.put('/change/:changeId', updateChangeReason)
router.delete('/change/:changeId', deleteChangeReason)

// **** All Bonus Routes ********
router.get('/bonuses', getAllBonusReason)
router.post('/bonus/create', createBonusReason)
router.put('/bonus/:bonusId', updateBonusReason)
router.delete('/bonus/:bonusId', deleteBonusReason)



// contract Forms

router.get('/contractForms', getContractForms)
router.post('/contractForms/create', createContractForm)
router.put('/contractForms/:formId', updateContractForm)
router.delete('/contractForms/:formId', deleteContractForm)





module.exports = router