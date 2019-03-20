import { Router } from "express";
import userRouters from "./users";
import profileRouter from "./profile";
import articleRoutes from "./articles";
import commentRoutes from "./comments";
import checkAuth from "../middlewares/checkAuth";
import ratingRouters from "./ratings";
import roleRouters from "./roles";
import permissionRouters from "./permissions";

const router = Router();

router.use(userRouters);
router.use(profileRouter);
router.use(checkAuth, commentRoutes);
router.use(articleRoutes);
router.use(checkAuth, articleRoutes);
router.use(checkAuth, ratingRouters);
router.use(checkAuth, roleRouters);
router.use(checkAuth, permissionRouters);
export default router;
