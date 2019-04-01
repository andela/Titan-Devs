"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("users", "facebookId"),
      queryInterface.removeColumn("users", "googleId"),
      queryInterface.removeColumn("users", "twitterId"),
      queryInterface.addColumn("users", "socialId", {
        type: Sequelize.STRING(500),
        defaultValue: null
      }),
      queryInterface.removeColumn("users", "password"),
      queryInterface.addColumn("users", "password", {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "twitterId", {
        type: Sequelize.STRING(500),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "facebookId", {
        type: Sequelize.STRING(100),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "googleId", {
        type: Sequelize.STRING(100),
        defaultValue: null
      }),
      queryInterface.removeColumn("users", "socialId"),
      queryInterface.removeColumn("users", "password"),
      queryInterface.addColumn("users", "password", {
        type: Sequelize.STRING,
        allowNull: false
      })
    ]);
  }
};
