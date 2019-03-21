import { Router } from "express";
import userRouters from "./users";
import profileRouter from "./profile";
import articleRoutes from "./articles";

import commentRoutes from "./comments";
import checkAuth from "../middlewares/checkAuth";
import ratingRouters from "./ratings";

const router = Router();

router.use(userRouters);
router.use(profileRouter);
router.use(articleRoutes);
router.use(checkAuth, ratingRouters);
router.use(commentRoutes);

export default router;
