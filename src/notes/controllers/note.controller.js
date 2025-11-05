'use strict';
const asyncWrapper = require('../../utils/catchAsync');
const Note = require('../models/note.model');
const APIFeatures = require('../../utils/apiFeatures');

const noteCreate = asyncWrapper(async (req, res) => {
    const note = await Note.create(req.body);
    res.status(201).json(note);
});

const noteGet = asyncWrapper(async (req, res) => {
    const query = Note.find({}, { createdAt: 0, updatedAt: 0, __v: 0 });
    const result = new APIFeatures(query, req.query)
        .search(['title', 'text'])
        .filter()
        .select()
        .sort()
        .paginate();
    const note = await result.query;
    const count = await User.countDocuments(result.query.getQuery());
    const totalPages = Math.ceil(count / result.limit);
    res.status(200).json({
        page: result.page,
        limit: result.limit,
        totalDocs: count,
        totalPages,
        data: note,
    });
});

const noteGetOne = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    });
    res.status(200).json(note);
});

const noteUpdate = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const note = await Note.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(note);
});

const noteDelete = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    res.status(200).json(note);
});

module.exports = {
    noteCreate,
    noteGet,
    noteGetOne,
    noteUpdate,
    noteDelete,
};
