export default (sequelize, DataTypes) => {
  const user = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      bio: {
        type: DataTypes.STRING(500)
      },
      image: {
        type: DataTypes.STRING(100),
        defaultValue: null
      },
      isVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      resetToken: {
        type: DataTypes.TEXT,
        defaultValue: null
      },
      isVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    // for postgres always set tables names in lower cases to avoid problems in the future
    { tableName: "users" }
  );

  // eslint-disable-next-line no-unused-vars
  user.associate = models => {
    // associations can be defined here
<<<<<<< HEAD
    user.hasOne(models.VerificationToken, {
<<<<<<< HEAD
      foreignKey: "userId"
=======
      foreignKey: 'userId',
      as: 'user',
>>>>>>> [ft #163518683] udpate user and delete token.
    });
=======
>>>>>>> [ft #163518683] remove verification table logic
  };
  return user;
};
