import Router from "express";
import passport from "passport";
import Profile from "../controllers/profileController";
import FollowerController from "../controllers/followerController";
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
  )
  .post(
    "/profiles/:username/follow",
    passport.authenticate("jwt", { session: false }),
    FollowerController.followUser
  )
  .delete(
    "/profiles/:username/follow",
    passport.authenticate("jwt", { session: false }),
    FollowerController.unFollow
  )
  .get(
    "/profiles/:username/followers",
    passport.authenticate("jwt", { session: false }),
    FollowerController.getAllFollowers
  )
  .get(
    "/profiles/:username/followings",
    passport.authenticate("jwt", { session: false }),
    FollowerController.getFollowings
  );

export default profileRouter;
