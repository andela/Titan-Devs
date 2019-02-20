import slug from "slug";

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
      },
      slug: { type: DataTypes.STRING, allowNull: false }
    },
    {
      tableName: "articles",
      hooks: {
        beforeCreate(article) {
          article.slug = slug(
            `${article.title}-${(Math.random() * 36 ** 6 || 0).toString(36)}`
          ).toLowerCase();
        }
      }
    }
  );
  Article.associate = models => {
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
    Article.hasMany(models.Comment, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
    Article.hasMany(models.Bookmark, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
    Article.hasMany(models.ReportArticle, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
    Article.hasMany(models.ReportArticle, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
    Article.belongsToMany(models.User, {
      through: models.ArticleLike,
      as: "likes",
      foreignKey: "articleId"
    });
  };
  return Article;
};
