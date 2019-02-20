module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("report_articles", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: "users", key: "id" }
      },
      articleId: {
        type: Sequelize.UUID,
        references: { model: "articles", key: "id" }
      },
      description: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable("ReportArticles");
  }
};
