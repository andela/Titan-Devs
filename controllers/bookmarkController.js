import models from "../models";
import constants from "../helpers/constants";

const { User, Article, Bookmark } = models;

const { CREATED, NOT_FOUND, INTERNAL_SERVER_ERROR, GONE } = constants.statusCode;
export default class BookMarkController {
  /**
   * @description It helps the user to bookmark the article for reading it later.
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @return {object} - It returns the request response object
   */

  static async bookmark(req, res) {
    try {
      const { id: userId } = req.user;
      const { slug } = req.params;
      const user = await User.findOne({ where: { id: userId } });
      const article = await Article.findOne({ where: { slug } });
      if (!article || !user) {
        return res.status(NOT_FOUND).json({
          status: NOT_FOUND,
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
            bookmark: bookmarked.dataValues,
            status: CREATED
          });
        }
        return res.status(GONE).json({
          message: "Error while bookmarking the article",
          status: GONE
        });
      }
      const { id } = bookmark.dataValues;
      const deleted = Bookmark.destroy({ where: { id } });
      return deleted
        ? res.status(GONE).json({ message: "Bookmark deleted", status: GONE })
        : res.status(GONE).json({
            message: "Error while discarding the bookmark",
            status: GONE
          });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).send({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
}
