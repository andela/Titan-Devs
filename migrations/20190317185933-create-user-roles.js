module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("userRoles", {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        userId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: { model: "users", key: "id" }
        },
        roleId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: { model: "roles", key: "id" }
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() => {
        queryInterface.addConstraint("userRoles", ["userId", "roleId"], {
          type: "unique",
          name: "roleId_userId_unique_composite_key"
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("userRoles");
  }
};
