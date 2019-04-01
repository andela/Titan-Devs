import models from "../models";

const { Role, Permission } = models;

const defaultRole = {
  name: "reader",
  description: "authenticated user who came to visit our platform"
};
const defaultPermissions = [
  {
    resource: "articles",
    createPermission: true,
    readPermission: true,
    updatePermission: true,
    deletePermission: true
  },
  {
    resource: "users",
    createPermission: true,
    readPermission: true,
    updatePermission: true,
    deletePermission: false
  },
  {
    resource: "profiles",
    createPermission: true,
    readPermission: true,
    updatePermission: true,
    deletePermission: false
  },
  {
    resource: "auth",
    createPermission: true,
    readPermission: true,
    updatePermission: true,
    deletePermission: false
  }
];
export default () =>
  Role.findOrCreate({ where: defaultRole }).spread(async (role, isCreated) => {
    if (isCreated) {
      await defaultPermissions.map(async p => {
        const perm = await Permission.findOrCreate({
          where: { ...p, roleId: role.id }
        });
        return perm;
      });
    }
    return role;
  });
