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
const { Role, RolePermissions, Permission } = models;
class RoleController {
  static async create(req, res) {
    try {
      const { name, description } = req.body;
      if (isEmpty(name)) {
        return res.status(BAD_REQUEST).json({
          message: `Name is required`
        });
      }
      if (!isString(name) || !isString(description)) {
        return res.status(BAD_REQUEST).json({
          message: `{${name}} and {${description}} can only be alphabetic characters`
        });
      }
      const role = await Role.create({
        name: name.toUpperCase(),
        description
      });
      return res.status(CREATED).json({
        message: "Role created",
        role
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(CONFLICT).json({
          message: "Role already exist"
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }


  static async getOneRole(req, res) {
    try {
      const { roleId } = req.params;
      const role = await Role.findOne({
        where: { id: roleId }
      });
      if (!role) {
        res.status(NOT_FOUND).json({
          message: "Role not found"
        });
      }
      return res.status(OK).json({
        role
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async getAll(req, res) {
    const roles = await Role.findAll();
    return res.status(OK).json({
      roles
    });
  }

  static async getRolePermissions(req, res) {
    try {
      const { roleId } = req.params;
      const rolePermissions = await RolePermissions.findOne({
        where: { roleId }
      });
      if (!rolePermissions) {
        return res.status(NOT_FOUND).json({
          message: "Role not found"
        });
      }
      const rolePermissionResponse = await RolePermissions.findAll({
        where: { roleId },
        attributes: ["roleId"],
        include: [{ model: Permission }]
      });
      return res.status(OK).json({
        data: rolePermissionResponse
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async updateRole(req, res) {
    try {
      const { roleId } = req.params;
      const { name, description } = req.body;
      if (!name) {
        return res.status(BAD_REQUEST).json({
          message: "Name is required"
        });
      }
      if (!isString(name) || !isString(description)) {
        return res.status(BAD_REQUEST).json({
          message: `{${name}} and {${description}} can only be alphabetic characters`
        });
      }
      const role = await Role.update(
        { name: name.toUpperCase(), description },
        { returning: true, where: { id: roleId } }
      );
      return res.status(OK).json({
        message: "Role updated successfully",
        role: role[1][0]
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async deleteRole(req, res) {
    try {
      const { roleId } = req.params;
      await Role.destroy({
        where: { roleId },
        truncate: true,
        cascade: true
      });
      return res.status(OK).json({
        message: "successfully deleted the role"
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
}
export default RoleController;
