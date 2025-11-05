'use strict';
const router = require('express').Router();
const controller = require('../controllers/permission.controller');
const authenticateToken = require('../../middlewares/verifyToken');

router.post('/create', controller.permissionCreate);
router.get('/get', controller.permissionGet);
router.get('/get/:id', controller.permissionGetOne);
router.put('/update/:id', controller.permissionUpdate);
router.delete('/delete/:id', controller.permissionDelete);
module.exports = router;
