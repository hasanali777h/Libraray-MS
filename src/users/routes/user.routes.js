'use strict';
const router = require('express').Router();
const controller = require('../controllers/user.controller');
const validator = require('../../middlewares/validator');
const {
    userRegisterValidation,
    userLoginValidation,
} = require('../../validations/user-validation');
const authenticateToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const verifyPermissions = require('../../middlewares/verifyPermissions');
router.post(
    '/register',
    validator(userRegisterValidation, 'body'),
    controller.register
);
router.post('/login', validator(userLoginValidation, 'body'), controller.login);
router.post('/token', controller.token);
router.post('/logout', controller.logout);
router.get(
    '/get',
    authenticateToken,
    verifyRoles,
    verifyPermissions(['read']),
    controller.userGet
);
router.get(
    '/get/:id',
    authenticateToken,
    verifyRoles,
    verifyPermissions(['read']),
    controller.userGetOne
);
router.put(
    '/update/:id',
    authenticateToken,
    verifyRoles,
    verifyPermissions(['update']),
    controller.userUpdate
);
router.delete(
    '/delete/:id',
    authenticateToken,
    verifyRoles,
    verifyPermissions(['delete']),
    controller.userDelete
);
module.exports = router;
