"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.addColumn("users", "firstName", {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn("users", "lastName", {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn("users", "roleId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
