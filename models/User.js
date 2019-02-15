export default (sequelize, DataTypes) => {
  const User = sequelize.define(
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
        type: DataTypes.TEXT
      },
      firstname: {
        type: DataTypes.STRING(500)
      },
      lastname: {
        type: DataTypes.STRING(100),
        defaultValue: null
      },
      gender: {
        type: DataTypes.STRING(100),
        defaultValue: null
      },
      following: {
        type: DataTypes.STRING(100),
        defaultValue: null
      },
      phone: {
        type: DataTypes.STRING(100),
        defaultValue: null
      },
      address: {
        type: DataTypes.STRING(100),
        defaultValue: null
      }
    },
    { tableName: "users" }
  );

  User.associate = models => {
    User.hasMany(models.Article, { onDelete: "CASCADE", hooks: true });
    User.belongsToMany(models.User, {
      through: models.Follower,
      as: "followings",
      foreignKey: "followerId",
      targetKey: "followerId"
    });
  };
  return User;
};
