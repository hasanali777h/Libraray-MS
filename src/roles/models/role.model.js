'use strict';
const mongoose = require('mongoose');
mongoose.set('strictPopulate', false);

const roleSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            validate: {
                validator: async function (value) {
                    const existingRole = await mongoose.models.Role.findOne({
                        role: value,
                    });
                    return !existingRole || existingRole._id.equals(this._id);
                },
                message: 'Role already exists',
            },
        },
        permissionId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                ref: 'Permission',
            },
        ],
        restrictions: [
            {
                moduleName: String,
                actions: [String],
            },
        ],
    },
    { timestamps: true }
);
const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
