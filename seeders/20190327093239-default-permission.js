const moment = require("moment");

const createdAt = moment().format();
const updatedAt = createdAt;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("permissions", [
      {
        id: "6a2929a4-568a-4014-8f98-45e8b18812bc",
        roleId: "7070f1f4-2686-4e62-84eb-3398be2ef544",
        resource: "articles",
        createPermission: true,
        readPermission: true,
        updatePermission: true,
        deletePermission: true,
        createdAt,
        updatedAt
      },
      {
        id: "8a531595-01fa-41d6-a4ae-a3b1ab27219c",
        roleId: "7070f1f4-2686-4e62-84eb-3398be2ef544",
        resource: "users",
        createPermission: true,
        readPermission: true,
        updatePermission: true,
        deletePermission: true,
        createdAt,
        updatedAt
      },
      {
        id: "43bd7efe-5544-4b27-a771-55db8f99cbee",
        roleId: "7070f1f4-2686-4e62-84eb-3398be2ef544",
        resource: "profiles",
        createPermission: true,
        readPermission: true,
        updatePermission: true,
        deletePermission: true,
        createdAt,
        updatedAt
      },
      {
        id: "fa9b8cb8-96e4-43c6-b339-d9dd5e13a11d",
        resource: "roles",
        createPermission: true,
        readPermission: true,
        updatePermission: true,
        deletePermission: true,
        createdAt,
        updatedAt
      },
      {
        id: "2e67704f-108e-4d4e-88b3-dcb40f96bb12",
        resource: "permissions",
        createPermission: true,
        readPermission: true,
        updatePermission: true,
        deletePermission: true,
        createdAt,
        updatedAt
      },
      {
        id: "7148f9e5-e802-439e-8579-f2fb67244642",
        roleId: "7070f1f4-2686-4e62-84eb-3398be2ef544",
        resource: "auth",
        createPermission: true,
        readPermission: true,
        updatePermission: true,
        deletePermission: true,
        createdAt,
        updatedAt
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("permissions", null, {});
  }
};
