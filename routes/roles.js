import { Router } from "express";
import Roles from "../controllers/roleController";
import validator from "../middlewares/modelValidator";

const role = Router();

role.post("/roles", Roles.create);
role.get("/roles/:roleId", Roles.getOneRole);
role.put("/roles/:roleId", validator.checkRole, Roles.updateRole);
role.delete("/roles/:roleId", validator.checkRole, Roles.deleteRole);
role.get("/roles", Roles.getAll);
role.post(
  "/roles/:roleId/user/:userId",
  validator.checkUser,
  validator.checkRole,
  Roles.assignRole
);

role.delete("/roles/:id/remove", Roles.removeRole);
role.get("/roles/:roleId/permissions", Roles.getRolePermissions);

export default role;
