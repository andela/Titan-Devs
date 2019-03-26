import passport from "passport";
import constants from "../helpers/constants";

const { UNAUTHORIZED } = constants.statusCode;
export default (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        message:
          "We are sorry but we are not able to authenticate you.You have to login to perform this action."
      });
    }
    req.user = user.dataValues;
    next();
  })(req, res, next);
};
