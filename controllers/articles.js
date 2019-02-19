import dotenv from "dotenv";
import opn from "opn";
import models from "../models";
import constants from "../helpers/constants";
import articleValidator from "../helpers/validators/articleValidators";

const { User, Article, Tag, ArticleTag } = models;
const { CREATED, NOT_FOUND, BAD_REQUEST } = constants.statusCode;
dotenv.config();
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
        const { id: articleId } = article.dataValues;
        // eslint-disable-next-line no-restricted-syntax
        for (const tag of tagsList) {
          // eslint-disable-next-line no-await-in-loop
          const tags = await Tag.findOrCreate({ where: { name: tag } });
          refs.push(
            // eslint-disable-next-line no-await-in-loop
            await ArticleTag.create({
              articleId,
              tagId: tags[0].dataValues.id
            })
          );
        }
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
      // eslint-disable-next-line no-prototype-builtins
      if (error.hasOwnProperty("details"))
        return res
          .status(BAD_REQUEST)
          .send({ message: error.details[0].message, status: BAD_REQUEST });
      return res.status(500).send({ message: error, status: 500 });
    }
  }

  static async findOneArticle(req, res) {
    try {
      const { articleId } = req.params;
      const article = await Article.findOne({
        where: { id: articleId }
      });
      return res.status(200).json({
        article
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Article was NOT posted, Server error" });
    }
  }

  static async shareOnEmail(req, res) {
    try {
      const { articleId } = req.params;
      const article = await Article.findOne({
        where: { id: articleId }
      });
      opn(
        `mailto:?subject=${article.dataValues.title}&amp;body=${
          process.env.SERVER_HOST
        }/article/${article}`
      );
      return res.status(200).json({
        message: "Article ready to be posted on Email"
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Article was NOT posted, Server error" });
    }
  }

  static async shareOnFacebook(req, res) {
    try {
      const { articleId } = req.params;
      if (process.env === "production") {
        opn(
          `https://www.facebook.com/sharer/sharer.php?&u=${
            process.env.SERVER_HOST
          }/article/${articleId}`
        );
      } else {
        opn(
          `https://www.facebook.com/sharer/sharer.php?&u=http://tolocalhost.com/api/v1/article/${articleId}`
        );
      }

      return res.status(200).json({
        message: "Article ready to be posted on facebook"
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Article was NOT posted, Server error" });
    }
  }

  static async shareOnTwitter(req, res) {
    try {
      const { articleId } = req.params;
      opn(
        `https://twitter.com/intent/tweet?text=${
          process.env.SERVER_HOST
        }/article/${articleId}`
      );
      return res.status(200).json({
        message: "Article ready to be posted on twitter"
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Article was NOT posted, Server error" });
    }
  }
}
