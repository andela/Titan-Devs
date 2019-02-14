import { Router } from "express";
import passportGoogle from "../controllers/auth/socials/google";
import passportFacebook from "../controllers/auth/socials/facebook";
import passportTwitter from "../controllers/auth/socials/twitter";

const authRouters = Router();

authRouters.get("/auth/google", (request, response, next) => {
  passportGoogle.authenticate("google", { scope: ["email"] })(
    request,
    response,
    next
  );
});

authRouters.get(
  "/auth/google/callback",
  passportGoogle.authenticate("google", {
    failureRedirect: "/login",
    session: false
  }),
  (req, res) => {
    res.redirect(`/api/v1/profiles/${req.user.username}`);
  }
);

authRouters.get(
  "/auth/facebook",
  passportFacebook.authenticate("facebook", {
    scope: ["email"]
  })
);
authRouters.get(
  "/auth/facebook/callback",
  passportFacebook.authenticate("facebook", {
    failureRedirect: "/login",
    session: false
  }),
  (req, res) => {
    res.redirect(`/api/v1/profiles/${req.user.username}`);
  }
);

authRouters.get("/auth/twitter", passportTwitter.authenticate("twitter"));
authRouters.get(
  "/auth/twitter/callback",
  passportTwitter.authenticate("twitter", {
    failureRedirect: "/login",
    session: false
  }),
  (req, res) => {
    res.redirect(`/api/v1/profiles/${req.user.username}`);
  }
);

export default authRouters;
