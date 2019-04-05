"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
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
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return Promise.all([
      queryInterface.removeColumn("users", "facebookId"),
      queryInterface.removeColumn("users", "googleId"),
      queryInterface.removeColumn("users", "twitterId")
    ]);
  }
};
