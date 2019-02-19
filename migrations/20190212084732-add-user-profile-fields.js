"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "firstname", {
        type: Sequelize.STRING(500)
      }),
      queryInterface.addColumn("users", "lastname", {
        type: Sequelize.STRING(100),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "gender", {
        type: Sequelize.STRING(100),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "following", {
        type: Sequelize.STRING(100),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "phone", {
        type: Sequelize.STRING(100),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "address", {
        type: Sequelize.STRING(100),
        defaultValue: null
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("users", "firstname"),
      queryInterface.removeColumn("users", "lastname"),
      queryInterface.removeColumn("users", "gender"),
      queryInterface.removeColumn("users", "following"),
      queryInterface.removeColumn("users", "phone"),
      queryInterface.removeColumn("users", "address")
    ]);
  }
};
