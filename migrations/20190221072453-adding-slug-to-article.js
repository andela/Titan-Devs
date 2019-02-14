"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("articles", "slug", {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "aGivenslug"
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("articles", "slug")]);
  }
};
