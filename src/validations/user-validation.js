'use strict';
const Joi = require('joi')

const userRegisterValidation = Joi.object().keys({
    username: Joi.string().required().description('username is required'),
    email: Joi.string().required().description('email is required'),
    password: Joi.string().required().description('password is required'),
    roleId: Joi.string().optional(),
    permissionId: Joi.array().optional()
})

const userLoginValidation = Joi.object().keys({
    email: Joi.string().required().description('email is required'),
    password: Joi.string().required().description('password is required'),
})

module.exports = { userRegisterValidation, userLoginValidation }
