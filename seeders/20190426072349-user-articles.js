"use strict";
const faker = require("faker");
const articles = [];

for (let i = 0; i < 101; i++) {
  articles.push({
    id: faker.random.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(3),
    slug: faker.lorem.slug(),
    body: faker.lorem.paragraphs(4, "\n \r"),
    readTime: faker.random.number({ min: 1, max: 10 }),
    userId: "cc4fb5cc-ef54-4f9e-b816-863354a269bb",
    createdAt: new Date(faker.date.past()),
    updatedAt: new Date()
  });
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("articles", [...articles], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("articles", null, {});
  }
};
