import { Router } from "express";
import userRouters from "./users";
import profileRouter from "./profile";

import articleRoutes from "./articles";
import checkAuth from "../middlewares/checkAuth";
const router = Router();

// PUBLIC ROUTES
router.use(userRouters);
router.use(profileRouter);
// PRIVATE(PROTECTED) ROUTES
router.use(checkAuth, articleRoutes);

export default router;
