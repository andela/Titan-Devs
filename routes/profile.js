import Router from "express";
import checkAuth from "../middlewares/checkAuth";
import Profile from "../controllers/profileController";
const profileRouter = Router();

profileRouter
  .put("/profiles/:username", checkAuth, Profile.update)
  .get("/profiles/:username", Profile.getProfile)
  .get("/profiles", Profile.getAllProfiles)
  .delete("/profiles/:username", checkAuth, Profile.delete);

export default profileRouter;
