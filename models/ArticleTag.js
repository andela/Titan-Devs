export default (sequelize, DataTypes) => {
  const ArticleTags = sequelize.define(
    "ArticleTags",
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      tagId: DataTypes.UUID,
      articleId: DataTypes.UUID
    },
    { tableName: "articleTags" }
  );
  return ArticleTags;
};
