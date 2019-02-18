import passport from "passport";
import constants from "../helpers/constants";
const { UNAUTHORIZED } = constants.statusCode;
export default (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        message: "Please provide a token to perform this action"
      });
    }
    req.user = user.dataValues;
    next();
  })(req, res, next);
};
