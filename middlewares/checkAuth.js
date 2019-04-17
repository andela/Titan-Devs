import passport from "passport";
import constants from "../helpers/constants";
import models from "../models";

const { Permission } = models;
const { UNAUTHORIZED, FORBIDDEN } = constants.statusCode;
export default (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    const { originalUrl } = req;
    const [, , , resource] = originalUrl.split("/");
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        message:
          "We are sorry but we are not able to authenticate you.You have to login to perform this action."
      });
    }

    const { roleId } = user;
    const permissionsList = await Permission.findAll({
      where: { roleId },
      raw: true
    });
    req.user = user.dataValues;
    let allow = false;
    permissionsList.map(perms => {
      if (perms.resource === resource) {
        if (req.method === "POST" && perms.createPermission) allow = true;
        else if (req.method === "GET" && perms.readPermission) allow = true;
        else if (req.method === "PUT" && perms.updatePermission) allow = true;
        else if (req.method === "DELETE" && perms.deletePermission) allow = true;
      }
      return allow;
    });
    if (originalUrl === "/api/v1/users/current" && req.method === "GET") {
      allow = true;
    }
    if (allow) next();
    else return res.status(FORBIDDEN).send({ message: "Access not Granted" });
  })(req, res, next);
};
