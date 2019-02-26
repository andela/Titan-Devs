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
const { Role, Permission, User } = models;
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
    const { roleId } = req.params;
    const role = await Role.findOne({
      where: { id: roleId }
    });
    if (!role) {
      return res.status(NOT_FOUND).json({
        message: "Role not found"
      });
    }
    return res.status(OK).json({
      role
    });
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
      const rolePermissionResponse = await Permission.findAll({
        where: { roleId },
        attributes: ["roleId"],
        include: [{ model: Role }]
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
      const deletedRole = await Role.destroy({
        where: { id: roleId }
      });
      if (deletedRole === 1) {
        await User.update({ roleId: null }, { where: { roleId } });
        await Permission.update({ roleId: null }, { where: { roleId } });
      }
      if (deletedRole === 0) {
        return res.status(OK).json({
          message: "Role was not deleted, try again"
        });
      }
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
