import Router from "express";
import passport from "passport";
import Profile from "../controllers/profileController";
const profileRouter = Router();

profileRouter
  .put(
    "/profiles/:username",
    passport.authenticate("jwt", { session: false }),
    Profile.update
  )
  .get("/profiles/:username", Profile.getProfile)
  .get("/profiles", Profile.getAllProfiles)
  .delete(
    "/profiles/:username",
    passport.authenticate("jwt", { session: false }),
    Profile.delete
  );

export default profileRouter;
