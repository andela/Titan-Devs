export default (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    "Rating",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      userId: DataTypes.UUID,
      articleId: DataTypes.UUID,
      rating: DataTypes.INTEGER
    },
    { tableName: "ratings" }
  );
  Rating.associate = models => {
    Rating.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Rating.belongsTo(models.Article, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      allowNull: true
    });
  };
  return Rating;
};
