"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("notifications", "status", {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        defaultValue: "unread"
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("notifications", "status")]);
  }
};
