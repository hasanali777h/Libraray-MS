'use strict';
const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const validator = require('../../middlewares/validator');
const {
    userRegisterValidation,
    userLoginValidation,
} = require('../../validations/user-validation');

router.post(
    '/register',
    validator(userRegisterValidation, 'body'),
    controller.register
);
router.post('/login', validator(userLoginValidation, 'body'), controller.login);
router.post('/token', controller.token);
router.post('/logout', controller.logout);

module.exports = router;
