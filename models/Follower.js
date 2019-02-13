"use strict";
module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define(
    "Follower",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      followingId: {
        type: DataTypes.UUID,
        allNull: false
      },
      userId: {
        type: DataTypes.UUID,
        allNull: false
      }
    },
    {
      tableName: "followers"
    }
  );
  Follower.associate = function(models) {
    // associations can be defined here
    Follower.belongsTo(models.User);
    Follower.belongsTo(models.User, {
      as: "followers",
      foreignId: "followingId"
    });
  };
  return Follower;
};
