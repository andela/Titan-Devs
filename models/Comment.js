export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      body: { type: DataTypes.TEXT, allowNull: false },
      like: {
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      highlightId: DataTypes.UUID
    },
    { tableName: "comments", paranoid: "true" }
  );
  Comment.associate = models => {
    Comment.belongsTo(models.Article, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });

    Comment.belongsTo(models.Highlight, {
      as: "highlight",
      foreignKey: "highlightId",
      onDelete: "CASCADE"
    });
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true,
      as: "author"
    });
    Comment.belongsToMany(models.User, {
      through: models.CommentLike,
      as: "likes",
      foreignKey: "commentId"
    });

    Comment.hasMany(models.Commentlog, {
      foreignKey: "commentId",
      as: "commentHistory"
    });

    Comment.hasMany(models.CommentLike, {
      foreignKey: "commentId",
      onDelete: "CASCADE",
      as: "likesCount",
      hooks: true
    });
  };
  return Comment;
};
