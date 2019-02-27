import opn from "opn";
import models from "../models";
import constants from "../helpers/constants";
import articleValidator from "../helpers/validators/articleValidators";
import calculateReadTime from "../helpers/calculateReadTime";

const { User, Article, Tag, ArticleTag, Bookmark, ReportArticle } = models;
let opnResponse;
const {
  CREATED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  GONE,
  OK,
  CONFLICT
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
  /**
   *
   * shareOnEmail.
   *
   * @param  {object} req - The request object.
   * @param  {object} res - The response object.
   * @return {object} - It returns the response object.
   */

  static async shareOnEmail(req, res) {
    try {
      opnResponse = null;
      const { slug } = req.params;
      const article = await Article.findOne({ where: { slug } });
      if (!article) {
        return res.status(BAD_REQUEST).json({
          message: "Article doesn't exist"
        });
      }
      if (process.env.NODE_ENV === "test") {
        opnResponse = await opn(
          `mailto:?subject=${article.dataValues.title}&body=${
            process.env.SERVER_HOST
          }/article/${slug}`,
          { wait: false, app: "non-existing-web-browser" }
        );
      } else {
        opnResponse = await opn(
          `mailto:?subject=${article.dataValues.title}&body=${
            process.env.SERVER_HOST
          }/article/${slug}`,
          { wait: false }
        );
      }
      return res.status(OK).json({
        message: "Article ready to be posted on Email",
        response: opnResponse
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  /**
   *
   * ShareOnFacebook.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */

  static async shareOnFacebook(req, res) {
    try {
      opnResponse = null;
      const { slug } = req.params;
      if (process.env.NODE_ENV === "production") {
        opnResponse = await opn(
          `https://www.facebook.com/sharer/sharer.php?&u=${
            process.env.SERVER_HOST
          }/article/${slug}`,
          { wait: false }
        );
      } else if (process.env.NODE_ENV === "test") {
        opnResponse = await opn(
          `https://www.facebook.com/sharer/sharer.php?&u=${
            process.env.SERVER_HOST
          }/article/${slug}`,
          { wait: false, app: "non-existing-web-browser" }
        );
      } else {
        opnResponse = await opn(
          `https://www.facebook.com/sharer/sharer.php?&u=http://tolocalhost.com/api/v1/articles/${slug}`,
          { wait: false }
        );
      }

      return res.status(OK).json({
        message: "Article ready to be posted on facebook",
        response: opnResponse
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  /**
   *
   * ShareOnTwitter.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */

  static async shareOnTwitter(req, res) {
    try {
      opnResponse = null;
      const { slug } = req.params;
      if (process.env.NODE_ENV === "test") {
        opnResponse = await opn(
          `https://twitter.com/intent/tweet?text=${
            process.env.SERVER_HOST
          }/articles/${slug}`,
          { wait: false, app: "non-existing-web-browser" }
        );
      } else {
        opnResponse = await opn(
          `https://twitter.com/intent/tweet?text=${
            process.env.SERVER_HOST
          }/articles/${slug}`,
          { wait: false }
        );
      }
      return res.status(OK).json({
        message: "Article ready to be posted on twitter",
        response: opnResponse
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
  /**
   *
   * ShareOnLinkedin.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */

  static async shareOnLinkedin(req, res) {
    try {
      opnResponse = null;
      const { slug } = req.params;
      if (process.env.NODE_ENV === "production") {
        opnResponse = await opn(
          `https://www.linkedin.com/sharing/share-offsite/?url=${
            process.env.SERVER_HOST
          }/articles/${slug}`,
          { wait: false }
        );
      } else if (process.env.NODE_ENV === "test") {
        opnResponse = await opn(
          `https://www.linkedin.com/sharing/share-offsite/?url=http://tolocalhost.com/api/v1/articles/${slug}`,
          { wait: false, app: "non-existing-web-browser" }
        );
      } else {
        opnResponse = await opn(
          `https://www.linkedin.com/sharing/share-offsite/?url=http://tolocalhost.com/api/v1/articles/${slug}`,
          { wait: false }
        );
      }
      return res.status(OK).json({
        message: "Article ready to be posted on linkedIn",
        response: opnResponse
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
  /**
   * @description This creates report an article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the request response object.
   */

  static async reportArticle(req, res) {
    try {
      const { slug } = req.params;
      const { id: userId } = req.user;
      const { description } = req.body;
      if (!description) {
        return res.status(BAD_REQUEST).json({ message: "Please, give a reason" });
      }
      const article = await Article.findOne({
        where: { slug }
      });
      const { id: articleId } = article.dataValues;
      const reportArticle = await ReportArticle.create({
        articleId,
        userId,
        description
      });
      return res.status(OK).json({
        message: "Article reported",
        article: reportArticle
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(CONFLICT).json({
          message: "Article already reported"
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
}
