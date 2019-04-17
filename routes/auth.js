import { Router } from "express";
import passport from "passport";
import socialAuthController from "../controllers/auth/socials/socialAuthController";

const authRouters = Router();

authRouters.get("/auth/google", (request, response, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    request,
    response,
    next
  );
});

authRouters.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false
  }),
  (req, res) => {
    socialAuthController.socialLogin(req, res);
  }
);

authRouters.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"]
  })
);
authRouters.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false
  }),
  (req, res) => {
    socialAuthController.socialLogin(req, res);
  }
);

authRouters.get("/auth/twitter", passport.authenticate("twitter"));
authRouters.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
    session: false
  }),
  (req, res) => {
    socialAuthController.socialLogin(req, res);
  }
);

export default authRouters;
