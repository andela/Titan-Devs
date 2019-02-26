const moment = require("moment");

const createdAt = moment().format();
const updatedAt = createdAt;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "roles",
      [
        {
          id: "7070f1f4-2686-4e62-84eb-3398be2ef544",
          name: "reader",
          description: "Reader",
          createdAt,
          updatedAt
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  }
};
