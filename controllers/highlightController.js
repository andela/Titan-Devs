import models from "../models";
import constants from "../helpers/constants";
import errorMessages from "../helpers/errorMessages";

const { Highlight, Comment } = models;
const { OK, INTERNAL_SERVER_ERROR, CREATED, NOT_FOUND } = constants.statusCode;
const { INTERNAL_SERVER_ERROR_MESSAGE } = errorMessages;

/**
 * @class HighlightController
 */
class HighlightController {
  /**
   * @description Highlight a given article
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @param  {Object} next - The next middleware.
   * @return {Object} - It returns the response object.
   */

  static async create(req, res) {
    const { slug } = req.params;
    const { start, end } = req.query;
    const { comment } = req.body;
    const { article, highlightedText } = req;
    const { id: userId } = req.user;
    try {
      let highlight;
      if (comment) {
        highlight = await Highlight.create(
          {
            slug,
            userId,
            highlightedText,
            startIndex: start,
            endIndex: end,
            articleId: article.id,
            comment: {
              body: comment,
              articleId: article.id,
              userId
            }
          },
          {
            include: [
              {
                model: Comment,
                as: "comment"
              }
            ]
          }
        );
      } else {
        highlight = await Highlight.create({
          slug,
          userId,
          highlightedText,
          startIndex: start,
          endIndex: end,
          articleId: article.id
        });
      }

      res.status(CREATED).json({
        message: "The article has successfully been highlighted",
        highlight: highlight.dataValues
      });
    } catch (error) {
      console.error(error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
  }

  /**
   * @description  edit a highlight for a given article
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @param  {Object} next - The next middleware.
   * @return {Object} - It returns the response object.
   */

  static async update(req, res) {
    const { highlightId } = req.params;
    const { start, end } = req.query;
    const { comment } = req.body;
    const { id: userId } = req.user;
    try {
      const highlight = await Highlight.update(
        { startIndex: start, endIndex: end, comment },
        {
          where: { id: highlightId, userId },
          returning: true,
          attributes: { exclude: ["deletedAt"] }
        }
      );
      if (highlight[1][0]) {
        res.status(OK).json({
          message: "Your highlight has been updated successfully",
          highlight: highlight[1][0].dataValues
        });
      } else {
        res.status(NOT_FOUND).json({
          message: "The highlight you are looking for cannot be found"
        });
      }
    } catch (error) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
  }

  /**
   * @description  delete a highlight for a given article
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @param  {Object} next - The next middleware.
   * @return {Object} - It returns the response object.
   */

  static async delete(req, res) {
    const { highlightId } = req.params;
    try {
      const highlight = await Highlight.destroy({
        where: { id: highlightId, userId: req.user.id },
        returning: true
      });
      if (highlight.length) {
        res.status(OK).json({
          message: "Your highlight has been deleted",
          highlight
        });
      } else {
        res.status(NOT_FOUND).json({
          message: "The highlight you are looking for cannot be found"
        });
      }
    } catch (error) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
  }

  /**
   * @description  get one highlight for a given article
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @param  {Object} next - The next middleware.
   * @return {Object} - It returns the response object.
   */
  static async findOne(req, res) {
    const { highlightId } = req.params;
    try {
      const highlight = await Highlight.findOne({
        where: { id: highlightId },
        attributes: ["createdAt", "endIndex", "id", "startIndex", "updatedAt"],
        include: [
          {
            model: Comment,
            as: "comment"
          }
        ]
      });
      if (highlight) {
        res.status(OK).json({
          highlight,
          message: "The highlight has been retrieved"
        });
      } else {
        res.status(NOT_FOUND).json({
          message: "The highlight you are looking for cannot be found"
        });
      }
    } catch (error) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
  }

  /**
   * @description  get all highlight for a given article by a user
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */
  static async findAll(req, res) {
    const { id: userId } = req.user;
    const { id: articleId } = req.article;
    try {
      const highlights = await Highlight.findAll({
        where: { userId, articleId },
        include: [
          {
            model: Comment,
            as: "comment"
          }
        ]
      });
      res.status(OK).json({
        highlights,
        message: "The highlights have been retrieved"
      });
    } catch (error) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
  }
}

export default HighlightController;
