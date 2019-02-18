<<<<<<< HEAD
=======
"use strict";
>>>>>>> 163518692 Enable user to like and unlike an article
module.exports = (sequelize, DataTypes) => {
  const ArticleLike = sequelize.define(
    "ArticleLike",
    {
      userId: DataTypes.UUID,
<<<<<<< HEAD
      articleId: DataTypes.UUID,
      like: DataTypes.BOOLEAN
    },
    {
      tableName: "articleLikes"
    }
  );
=======
      articleId: DataTypes.UUID
    },
    {}
  );
  ArticleLike.associate = models => {
    ArticleLike.belongsTo(models.User);
    ArticleLike.belongsTo(models.Article);
  };
>>>>>>> 163518692 Enable user to like and unlike an article
  return ArticleLike;
};
