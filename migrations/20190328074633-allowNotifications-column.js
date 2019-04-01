"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "allowNotifications", {
        type: Sequelize.BOOLEAN,
        onDelete: "CASCADE",
        defaultValue: "true"
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("users", "allowNotifications")]);
  }
};
