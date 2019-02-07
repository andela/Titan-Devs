import models from "../models";

const { User } = models;

class UserController {
  /**
   * Fetch a single user's information.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} The request response
   */
  static findOne(req, res) {
    const { userId } = req.params;
    User.findOne({ where: { id: userId } })
      .then(result => {
        if (result) {
          return res.status(200).json({
            message: "User retrieved successfully",
            user: result.dataValues
          });
        }
        return res.status(404).json({
          message: "User not found "
        });
      })
      .catch(error => {
        res
          .status(500)
          .json({ message: "An error occur please Try again later", error });
      });
  }
}

export default UserController;
