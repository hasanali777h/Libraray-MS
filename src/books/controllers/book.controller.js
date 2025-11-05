'use strict';
const Book = require('../models/book.model');
const asyncWrapper = require('../../utils/catchAsync');
const { successResponse, failedResponse } = require('../../utils/response');
const mongoose = require('mongoose');
const APIFeatures = require('../../utils/apiFeatures');

const bookCreate = asyncWrapper(async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(
            successResponse('book created successfully', book)
        );
    } catch (error) {
        failedResponse('Error in book creation', error);
    }
});

const bookGet = asyncWrapper(async (req, res) => {
    try {
        const query = Book.find({ createdAt: 0, updatedAt: 0, __v: 0 });
        const result = new APIFeatures(query, req.query)
            .search(['title', 'author', 'publish', 'edition'])
            .filter()
            .search()
            .sort()
            .paginate();
        const book = await result.query;
        const count = await Book.countDocuments(result.query.getQuery());
        const totalPages = Math.ceil(count / result.limit);
        return res.status(200).json(
            successResponse('All books fetched successfully', {
                page: result.page,
                limit: result.limit,
                totalDocs: count,
                totalPages,
                docs: book,
            })
        );
    } catch (error) {
        console.log(error);
        return failedResponse('Error in book fetching', error);
    }
});

const bookGetOne = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json(failedResponse('Invalid book ID format'));
        }
        const book = await Book.findById(id, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });
        if (!book) {
            return res.status(404).json(failedResponse('Book not found'));
        }
        return res
            .status(200)
            .json(
                successResponse('The book fetched successfully', { docs: book })
            );
    } catch (error) {
        failedResponse('Error in book fetching', error);
    }
});

const bookUpdate = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            id === null ||
            id === undefined ||
            id === ''
        ) {
            return res
                .status(400)
                .json(failedResponse('Invalid book ID format'));
        }
        const book = await Book.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(
            successResponse('The book updated successfully', { docs: book })
        );
    } catch (error) {
        failedResponse('Error in book updating', error);
    }
});

const bookDelete = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndDelete(id);
        res.status(200).json(
            successResponse('The book deleted successfully', { docs: book })
        );
    } catch (error) {
        failedResponse('Error in book updating', error);
    }
});

module.exports = {
    bookCreate,
    bookGet,
    bookGetOne,
    bookUpdate,
    bookDelete,
};
