import slug from "slug";

const readTime = article => Math.ceil(article.body.split(" ").length / 265);

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
      paranoid: true,
      hooks: {
        beforeCreate(article) {
          article.slug = slug(
            `${article.title}-${(Math.random() * 36 ** 6 || 0).toString(36)}`
          ).toLowerCase();
          article.readTime = readTime(article);
        },
        beforeUpdate(article) {
          article.readTime = readTime(article);
        }
      }
    }
  );
  Article.associate = models => {
    Article.belongsTo(models.User, {
      foreignKey: "userId",
      as: "author",
      onDelete: "CASCADE",
      hooks: true
    });
    Article.belongsToMany(models.Tag, {
      through: "ArticleTags",
      foreignKey: "articleId",
      as: "tagsList"
    });
    Article.hasMany(models.Rating, {
      foreignKey: "articleId",
      onDelete: "CASCADE"
    });
    Article.hasMany(models.Comment, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      as: "comments",
      hooks: true
    });
    Article.hasMany(models.Bookmark, {
      foreignKey: "articleId",
      as: "bookmarks",
      onDelete: "CASCADE",
      hooks: true
    });
    Article.hasMany(models.ReportArticle, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
    Article.hasMany(models.Highlight, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
    Article.belongsToMany(models.User, {
      through: models.ArticleLike,
      as: "likes",
      onDelete: "CASCADE",
      foreignKey: "articleId"
    });
  };
  return Article;
};
