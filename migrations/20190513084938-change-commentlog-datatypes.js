

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
    queryInterface.changeColumn("commentlogs",  "newVersion", {
      type: Sequelize.TEXT
    }),
    queryInterface.changeColumn("commentlogs", "oldVersion", {
      type: Sequelize.TEXT
    })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("commentlogs",  "newVersion", {
        type: Sequelize.STRING
      }),
      queryInterface.changeColumn("commentlogs", "oldVersion", {
        type: Sequelize.STRING
      })
      ]);
  }
};
