import models from "../models";
import constants from "../helpers/constants";
import { isString, isEmpty } from "../helpers/funcValidators";

const {
  OK,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  BAD_REQUEST,
  CREATED
} = constants.statusCode;
const { Permission } = models;
class PermissionController {
  static async grantPermission(req, res) {
    try {
      const {
        resource,
        createPermission,
        readPermission,
        updatePermission,
        deletePermission
      } = req.body;
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
        roleId,
        createPermission,
        readPermission,
        updatePermission,
        deletePermission
      });
      return res.status(CREATED).json({
        message: "Permission granted",
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
      const { permissionId } = req.params;
      await Permission.destroy({
        where: {
          id: permissionId
        }
      });
      return res.status(OK).json({
        message: "Permission revoked"
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
      const {
        resource,
        createPermission,
        readPermission,
        updatePermission,
        deletePermission
      } = req.body;
      if (!resource) {
        return res.status(BAD_REQUEST).json({
          message: "Resource is required"
        });
      }
      const permission = await Permission.update(
        {
          resource,
          createPermission,
          readPermission,
          updatePermission,
          deletePermission
        },
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
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
}
export default PermissionController;
