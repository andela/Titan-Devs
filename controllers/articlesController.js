import models from "../models";
import constants from "../helpers/constants";
import articleValidator from "../helpers/validators/articleValidators";
import calculateReadTime from "../helpers/calculateReadTime";

const { User, Article, Tag, ArticleTag } = models;
const {
  CREATED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK
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
      if (error.details) {
        return res
          .status(BAD_REQUEST)
          .send({ message: error.details[0].message, status: BAD_REQUEST });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  /**
   *
   * FindOneArticle.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */

  static async findOneArticle(req, res) {
    try {
      const { slug } = req.params;
      const article = await Article.findOne({ where: { slug } });
      return res.status(OK).json({
        article
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
}
