import models from "../models";
import constants from "../helpers/constants";
import articleValidator from "../helpers/validators/articleValidators";
import calculateReadTime from "../helpers/calculateReadTime";

const { User, Article, Tag, ArticleTag, Bookmark } = models;
const {
  CREATED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  GONE
} = constants.statusCode;

/**
 * @class PostController
 */
export default class PostController {
  /**
   * @description This helps the authorized user to create a new article
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @return {object} - It returns the request response object
   */

  static async create(req, res) {
    try {
      const { tagsList = [], ...rest } = req.body;
      const { id: userId } = req.user;
      const refs = [];
      const valid = await articleValidator(req.body);
      const readTime = calculateReadTime(req);
      const user = await User.findOne({ where: { id: userId } });
      if (user && valid) {
        const article = await Article.create({
          readTime,
          ...rest,
          slug: "",
          userId
        });
        const { id: articleId } = article.dataValues;
        await tagsList.map(async tag => {
          const tags = await Tag.findOrCreate({ where: { name: tag } });
          refs.push(
            await ArticleTag.create({
              articleId,
              tagId: tags[0].dataValues.id
            })
          );
        });
        return refs
          ? res.status(CREATED).json({
              status: CREATED,
              message: "Article created",
              article: { ...article.dataValues, tagsList }
            })
          : res
              .status(NOT_FOUND)
              .json({ status: NOT_FOUND, message: "Please consider logging in" });
      }
    } catch (error) {
      if (error.details)
        return res
          .status(BAD_REQUEST)
          .send({ message: error.details[0].message, status: BAD_REQUEST });
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: error, status: INTERNAL_SERVER_ERROR });
    }
  }

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
      if (!article || !user)
        return res.status(BAD_REQUEST).json({
          status: BAD_REQUEST,
          message: `The article with this slug ${slug} doesn't exist`
        });
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
          status: INTERNAL_SERVER_ERROR
        });
      }
      const { id } = bookmark.dataValues;
      const deleted = Bookmark.destroy({ where: { id } });
      return deleted
        ? res.status(GONE).json({ message: "Bookmark deleted", status: GONE })
        : res.status(INTERNAL_SERVER_ERROR).json({
            message: "Error while discarding the bookmark",
            status: INTERNAL_SERVER_ERROR
          });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: error, status: INTERNAL_SERVER_ERROR });
    }
  }
}
