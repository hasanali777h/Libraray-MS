'use strict';
const router = require('express').Router();
const controller = require('../controllers/book.controller');
const authenticateToken = require('../../middlewares/verifyToken');
const verfiyRoles = require('../../middlewares/verifyRoles');
const verifyPermissions = require('../../middlewares/verifyPermissions');

router.post(
    '/create',
    authenticateToken,
    verifyPermissions(['create']),
    verfiyRoles,
    controller.bookCreate
);
router.get(
    '/get',
    authenticateToken,
    verifyPermissions(['read']),
    verfiyRoles,
    controller.bookGet
);
router.get(
    '/get/:id',
    authenticateToken,
    verifyPermissions(['read']),
    verfiyRoles,
    controller.bookGetOne
);
router.put(
    '/update/:id',
    authenticateToken,
    verifyPermissions(['update']),
    verfiyRoles,
    controller.bookUpdate
);
router.delete(
    '/delete/:id',
    authenticateToken,
    verifyPermissions(['delete']),
    verfiyRoles,
    controller.bookDelete
);
module.exports = router;
