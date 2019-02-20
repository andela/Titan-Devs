module.exports = (sequelize, DataTypes) => {
  const ArticleLike = sequelize.define(
    "ArticleLike",
    {
      userId: DataTypes.UUID,
      articleId: DataTypes.UUID
    },
    {
      tableName: "articleLikes"
    }
  );
  return ArticleLike;
};
