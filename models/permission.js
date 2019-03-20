module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    "Permission",
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      }
    },
    { tableName: "permissions" }
  );
  Permission.associate = models => {
    Permission.hasMany(models.RolePermissions, {
      foreignKey: "permissionId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return Permission;
};
