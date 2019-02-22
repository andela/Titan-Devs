"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("comments", "like", {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("comments", "like")]);
  }
};
