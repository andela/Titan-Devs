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
      queryInterface.addColumn("users", "firstname", {
<<<<<<< HEAD
        type: Sequelize.STRING(500),
        defaultValue: null
=======
        type: Sequelize.STRING(500)
>>>>>>> 500522295e008cd74b6cb73621031258d7f0fe6c
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
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
