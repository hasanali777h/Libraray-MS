'use strict';
const router = require('express').Router()
const controller = require('../controllers/role.controller')
const authenticateToken = require('../../middlewares/verifyToken')
// router.post('/create', authenticateToken, controller.roleCreate)
// router.get('/get', authenticateToken, controller.roleGet)
// router.get('/get/:id', authenticateToken, controller.roleGetOne)
// router.put('/update/:id', authenticateToken, controller.roleUpdate)
// router.delete('/delete/:id', authenticateToken, controller.roleDelete)

router.post('/create', controller.roleCreate)
router.get('/get', controller.roleGet)
router.get('/get/:id', controller.roleGetOne)
router.put('/update/:id', controller.roleUpdate)
router.delete('/delete/:id', controller.roleDelete)
module.exports = router
