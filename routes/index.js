import { Router } from "express";
import userRouters from "./users";
import profileRouter from "./profile";
import articleRoutes from "./articles";

import commentRoutes from "./comments";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(userRouters);
router.use(profileRouter);

router.use(checkAuth, commentRoutes, articleRoutes);

export default router;
