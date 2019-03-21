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
      async (jwtPayload, done) => {
        try {
          const user = await User.findOne({ where: { id: jwtPayload.id } });
          done(null, user || false);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
