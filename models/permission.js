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
      resource: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      },
      createPermission: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      readPermission: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      updatePermission: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      deletePermission: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      roleId: { type: DataTypes.UUID}
    },
    { tableName: "permissions" }
  );
  Permission.associate = models => {
    Permission.belongsTo(models.Role, {
      foreignKey: "roleId",
    });
  };
  return Permission;
};
