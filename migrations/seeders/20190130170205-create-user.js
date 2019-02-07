"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          id: "dfe7fbc2-289d-11e9-b210-d663bd873d97",
          email: "test@ah.com",
          password: "password",
          username: "luc",
          firstName: "User",
          lastName: "hellower89",
          createdAt: "2019-02-04T14:17:44.366Z",
          updatedAt: "2019-02-04T14:17:44.366Z"
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  }
};
