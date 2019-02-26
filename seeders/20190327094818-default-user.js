const { hashSync, genSaltSync } = require("bcrypt");
const dotenv = require("dotenv");
const moment = require("moment");

dotenv.config();
const createdAt = moment().format();
const updatedAt = createdAt;
const salt = genSaltSync(parseFloat(process.env.BCRYPT_HASH_ROUNDS) || 10);
const password = hashSync("123456HA", salt);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          id: "cc4fb5cc-ef54-4f9e-b816-863354a269bb",
          email: "admin@email.com",
          username: "username",
          roleId: "7070f1f4-2686-4e62-84eb-3398be2ef544",
          password,
          createdAt,
          updatedAt
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  }
};
