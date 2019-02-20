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
      },
      isVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    { tableName: "users" }
  );

  User.associate = models => {
    User.hasMany(models.Article, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true
    });
    User.hasMany(models.Comment, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true,
      as: "comments"
    });
    User.belongsToMany(models.Comment, {
      through: models.CommentLike,
      as: "likedBy",
      foreignKey: "userId"
    });

    User.belongsToMany(models.User, {
      through: models.Follower,
      as: "followings",
      foreignKey: "followerId",
      targetKey: "followerId",
      onDelete: "CASCADE"
    });

    User.belongsToMany(models.Article, {
      through: models.ArticleLike,
      as: "likes",
      foreignKey: "userId"
    });
    User.hasMany(models.ReportArticle, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true
    });
    User.hasMany(models.ReportArticle, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return User;
};
