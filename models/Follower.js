"use strict";
module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define(
    "Follower",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      followerId: DataTypes.UUID,
      followingId: DataTypes.UUID
    },
    {
      tableName: "followers"
    }
  );
  Follower.associate = models => {
    // associations can be defined here
    Follower.belongsTo(models.User, {
      foreignKey: "followerId"
    });
  };
  return Follower;
};
