module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("permissions", {
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
        createPermission: {
          type: Sequelize.BOOLEAN
        },
        readPermission: {
          type: Sequelize.BOOLEAN
        },
        updatePermission: {
          type: Sequelize.BOOLEAN
        },
        deletePermission: {
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
          type: Sequelize.UUID
        }
      })
      .then(() => {
        queryInterface.addConstraint("permissions", ["resource", "roleId"], {
          type: "unique",
          name: "rolesId_resources_unique_composite_key"
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("permissions");
  }
};
