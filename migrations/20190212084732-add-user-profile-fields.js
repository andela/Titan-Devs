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
        type: Sequelize.STRING(500)
      }),
      queryInterface.addColumn("users", "lastname", {
        type: Sequelize.STRING(100),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "bio", {
        type: Sequelize.STRING(100),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "image", {
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
<<<<<<< HEAD
      queryInterface.addColumn("users", "bio"),
      queryInterface.addColumn("users", "image"),
=======
>>>>>>> 700e86c1524c7fec386eda01ed213a63ddca392d
      queryInterface.removeColumn("users", "following"),
      queryInterface.removeColumn("users", "phone"),
      queryInterface.removeColumn("users", "address")
    ]);
  }
};
