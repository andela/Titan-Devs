module.exports = (sequelize, DataTypes) => {
  const Commentlog = sequelize.define(
    "Commentlog",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      oldVersion: DataTypes.STRING,
      newVersion: DataTypes.STRING
    },
    { tableName: "commentlogs", paranoid: true }
  );

  Commentlog.associate = models => {
    Commentlog.belongsTo(models.Comment, {
      foreignKey: "commentId",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return Commentlog;
};
