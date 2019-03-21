module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("articleTags", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      tagId: {
        type: Sequelize.UUID,
        references: { model: "tags", key: "id" }
      },
      articleId: {
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
    return queryInterface.dropTable("articleTags");
  }
};
