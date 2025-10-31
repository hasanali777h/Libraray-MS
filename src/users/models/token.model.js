'use strict';
const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Role',
    },
    permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Permission',
    },
    createdAt: { type: Date, default: Date.now, expires: '7d' }, // Token expires in 7 days
})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
module.exports = RefreshToken
