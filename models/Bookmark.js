export default (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    "Bookmark",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      articleId: { type: DataTypes.UUID, allowNull: false }
    },
    { tableName: "bookmarks" }
  );
  Bookmark.associate = models => {
    Bookmark.belongsTo(models.Article, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return Bookmark;
};
