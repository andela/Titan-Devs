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
      create_: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      read_: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      update_: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      delete_: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      roleId: { type: DataTypes.UUID, allowNull: false }
    },
    { tableName: "permissions" }
  );
  Permission.associate = models => {
    Permission.belongsTo(models.Role, {
      foreignKey: "roleId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return Permission;
};
