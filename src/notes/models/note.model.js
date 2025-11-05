'use strict';
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
    {
        title: String,
        text:String
    },
    { timestamps: true }
)
const Note = mongoose.model('Note', noteSchema)
module.exports = Note
