import { Router } from "express";
import userRouters from "./users";
import profileRouter from "./profile";

const router = Router();

router.use(userRouters);
router.use(profileRouter);

export default router;
