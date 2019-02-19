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
      }
    },
    { tableName: "comments" }
  );
  Comment.associate = models => {
    Comment.belongsTo(models.Article, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true
    });

    Comment.hasMany(models.commentlike, { as: "likes", foreignKey: "commentId" });
    // associations can be defined here
  };
  return Comment;
};
