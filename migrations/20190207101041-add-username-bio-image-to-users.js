"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "bio", {
        type: Sequelize.STRING(500)
      }),
      queryInterface.addColumn("users", "image", {
        type: Sequelize.STRING(100),
        defaultValue: null
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("users", "image"),
      queryInterface.removeColumn("users", "bio")
    ]);
  }
};
