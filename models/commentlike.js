"use strict";
module.exports = (sequelize, DataTypes) => {
  const Commentlike = sequelize.define(
    "commentlike",
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
    {}
  );
  Commentlike.associate = function(models) {
    // associations can be defined here
    Commentlike.belongsTo(models.User, {
      foreignKey: "userId",
      as: "likedBy",
      onDelete: "CASCADE",
      hooks: true
    });
    Commentlike.belongsTo(models.Comment, {
      foreignKey: "commentId",
      as: "likes",
      onDelete: "CASCADE",
      hooks: true
    });
  };
  return Commentlike;
};
