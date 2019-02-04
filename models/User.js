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
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    // for postgres always set tables names in lower cases to avoid problems in the futures
    { tableName: "users" }
  );
  user.associate = models => {
    // associations can be defined here
  };
  return user;
};
