'use strict';
const Role = require('../roles/models/role.model');
const User = require('../users/models/user.model');
const log = require('../utils/logger');

const verifyModules = (restrictModuleName = [], moduleActions = []) => {
    return async (req, res, next) => {
        try {
            const userIdInReq = req.user._id;
            const foundUser = await User.findById(userIdInReq);
            if (!foundUser?.isActive) {
                return res.status(400).json({ message: 'user is blocked' });
            }
            const foundRole = await Role.findById(foundUser.roleId, {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                'restrictions._id': 0,
            }).populate('permissionId');
            if (
                !foundRole?.restrictions ||
                foundRole.restrictions.length === 0
            ) {
                return next();
            }
            const restrictSaveInDB = await Role.find({
                _id: foundRole._id,
                'restrictions.actions': { $in: moduleActions },
                'restrictions.moduleName': { $in: restrictModuleName },
            });
            const foundRestricts = restrictSaveInDB.flatMap(
                (r) => r.restrictions
            );
            const foundModules = [
                ...new Set(foundRestricts.map((m) => m.moduleName)),
            ];
            const foundActions = [
                ...new Set(restrictSaveInDB.flatMap((a) => a.actions)),
            ];
            if (foundModules.length > 0 && foundActions.length > 0) {
                return res.status(403).json({
                    message: `Access denied for modules: ${foundModules.join(
                        ', '
                    )}`,
                    actions: foundActions,
                });
            }
            next();
        } catch (error) {
            log.error(error);
        }
    };
};
module.exports = verifyModules;
