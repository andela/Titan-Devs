export default (sequelize, DataTypes) => {
  const Highlight = sequelize.define(
    "Highlight",
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      startIndex: DataTypes.INTEGER,
      endIndex: DataTypes.INTEGER,
      userId: DataTypes.UUID,
      articleId: DataTypes.UUID,
      highlightedText: DataTypes.STRING
    },
    {
      tableName: "highlights",
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ["deletedAt"] }
      }
    }
  );
  Highlight.associate = models => {
    Highlight.belongsTo(models.Article, {
      foreignKey: "articleId",
      onDelete: "CASCADE"
    });

    Highlight.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Highlight.hasOne(models.Comment, {
      as: "comment",
      foreignKey: "highlightId",
      onDelete: "CASCADE"
    });
  };
  return Highlight;
};
