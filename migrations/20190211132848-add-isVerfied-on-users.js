'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
<<<<<<< HEAD
      Add altering commands here
=======
      Add altering commands here.
>>>>>>> 05f7424ce44169d70ffc72d42eed94d635bfd2de
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return Promise.all([
    queryInterface.addColumn(
      "users", 
      "isVerified", 
      Sequelize.BOOLEAN,
    ),
  ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface.removeColumn(
    'users',
    'isVerified'
  );
  }
};
