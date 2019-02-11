import Router from "express";
import Profile from "../controllers/profileController";
const profileRouter = Router();

profileRouter
  .post("/profiles", Profile.create)
  .put("/profiles/:username", Profile.update)
  .get("/profiles/:username", Profile.getProfile)
  .delete("/profiles/:username", Profile.delete);

export default profileRouter;
