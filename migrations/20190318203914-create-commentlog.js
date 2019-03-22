"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("commentlogs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      oldVersion: {
        type: Sequelize.STRING
      },
      newVersion: {
        type: Sequelize.STRING
      },
      commentId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: "comments", key: "id" }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("commentlogs");
  }
};
