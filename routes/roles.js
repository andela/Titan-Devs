import { Router } from "express";
import Role from "../controllers/roleController";

const role = Router();

role.post("/role", Role.create);
role.put("/role/:roleId/user/:userId", Role.createUserRole);
role.get("/role/:roleId", Role.getOneRole);
export default role;
