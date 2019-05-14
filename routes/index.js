import { Router } from "express";
import userRouters from "./users";
import profileRouter from "./profile";
import articleRoutes from "./articles";
import authRouters from "./auth";
import commentRoutes from "./comments";
import ratingRouters from "./ratings";
import highlightRouters from "./highlight";
import roleRoutes from "./roles";
import permissionRoutes from "./permissions";

const router = Router();

router.use(userRouters);
router.use(authRouters);
router.use(profileRouter);
router.use(articleRoutes);
router.use(commentRoutes);
router.use(ratingRouters);
router.use(highlightRouters);
router.use(roleRoutes);
router.use(permissionRoutes);
export default router;
