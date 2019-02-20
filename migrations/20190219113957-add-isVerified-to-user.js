module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "isVerified", Sequelize.BOOLEAN)
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "isVerified");
  }
};
