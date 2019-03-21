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
      name: { type: DataTypes.STRING, unique: true, allowNull: false }
    },
    { tableName: "tags" }
  );
  Tag.associate = models => {
    Tag.belongsToMany(models.Article, {
      through: "ArticleTags",
      foreignKey: "tagId",
      as: "articles",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return Tag;
};
