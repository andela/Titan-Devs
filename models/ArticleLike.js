module.exports = (sequelize, DataTypes) => {
  const ArticleLike = sequelize.define(
    "ArticleLike",
    {
      userId: DataTypes.UUID,
      articleId: DataTypes.UUID,
      like: DataTypes.BOOLEAN
    },
    {
      tableName: "articleLikes"
    }
  );
  return ArticleLike;
};
