'use strict';
const router = require('express').Router();
const controller = require('../controllers/role.controller');
const authenticateToken = require('../../middlewares/verifyToken');

router.post('/create', controller.roleCreate);
router.get('/get', controller.roleGet);
router.get('/get/:id', controller.roleGetOne);
router.put('/update/:id', controller.roleUpdate);
router.delete('/delete/:id', controller.roleDelete);
module.exports = router;
