'use strict';
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
    {
        permission: String,
    },
    { timestamps: true }
);
const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
