export default (sequelize, DataTypes) => {
  const user = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 1
      }
    },
    // for postgres always set tables names in lower cases to avoid problems in the future
    { tableName: "users" }
  );

  // eslint-disabled-next-line no-use-before-define
  user.associate = models => {
    // associations can be defined here
  };
  return user;
};
