import models from "../models";
import constants from "../helpers/constants";

const { User, Article, Bookmark } = models;

const { CREATED, NOT_FOUND, INTERNAL_SERVER_ERROR, OK } = constants.statusCode;
const { SERVER_ERROR } = constants.errorMessage;
export default class BookMarkController {
  /**
   * @description It helps the user to bookmark the article for reading it later.
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} It returns the request's response object
   */

  static async bookmark(req, res) {
    try {
      const { id: userId } = req.user;
      const { slug } = req.params;
      const user = await User.findOne({ where: { id: userId } });
      const article = await Article.findOne({ where: { slug } });
      if (!article || !user) {
        return res.status(NOT_FOUND).json({
          message: `The article with this slug ${slug} doesn't exist`
        });
      }
      const { id: articleId } = article.dataValues;
      const bookmark = await Bookmark.findOne({ where: { userId, articleId } });
      if (!bookmark) {
        const bookmarked = await Bookmark.create({ userId, articleId });
        if (bookmarked) {
          return res.status(CREATED).json({
            message: "Article bookmarked",
            bookmark: bookmarked.dataValues
          });
        }
        return res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
      }
      const { id } = bookmark.dataValues;
      const deleted = Bookmark.destroy({ where: { id } });
      return deleted
        ? res.status(OK).json({ message: "Bookmark deleted" })
        : res.status(INTERNAL_SERVER_ERROR).json({
            message: "Error while discarding the bookmark"
          });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
    }
  }
}
