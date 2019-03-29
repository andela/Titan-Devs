const { hashSync, genSaltSync } = require("bcrypt");
const uuidv4 = require("uuid/v4");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await genSaltSync(parseFloat(process.env.BCRYPT_HASH_ROUNDS) || 10);
    const password = await hashSync("password", salt);
    return queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          firstname: "John",
          lastname: "Doe",
          bio: "I am a new user to this application",
          createdAt: new Date(),
          updatedAt: new Date(),
          email: "johnDoe@test.com",
          username: "johdoe",
          password
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", [
      {
        email: "johnDoe@test.com"
      }
    ]);
  }
};
