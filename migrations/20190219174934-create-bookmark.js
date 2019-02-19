module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("bookmarks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" }
      },
      articleId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: "articles", key: "id" }
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
    return queryInterface.dropTable("bookmarks");
  }
};
