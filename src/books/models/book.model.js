'use strict';
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: String,
        availabe: { type: Boolean, default: false },
        price: Number,
        image: { type: String, default: null },
        file: { type: String, default: null },
        // gener: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: 'Gener',
        // },
        author: String,
        publish: String,
        edition: String,
    },
    { timestamps: true }
);
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
