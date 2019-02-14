import dotenv from "dotenv";
import passport from "passport";
import facebookStrategy from "passport-facebook";
import createUserFromSocial from "./createUserFromSocial";

dotenv.config();

const FacebookStrategy = facebookStrategy.Strategy;
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_HOST}/auth/facebook/callback`,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const user = await createUserFromSocial(profile);
      return user
        ? done(null, user)
        : done(new Error("An error occurs , please try again later"));
    }
  )
);

export default passport;
