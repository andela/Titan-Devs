export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      body: {
        allowNull: false,
        type: DataTypes.TEXT
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
  };
  return Comment;
};
