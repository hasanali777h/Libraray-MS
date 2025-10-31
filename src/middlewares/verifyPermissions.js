'use strict';

const Role = require('../roles/models/role.model');
const Permission = require('../permissions/models/permission.model');

/**
 * Middleware to check if user has required permission(s)
 * @param {string[]} requiredPermissions - list of permission names allowed for this route
 */
const verifyPermissions = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      const userRoleId = req?.user?.roleId;
      console.log(userRoleId,"userRoleId")
      if (!userRoleId) {
        return res.status(403).json({ message: 'User role not found.' });
      }
      const foundRole = await Role.findById(userRoleId).populate('permissionId');
      console.log(foundRole,"foundRole")
      if (!foundRole) {
        return res.status(403).json({ message: 'Role not found.' });
      }
      const rolePermissions = foundRole.permissionId.map(p => p.permission);
      console.log(rolePermissions,"rolePermissions")
      const dbPermissions = await Permission.find({
        permission: { $in: requiredPermissions },
      });
      console.log(dbPermissions,"dbPermissions")
      const validPermissions = dbPermissions.map(p => p.permission);
      console.log(validPermissions,"validPermissions")
      const isAllowed = validPermissions.every(p =>
        rolePermissions.includes(p)
      );
      console.log(isAllowed,"isAllowed")
      if (!isAllowed) {
        return res.status(403).json({ message: 'Access denied. Permission not allowed.' });
      }
      next();
    } catch (err) {
      console.error('Permission verification error:', err);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
};

module.exports = verifyPermissions;
