import Router from "express";
import Profile from "../controllers/profilesController";
import FollowerController from "../controllers/followersController";
import checkAuth from "../middlewares/checkAuth";

const profileRouter = Router();

profileRouter
  .put("/profiles/:username", checkAuth, Profile.update)
  .get("/profiles/:username", Profile.getProfile)
  .get("/profiles", Profile.getAllProfiles)
  .delete("/profiles/:username", checkAuth, Profile.delete)
  .post(
    "/profiles/:username/follow",
    checkAuth,
    FollowerController.followUser,
    FollowerController.unFollow
  )
  .delete("/profiles/:username/follow", checkAuth, FollowerController.unFollow)
  .get(
    "/profiles/:username/followers",
    checkAuth,
    FollowerController.getAllFollowers
  )
  .get(
    "/profiles/:username/followings",
    checkAuth,
    FollowerController.getFollowings
  );

export default profileRouter;
