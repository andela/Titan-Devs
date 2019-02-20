import passportJwt from "passport-jwt";
import models from "../models";

const JwtStrategy = passportJwt.Strategy;
const { ExtractJwt } = passportJwt;

const { User } = models;
export default passport => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_KEY
      },
      (jwtPayload, done) => {
        User.findOne({
          where: {
            id: jwtPayload.id
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
