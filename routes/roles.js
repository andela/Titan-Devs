import { Router } from "express";
import Roles from "../controllers/roleController";
import validator from "../middlewares/modelValidator";
import errorHandler from "../helpers/errorHandlers";

const role = Router();

role.post("/roles", Roles.create);
role.get("/roles/:roleId", errorHandler(Roles.getOneRole));
role.put("/roles/:roleId", validator.checkRole, Roles.updateRole);
role.delete("/roles/:roleId", validator.checkRole, Roles.deleteRole);
role.get("/roles", Roles.getAll);
role.get(
  "/roles/:roleId/permissions",
  validator.checkRole,
  Roles.getRolePermissions
);

export default role;
