import dotenv from "dotenv";
import passport from "passport";
import googleStrategy from "passport-google-oauth";
import createUserFromSocial from "./createUserFromSocial";

dotenv.config();

const GoogleStrategy = googleStrategy.OAuth2Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_HOST}/auth/google/callback`,
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
