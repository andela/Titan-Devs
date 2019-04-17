import models from "../models";
import constants from "../helpers/constants";

const { Notification, User } = models;

const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = constants.statusCode;
/**
 *@class Notification controller
 */

class NotificationController {
  /**
   * @description It allows a user to fetch a specific notification.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async fetchOne(req, res) {
    try {
      const userId = req.params.id;
      let { notificationId } = req.params;
      const user = await User.findOne({
        where: { id: userId },
        include: {
          model: Notification,
          as: "notifications",
          attributes: ["message", "ref", "status", "id"],
          where: { id: notificationId }
        },
        attributes: ["username", "firstName", "lastName"]
      });
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "Not found" });
      }
      notificationId = user.dataValues.notifications[0].dataValues.id;
      if (notificationId) {
        await Notification.update(
          { status: "read" },
          {
            where: { id: notificationId },
            returning: true
          }
        );
      } else {
        return res.status(NOT_FOUND).json({ message: "Not found" });
      }

      res.status(OK).json({ user });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description It allows a user to fetch his notifications.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async fetchAll(req, res) {
    try {
      const { id: userId } = req.params;
      const { page } = req.query;
      const user = await User.findOne({
        where: { id: userId },
        attributes: ["username", "firstName", "lastName"],
        include: [
          {
            model: Notification,
            as: "notifications",
            attributes: ["message", "ref", "userId", "id", "createdAt", "status"],
            order: [["createdAt", "DESC"]],
            offset: page
          }
        ]
      });

      if (!user) {
        return res.status(NOT_FOUND).json({ message: "Not found" });
      }

      res.status(OK).json({ user });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description It allows a user to delete a specific notification.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async delete(req, res) {
    try {
      const { notificationId } = req.params;

      const deletedNotification = await Notification.destroy({
        where: { id: notificationId },
        returning: true
      });
      if (!deletedNotification) {
        return res.status(NOT_FOUND).json({ message: "Not found" });
      }
      res.status(OK).json({ notification: deletedNotification });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR);
    }
  }
}

export default NotificationController;
