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
        message: "Please provide a token to perform this action"
      });
    }
    const { roleId } = user;
    const permissionsList = await Permission.findAll({
      where: { roleId },
      raw: true
    });
    req.user = user.dataValues;
    let allow = false;
    permissionsList.forEach(function(perms) {
      if (perms.resource === resource) {
        if (req.method == "POST" && perms.create_) allow = true;
        else if (req.method == "GET" && perms.read_) allow = true;
        else if (req.method == "PUT" && perms.update_) allow = true;
        else if (req.method == "DELETE" && perms.delete_) allow = true;
      }
    });
    if (allow) next();
    else res.status(FORBIDDEN).send({ message: "access denied" });
  })(req, res, next);
};
