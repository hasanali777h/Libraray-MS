'use strict';
const router = require('express').Router();
const controller = require('../controllers/note.controller');
const authenticateToken = require('../../middlewares/verifyToken');
const verfiyRoles = require('../../middlewares/verifyRoles');
const verifyPermissions = require('../../middlewares/verifyPermissions');
const verifyModules = require('../../middlewares/verifyModule');

router.post(
    '/create',
    authenticateToken,
    verifyPermissions(['create']),
    verfiyRoles,
    controller.noteCreate
);
router.get(
    '/get',
    authenticateToken,
    verifyPermissions(['read']),
    verfiyRoles,
    verifyModules(['notes','users', 'books'],['read']),
    controller.noteGet
);
router.get(
    '/get/:id',
    authenticateToken,
    verifyPermissions(['read']),
    verfiyRoles,
    controller.noteGetOne
);
router.put(
    '/update/:id',
    authenticateToken,
    verifyPermissions(['update']),
    verfiyRoles,
    controller.noteUpdate
);
router.delete(
    '/delete/:id',
    authenticateToken,
    verfiyRoles,
    verifyPermissions(['delete']),
    controller.noteDelete
);
module.exports = router;
