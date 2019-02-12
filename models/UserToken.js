"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define(
    "UserToken",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      passwordResetToken: {
        type: Sequelize.TEXT
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      passwordUpdateAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      tableName: "userTokens"
    }
  );
  UserToken.associate = function(models) {
    // associations can be defined here
  };
  return UserToken;
};
