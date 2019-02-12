import jwt from "jsonwebtoken";
/** Define the function for checking the token and decoding it
 * @params request, response, next
 */

const checkAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: "Access token is required" });
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token) {
    let decodedToken = jwt.decode(token);
    req.headers.username = decodedToken.username;
    return next();
  }
  res.status(401).json({ message: "Unauthorized route" });
};

export default checkAuth;
