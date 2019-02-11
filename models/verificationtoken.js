"use strict";
module.exports = (sequelize, DataTypes) => {
  const VerificationToken = sequelize.define(
    "verificationToken",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      token: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    { tableName: "verificationTokens" }
  );

  VerificationToken.associate = function(models) {
    // associations can be defined here
    VerificationToken.belongsTo(models.User, {
      foreignKey: 'UserId',
    });
  };
  return VerificationToken;
};
