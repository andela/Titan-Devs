'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("permissions", ["resource", "roleId"], {
      type: "unique",
      name: "rolesId_resources_unique_composite_key"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("permissions", "rolesId_resources_unique_composite_key");
  }
};
