"use strict";
module.exports = (sequelize, DataTypes) => {
  const VerificationToken = sequelize.define(
    "VerificationToken",
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
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID
      }
    },
    { tableName: "verificationTokens" }
  );
  VerificationToken.associate = function(models) {
    // associations can be defined here
    VerificationToken.belongsTo(models.User,{
      foreignKey: 'userId',
    });
  };
  return VerificationToken;
};
