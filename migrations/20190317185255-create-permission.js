module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("permissions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      resource: {
        type: Sequelize.STRING,
        unique: true
      },
      create_: {
        type: Sequelize.BOOLEAN
      },
      read_: {
        type: Sequelize.BOOLEAN
      },
      update_: {
        type: Sequelize.BOOLEAN
      },
      delete_: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      roleId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: { model: "roles", key: "id" }
      }
    }).then(() => {
      queryInterface.addConstraint("permissions", ["resource", "roleId",], {
        type: "unique",
        name: "rolesId_resources_unique_composite_key"
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("permissions");
  }
};
