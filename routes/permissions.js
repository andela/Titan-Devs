import { Router } from "express";
import Permission from "../controllers/permissionController";

const permission = Router();

permission.post("/permission", Permission.create);
permission.put("/permission/:permissionId/role/:roleId", Permission.createRolePermission);
permission.get("/permission/:permissionId", Permission.getOnePermission);

export default permission;
