import models from "../models";
import passport_jwt from "passport-jwt";

const JwtStrategy = passport_jwt.Strategy;
const ExtractJwt = passport_jwt.ExtractJwt;

const { User } = models;
export default passport => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_OR_KEY
      },
      function(jwt_payload, done) {
        User.findOne({
          where: {
            id: jwt_payload.id
          }
        })
          .then(user => {
            if (user) {
              done(null, user);
            } else {
              done(null, false);
            }
          })
          .catch(err => {
            done(err, false);
          });
      }
    )
  );
};
