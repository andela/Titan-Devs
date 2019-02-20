module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define(
    "CommentLike",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      commentId: DataTypes.UUID,
      userId: DataTypes.UUID
    },
    {
      tableName: "commentlikes"
    }
  );
  return CommentLike;
};
