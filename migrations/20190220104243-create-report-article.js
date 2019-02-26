module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("reportArticles", {
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
      })
      .then(() => {
        queryInterface.addConstraint("reportArticles", ["userId", "articleId"], {
          type: "unique",
          name: "articleId_userId_unique_composite_key"
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("reportArticles");
  }
};
