"use strict";
module.exports = (sequelize, DataTypes) => {
  const ArticleLike = sequelize.define(
    "ArticleLike",
    {
      userId: DataTypes.UUID,
      articleId: DataTypes.UUID
    },
    {}
  );
  ArticleLike.associate = models => {
    ArticleLike.belongsTo(models.User);
    ArticleLike.belongsTo(models.Article);
  };
  return ArticleLike;
};
