module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
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
    { tableName: "roles" }
  );
  Role.associate = function(models) {
    Role.hasMany(models.UserRoles, {
      foreignKey: "roleId",
      onDelete: "CASCADE",
      hooks: true
    });
    Role.hasMany(models.RolePermissions, {
      foreignKey: "roleId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return Role;
};
