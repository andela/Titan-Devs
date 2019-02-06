import { Router } from "express";
import userRouters from "./users";
import authRouters from "./auth";

const router = Router();

router.use(userRouters, authRouters);

export default router;
