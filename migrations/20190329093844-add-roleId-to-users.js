"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "roleId", {
      type: Sequelize.UUID,
      onDelete: "SET NULL",
      references: {
        model: "roles",
        key: "id",
        as: "roleId"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "roleId");
  }
};
