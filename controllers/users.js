import models from "../models";

const { User } = models;

class UserController {
  static findOne(req, res) {
    const { userId } = req.params;
    User.findOne({ where: { id: userId } })
      .then(result => {
        if (result) {
          res.status(200).json({
            message: "User retrieved successfully",
            user: result.dataValues
          });
        } else {
          res.status(404).json({
            message: "User not found "
          });
        }
      })
      .catch(error => {
        res
          .status(500)
          .json({ message: "An error occur please Try again later", error });
      });
  }
}

export default UserController;
