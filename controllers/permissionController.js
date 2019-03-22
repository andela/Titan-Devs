import models from "../models";
import constants from "../helpers/constants";
import { isString, isEmpty } from "../helpers/funcValidators";

const {
  OK,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED
} = constants.statusCode;
const { Permission, RolePermissions } = models;
class PermissionController {
  static async create(req, res) {
    try {
      const { resource, create_, read_, update_, delete_ } = req.body;
      const { roleId } = req.params;
      if (isEmpty(resource)) {
        return res.status(BAD_REQUEST).json({
          message: `Resource is required`
        });
      }
      if (!isString(resource)) {
        return res.status(BAD_REQUEST).json({
          message: `{${resource}} can only be alphabetic characters`
        });
      }
      const permission = await Permission.create({
        resource,
        roleId
      });
      return res.status(CREATED).json({
        message: "Permission created",
        permission
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(CONFLICT).json({
          message: "Permission already exist"
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async grantPermission(req, res) {
    try {
      const { permissionId, roleId } = req.params;
      const rolePermissions = await RolePermissions.create({
        permissionId,
        roleId
      });
      return res.status(CREATED).json({
        message: "Permission assigned to Role successfully",
        data: rolePermissions
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(CONFLICT).json({
          message: "Permission already assigned to the Role"
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async getOnePermission(req, res) {
    try {
      const { permissionId } = req.params;
      const permission = await Permission.findOne({
        where: { id: permissionId }
      });
      return res.status(OK).json({
        permission
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async revokePermission(req, res) {
    try {
      const { id } = req.params;
      const rolePermission = await RolePermissions.findOne({
        where: {
          id
        }
      });
      if (!rolePermission) {
        return res.status(NOT_FOUND).json({
          message: "Permission was not found"
        });
      }
      await RolePermissions.destroy({
        where: { id }
      });
      return res.status(OK).json({
        message: "Permission has been revoked successfully"
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  // bug
  static async deletePermission(req, res) {
    try {
      const { permissionId } = req.params;
      await Permission.destroy({
        where: {
          id: permissionId
        },
        truncate: true,
        cascade: true
      });
      return res.status(OK).json({
        message: "successfully deleted the permission"
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async updatePermission(req, res) {
    try {
      const { permissionId } = req.params;
      const { resource, create, read } = req.body;
      if (!resource) {
        return res.status(BAD_REQUEST).json({
          message: "Resource is required"
        });
      }
      const permission = await Permission.update(
        { resource, create, read },
        { returning: true, where: { id: permissionId } }
      );

      return res.status(OK).json({
        message: "Permission updated successfully",
        permission: permission[1][0]
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async getAll(req, res) {
    try {
      const permission = await Permission.findAll();
      return res.status(OK).json({
        permission
      });
    } catch (error) {
      console.log(error, "++++++++++++++++");
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
}
export default PermissionController;
