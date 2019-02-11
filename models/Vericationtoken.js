'use strict';
module.exports = (sequelize, DataTypes) => {
  const VericationToken = sequelize.define('VericationToken', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    token: {
      allowNull: false,
      type :DataTypes.STRING
    },
    
  }, {tableName: "verificationToken"});
  VericationToken.associate = function(models) {
    // associations can be defined here
    VericationToken.belongsTo(models.User);
  };
  return VericationToken;
};