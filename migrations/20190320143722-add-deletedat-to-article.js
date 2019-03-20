module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn("articles", "deletedAt", { type: Sequelize.DATE })
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([queryInterface.removeColumn("articles", "deletedAt")])
};
