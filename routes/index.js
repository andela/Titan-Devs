import { Router } from "express";
import userRouters from "./users";

const router = Router();

router.use(userRouters);

export default router;
