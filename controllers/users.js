import models from "../models";

const { User } = models;

class UserController {
  static findOne(req, res, next) {
    const userId = req.params.userId;
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
        console.log(error);
        res
          .status(500)
          .json({ message: "An error occur please Try again later" });
      });
  }
}

export default UserController;
