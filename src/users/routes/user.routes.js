'use strict';
const router = require('express').Router();
const controller = require('../controllers/user.controller');
const authenticateToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const verifyPermissions = require('../../middlewares/verifyPermissions');

router.get(
    '/get',
    authenticateToken,
    verifyPermissions(['read']),
    verifyRoles,
    controller.userGet
);
router.get(
    '/get/:id',
    authenticateToken,
    verifyPermissions(['read']),
    verifyRoles,
    controller.userGetOne
);
router.put(
    '/update/:id',
    authenticateToken,
    verifyPermissions(['update']),
    verifyRoles,
    controller.userUpdate
);
router.delete(
    '/delete/:id',
    authenticateToken,
    verifyPermissions(['delete']),
    verifyRoles,
    controller.userDelete
);
module.exports = router;
