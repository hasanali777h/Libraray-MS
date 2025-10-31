'use strict';
const router = require('express').Router()
const controller = require('../controllers/book.controller')
const authenticateToken = require('../../middlewares/verifyToken')
const verfiyRoles = require("../../middlewares/verifyRoles")
const verifyPermissions = require("../../middlewares/verifyPermissions")

router.post('/create', authenticateToken, verfiyRoles, verifyPermissions(['create']), controller.bookCreate)
router.get('/get', authenticateToken, verfiyRoles, verifyPermissions(['read']), controller.bookGet)
router.get('/get/:id', authenticateToken, verfiyRoles, verifyPermissions(['read']), controller.bookGetOne)
router.put('/update/:id', authenticateToken, verfiyRoles, verifyPermissions(['update']), controller.bookUpdate)
router.delete('/delete/:id', authenticateToken, verfiyRoles, verifyPermissions(['delete']), controller.bookDelete)
module.exports = router
