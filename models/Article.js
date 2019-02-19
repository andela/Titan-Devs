export default (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      body: { type: DataTypes.TEXT, allowNull: false },
      readTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      tableName: "articles"
    }
  );
  Article.associate = models => {
    /**
     * This will add the `userId` attribute in the `Article` model
     */
    Article.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true
    });
    Article.belongsToMany(models.Tag, {
      through: "ArticleTag",
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return Article;
};
