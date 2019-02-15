export default (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING
    },
    { tableName: "tags" }
  );
  Tag.associate = models => {
    Tag.belongsToMany(models.Article, {
      through: "ArticleTag",
      foreignKey: "tagId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return Tag;
};
