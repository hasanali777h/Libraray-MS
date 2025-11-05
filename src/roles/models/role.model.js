'use strict';
const mongoose = require('mongoose');
mongoose.set('strictPopulate', false);
const roleSchema = new mongoose.Schema(
    {
        role: String,
        permissionId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                ref: 'Permission',
            },
        ],
    },
    { timestamps: true }
);
const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
