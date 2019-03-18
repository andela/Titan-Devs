'use strict';
module.exports = (sequelize, DataTypes) => {
  const RolePermissions = sequelize.define('RolePermissions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }
  }, { tableName: "rolePermissions" });
  RolePermissions.associate = function(models) {
    RolePermissions.belongsTo(models.Permission, {
      foreignKey: "permissionId",
      onDelete: "CASCADE",
      hooks: true
    });
    RolePermissions.belongsTo(models.Role, {
      foreignKey: "roleId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return RolePermissions;
};