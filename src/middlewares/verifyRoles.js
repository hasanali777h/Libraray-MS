'use strict'
const Roles = require('../roles/models/role.model')

const verifyRoles = async (req, res, next) => {
    try {
        const role = req.user.roleId
        const foundRoles = await Roles.find(
            {},
            { createdAt: 0, updatedAt: 0, __v: 0 }
        )
        const check = foundRoles.filter((fr) => fr._id.toString() === role)
        if (
            !check ||
            check === null ||
            check === undefined ||
            check.length === 0
        ) {
            throw new Error('Invalid Role')
        }
        next()
    } catch (error) {
        console.error('verifyRoles error:', error)
        res.status(403).json({ message: error.message || 'Unauthorized' })
    }
}

module.exports = verifyRoles
