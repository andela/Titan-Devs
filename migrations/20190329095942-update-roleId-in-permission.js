"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("permissions", "roleId"),
      queryInterface.addColumn("permissions", "roleId", {
        type: Sequelize.UUID,
        onDelete: "SET NULL",
        references: {
          model: "roles",
          key: "id",
          as: "roleId"
        }
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("permissions", "roleId");
  }
};
