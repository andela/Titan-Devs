import { Router } from "express";
import userRouters from "../routes/users";

const router = Router();

router.use(userRouters);

export default router;
