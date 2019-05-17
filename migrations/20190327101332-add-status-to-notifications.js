module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("notifications", "status", {
        type: Sequelize.ENUM("unread", "read"),
        onDelete: "CASCADE",
        defaultValue: "unread"
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("notifications", "status")]);
  }
};
