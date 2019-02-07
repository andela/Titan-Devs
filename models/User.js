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
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      bio: {
        type: DataTypes.STRING(500)
      },
      image: {
        type: DataTypes.STRING(100),
        defaultValue: null
      },
      resetToken: {
        type: DataTypes.TEXT,
        defaultValue: null
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      bio: {
        type: DataTypes.STRING(500)
      },
      image: {
        type: DataTypes.STRING(100),
        defaultValue: null
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
