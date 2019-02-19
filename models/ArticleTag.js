export default (sequelize, DataTypes) => {
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

  return ArticleTag;
};
