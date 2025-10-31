'use strict';
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
    {
        username: String,
        email: {
            type: String,
            // validate: {
            //     validator: async function (value) {
            //         const existingUser = await mongoose.models.User.findOne({
            //             email: value,
            //         })
            //         return !existingUser || existingUser._id.equals(this._id)
            //     },
            //     message: 'Email already exists',
            // },
        },
        password: String,
        roleId: {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                ref: 'Role',
            },
        // permissionId: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         require: true,
        //         ref: 'Permission',
        //     },
        // ],
    },
    { timestamps: true }
)
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
const User = mongoose.model('User', userSchema)
module.exports = User
