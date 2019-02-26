"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("ratings", ["userId", "articleId"], {
      type: "unique",
      name: "userId_articleId_constraint"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("ratings", "userId_articleId_constraint");
  }
};
