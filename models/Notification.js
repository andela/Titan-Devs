module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      userId: DataTypes.UUID,
      message: DataTypes.STRING,
      ref: DataTypes.STRING,
      status: DataTypes.STRING
    },
    { tableName: "notifications" }
  );
  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      as: "notifications",
      foreignKey: "userId"
    });
  };
  return Notification;
};
