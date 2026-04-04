const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    assignStaffToRole,
    removeStaffFromRole,
    getStaffByRole,

    // permission
    getRolePermissions,
    updateRolePermissions,
    checkStaffPermission,
    getMyPermissions


} = require('../controllers/RoleController');
const { verifyAccessToken } = require('../middleware/verifyToken');

// All routes require authentication
router.use(verifyAccessToken);

// Role CRUD operations
router.route('/')
    .get(getRoles)
    .post(createRole);

router.route('/:roleId')
    .get(getRoleById)
    .put(updateRole)
    .delete(deleteRole);

// Staff assignment routes
router.route('/:roleId/assign-staff')
    .post(assignStaffToRole);

router.route('/:roleId/staff/:staffId')
    .delete(removeStaffFromRole);

router.route('/:roleId/staff')
    .get(getStaffByRole);




// Get current user's permissions
router.route('/my-permissions')
    .get(getMyPermissions);

// Get and update role permissions
router.route('/:roleId/permissions')
    .get(getRolePermissions)
    .put(updateRolePermissions);

// Check staff permission
router.route('/check-permission/:staffId/:permission')
    .get(checkStaffPermission);



module.exports = router;