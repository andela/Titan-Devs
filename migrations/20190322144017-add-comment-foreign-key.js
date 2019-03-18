"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("highlights", "comment"),
      queryInterface.addColumn("comments", "highlightId", {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "highlights",
          key: "id",
          as: "highlightId"
        }
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("highlights", "comment", {
        type: Sequelize.STRING
      }),
      queryInterface.removeColumn("comments", "highlightId")
    ]);
  }
};
