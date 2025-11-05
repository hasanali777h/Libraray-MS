'use strict';
const router = require('express').Router();
const controller = require('../controllers/note.controller');
const authenticateToken = require('../../middlewares/verifyToken');
const verfiyRoles = require('../../middlewares/verifyRoles');
const verifyPermissions = require('../../middlewares/verifyPermissions');

router.post(
    '/create',
    authenticateToken,
    verfiyRoles,
    verifyPermissions(['create']),
    controller.noteCreate
);
router.get(
    '/get',
    authenticateToken,
    verfiyRoles,
    verifyPermissions(['read']),
    controller.noteGet
);
router.get(
    '/get/:id',
    authenticateToken,
    verfiyRoles,
    verifyPermissions(['read']),
    controller.noteGetOne
);
router.put(
    '/update/:id',
    authenticateToken,
    verfiyRoles,
    verifyPermissions(['update']),
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
