import models from "../models";
import constants from "../helpers/constants";
import articleValidator from "../helpers/validators/article";
import calculateReadTime from "../helpers/caculateReadTime";

const { User, Article, Tag, ArticleTag } = models;
const { CREATED, NOT_FOUND, BAD_REQUEST } = constants.statusCode;

export default class PostController {
  /** This creates the new article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the request response object.
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
        const article = await Article.create({ readTime, ...rest, userId });
        for (const tag of tagsList) {
          const tags = await Tag.findOrCreate({ where: { name: tag } });
          refs.push(
            await ArticleTag.create({
              articleId: article.dataValues.id,
              tagId: tags[0].dataValues.id
            })
          );
        }
        return refs
          ? res.status(CREATED).json({
              status: CREATED,
              message: "Article created",
              article: article.dataValues
            })
          : res
              .status(NOT_FOUND)
              .json({ status: NOT_FOUND, message: "Please consider logging in" });
      }
    } catch (error) {
      // console.log("DATABASE ERROR:", error);
      if (error.hasOwnProperty("details"))
        return res
          .status(BAD_REQUEST)
          .send({ message: error.details[0].message, status: BAD_REQUEST });
      return res.status(500).send({ message: error.stack, status: 500 });
    }
  }
}
