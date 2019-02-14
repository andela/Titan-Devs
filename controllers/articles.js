import models from "../models";
import constants from "../helpers/constants";
import articleValidator from "../helpers/validators/article";

const { User, Article, Tag, ArticleTag } = models;
const { CREATED, NOT_FOUND, BAD_REQUEST } = constants.statusCode;

export default class PostController {
  /** This creates the new article
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
      const user = await User.findOne({ where: { id: userId } });
      if (user && valid) {
        const article = await Article.create({ ...rest, userId });
        for (let tag of tagsList) {
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
      else return res.status(500).send({ message: error, status: 500 });
    }
  }
}