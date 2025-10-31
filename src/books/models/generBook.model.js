const mongoose = require('mongoose')
const generSchema = new mongoose.Schema(
    {
        gener: String,
        book: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book',
        },
    },
    { timestamps: true }
)
const Gener = mongoose.model('Gener', generSchema)
module.exports = Gener
