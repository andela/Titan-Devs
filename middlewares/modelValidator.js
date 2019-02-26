import models from "../models";
import constants from "../helpers/constants";

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = constants.statusCode;
const { User, Article, Role, Permission } = models;

export default class ModelValidator {
  static async validateArticle(req, res, next) {
    const article = await Article.findOne({
      where: { slug: req.params.slug }
    });
    req.article = article;
    return article
      ? next()
      : res.status(NOT_FOUND).json({ message: "Article was not found" });
  }

  static async checkUser(req, res, next) {
    try {
      const user = await User.findOne({
        where: { username: req.params.username }
      });
      req.user = user;
      return user
        ? next()
        : res.status(NOT_FOUND).json({ message: "User was not found" });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async checkRole(req, res, next) {
    try {
      const { roleId } = req.params;
      const role = await Role.findOne({
        where: { id: roleId }
      });
      req.role = role;
      return role
        ? next()
        : res.status(NOT_FOUND).json({ message: "Role was not found" });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  static async checkPermission(req, res, next) {
    try {
      const { permissionId } = req.params;
      const permission = await Permission.findOne({
        where: { id: permissionId }
      });
      req.permission = permission;
      return permission
        ? next()
        : res.status(NOT_FOUND).json({ message: "Permission was not found" });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
}
