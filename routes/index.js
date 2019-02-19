import { Router } from "express";
import userRouters from "./users";
import profileRouter from "./profile";

import articleRoutes from "./articles";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(userRouters);
router.use(profileRouter);

router.use(checkAuth, articleRoutes);

export default router;
