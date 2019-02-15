import constants from "../helpers/constants";
import jwt from "jsonwebtoken";

const { INTERNAL_SERVER_ERROR, UNAUTHORIZED } = constants.statusCode;
/**
 * @description - The middleware to check for authentication. It checks on every
 * protected endpoint whether the token sent is valid and if so, it passes control
 * to the next handler in the request processing pipeline.
 * @param  {object} req - The request object
 * @param  {object} res - The response object
 * @param  {function} next - The next handler function in the request pipeline
 */
export default (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer")
      return res.status(INTERNAL_SERVER_ERROR).json({ message: "Access denied" });
    req.user = jwt.verify(token, process.env.SECRET_OR_KEY);
    next();
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: "Access denied" });
  }
};
