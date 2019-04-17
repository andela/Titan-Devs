import dotenv from "dotenv";
import passport from "passport";
import twitterStrategy from "passport-twitter";
import googleStrategy from "passport-google-oauth";
import facebookStrategy from "passport-facebook";

dotenv.config();

const TwitterStrategy = twitterStrategy.Strategy;
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_HOST}/auth/twitter/callback`,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => done(null, profile)
  )
);
const GoogleStrategy = googleStrategy.OAuth2Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.FRONT_END_SERVER_HOST}/auth/google/callback`,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

const FacebookStrategy = facebookStrategy.Strategy;
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_HOST}/auth/facebook/callback`,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => done(null, profile)
  )
);
