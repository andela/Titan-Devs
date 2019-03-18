'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rolePermissions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      permissionId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: "permissions", key: "id" }
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rolePermissions');
  }
};