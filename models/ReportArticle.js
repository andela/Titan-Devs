module.exports = (sequelize, DataTypes) => {
  const ReportArticle = sequelize.define(
    "ReportArticle",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      description: DataTypes.STRING
    },
    { tableName: "reportArticles" }
  );
  ReportArticle.associate = models => {
    ReportArticle.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true
    });
    ReportArticle.belongsTo(models.Article, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return ReportArticle;
};
