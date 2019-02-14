"use strict";
module.exports = (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define(
    "ArticleTag",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      }
    },
    { tableName: "articleTags" }
  );
  ArticleTag.associate = function(models) {
    // associations can be defined here
  };
  return ArticleTag;
};
