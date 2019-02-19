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
    // for postgres always set tables names in lower cases to avoid problems in the future
    { tableName: "users" }
  );

  // eslint-disabled-next-line no-use-before-define
  User.associate = models => {
    User.hasMany(models.Article, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true
    });
    // associations can be defined here
    User.belongsToMany(models.User, {
      through: models.Follower,
      as: "followings",
      foreignKey: "followerId",
      targetKey: "followerId"
    });
  };
  return User;
};
