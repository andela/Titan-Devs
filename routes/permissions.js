import { Router } from "express";
import Permission from "../controllers/permissionController";
import validator from "../middlewares/modelValidator";

const permission = Router();

permission.post("/permissions/:roleId", validator.checkRole, Permission.create);
permission.put(
  "/permissions/:permissionId",
  validator.checkPermission,
  Permission.updatePermission
);
permission.get("/permissions", Permission.getAll);
permission.get(
  "/permissions/:permissionId",
  validator.checkPermission,
  Permission.getOnePermission
);
permission.delete(
  "/permissions/:permissionId",
  validator.checkPermission,
  Permission.deletePermission
);
permission.post(
  "/permissions/:permissionId/role/:roleId",
  validator.checkPermission,
  validator.checkRole,
  Permission.grantPermission
);
permission.delete("/permissions/:id/revoke", Permission.revokePermission);

export default permission;
