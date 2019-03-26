"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("highlights", "commentId", {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "comments",
          key: "id",
          as: "commentId"
        }
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("highlights", "commentId")]);
  }
};
