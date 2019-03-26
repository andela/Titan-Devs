"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("highlights", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      startIndex: {
        type: Sequelize.INTEGER
      },
      endIndex: {
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id",
          as: "userId"
        }
      },
      articleId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "articles",
          key: "id",
          as: "articleId"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("highlights");
  }
};
