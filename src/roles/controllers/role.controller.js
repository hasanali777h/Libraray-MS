'use strict';
const asyncWrapper = require('../../utils/catchAsync');
const Role = require('../models/role.model');

const roleCreate = asyncWrapper(async (req, res) => {
    const role = await Role.create(req.body);
    res.status(201).json(role);
});

const roleGet = asyncWrapper(async (req, res) => {
    const role = await Role.find({}, { createdAt: 0, updatedAt: 0, __v: 0 });
    const count = await Role.countDocuments();
    res.status(200).json({ totalDocs: count, data: role });
});

const roleGetOne = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const role = await Role.findById(id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    });
    res.status(200).json(role);
});

const roleUpdate = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const role = await Role.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(role);
});

const roleDelete = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);
    res.status(200).json(role);
});

module.exports = {
    roleCreate,
    roleGet,
    roleGetOne,
    roleUpdate,
    roleDelete,
};
