"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
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
