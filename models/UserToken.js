export default (sequelize, DataTypes) => {
  const UserToken = sequelize.define(
    "UserToken",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      passwordResetToken: {
        type: DataTypes.TEXT
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      passwordUpdateAt: {
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
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
