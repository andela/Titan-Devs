import joi from "joi";
import models from "../models";
import { ratingOne } from "../helpers/ratingValidation";
import constants from "../helpers/constants";

const { Rating, sequelize } = models;
const {
  NOT_FOUND,
  OK,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  CREATED
} = constants.statusCode;
class RatingController {
  /**
   * @description Create a rating for a blog post
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @param  {Object} res - The next middleware.
   * @return {Object} - It returns the response object.
   */

  static create(req, res, next) {
    const { slug } = req.params;
    const userId = req.user.id;
    const { rating } = req.body;
    const { article } = req;
    joi.validate({ rating }, ratingOne, (err, _value) => {
      if (err) {
        next(err);
      } else {
        Rating.create({ slug, userId, rating, articleId: article.id })
          .then(result => {
            /* eslint-disable no-underscore-dangle */
            if (result._options.isNewRecord) {
              res.status(CREATED).json({
                message: "Article rated successfully",
                rating: result.dataValues
              });
            }
          })
          .catch(error => {
            if (
              error.parent.code === "23505" &&
              error.name === "SequelizeUniqueConstraintError"
            ) {
              res.status(CONFLICT).json({ message: "Cannot rate an article twice" });
            } else {
              res.status(INTERNAL_SERVER_ERROR).json({
                message:
                  "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
              });
            }
          });
      }
    });
  }
  /**
   * @description Get all rating for a post
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @param  {Object} res - The next middleware.
   * @return {Object} - It returns the response object.
   */

static async getAll(req, res) {
    const { article } = req;

    try {
      const results = await Rating.findAll({
        raw: true,
        where: { articleId: article.id }
      });
      const averageRating = await Rating.findAll({
        attributes: [
          [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"]
        ],
        raw: true,
        where: { articleId: article.id }
      });
      res.status(OK).json({ ratings: results, averageRating: averageRating[0] });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: "Please Try again later" });
    }
  }

  /**
   * @description Update a rating for a given post
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @param  {Object} res - The next middleware.
   * @return {Object} - It returns the response object.
   */

  static update(req, res, next) {
    const userId = req.user.id;
    const { rating } = req.body;
    const { id: articleId } = req.article;
    joi.validate({ rating }, ratingOne, (err, _value) => {
      if (err) {
        next(err);
      } else {
        Rating.update({ rating }, { where: { articleId, userId } })
          .then(result => {
            if (result[0]) {
              res.status(OK).json({ message: "Article rating edited successfully" });
            } else {
              res
                .status(NOT_FOUND)
                .json({ message: "Rating  you are looking for cannot be found" });
            }
          })
          .catch(_error => {
            res.status(INTERNAL_SERVER_ERROR).json({
              message:
                "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
            });
          });
      }
    });
  }
}

export default RatingController;
