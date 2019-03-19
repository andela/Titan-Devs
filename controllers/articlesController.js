import _ from "lodash";
import models from "../models";
import constants from "../helpers/constants";
import articleValidator, {
  articleSchema
} from "../helpers/validators/articleValidators";
import calculateReadTime from "../helpers/calculateReadTime";

const { User, Article, Tag, ArticleTags } = models;
const {
  CREATED,
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST
} = constants.statusCode;

/**
 * @class ArticleController
 */
export default class ArticleController {
  /**
   * @description This helps the authorized user to create a new article
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} It returns the request's response object
   */

  static async create(req, res) {
    try {
      const { tagsList = [], ...rest } = req.body;
      const { id: userId } = req.user;
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
        tagsList.map(async t => {
          const tag = await Tag.findOrCreate({ where: { name: t } }).spread(
            tg => tg
          );
          await article.addTagsList(tag);
        });
        res.status(CREATED).json({
          message: "Article created",
          article: { ...article.get(), tagsList }
        });
      }
    } catch (error) {
      return error.details
        ? res.status(BAD_REQUEST).json({ message: error.details[0].message })
        : res.status(INTERNAL_SERVER_ERROR).json({
            message: "Can't create the article, server error"
          });
    }
  }

  /**
   * @description It helps the user to fetch a single article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {object} It returns the response object.
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
   * @description It helps the user to fetch all of the created articles.
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} It returns the request's response object
   */

  static async findAll(req, res) {
    const { user: { id = null } = {} } = req;

    try {
      const all = await Article.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "author",
            attributes: ["username", "bio", "image"],
            include: [
              { model: User, as: "followers", attributes: ["id", "username"] }
            ]
          },
          { model: User, as: "likes", attributes: ["username"], through: {} },
          { model: Tag, attributes: ["name"], as: "tagsList", through: {} }
        ]
      });
      if (all.length) {
        const articles = all.map(each => {
          const {
            author: { followers, username, bio, image }
          } = each.get();
          const { tagsList, likes, ...article } = each.get();
          const following = !!_.dropWhile(followers, f => f.id !== id).length;
          return {
            ...article,
            likes: likes.map(like => like.username),
            author: { following, username, bio, image },
            favorited: !!likes.length,
            favoritesCount: likes.length,
            tagsList: tagsList.map(t => t.get().name || null)
          };
        });
        const articlesCount = articles.length;
        return res
          .status(OK)
          .json({ message: "Successful", articles, articlesCount });
      }
      return res.status(NOT_FOUND).json({
        message:
          "No more articles found, you can also share your thoughts by creating an article"
      });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Can't get the articles, server error" });
    }
  }

  /**
   * @description It helps the user to update any of his articles.
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} It returns the request's response object
   */

  static async update(req, res) {
    try {
      const { slug } = req.params;
      const { user: { id: userId } = {}, body } = req;
      const article = await Article.findOne({ where: { slug, userId } });
      if (article) {
        const allowed = _.pick(body, Object.keys(articleSchema));
        const valid = await articleValidator(
          allowed,
          _.pick(articleSchema, Object.keys(allowed))
        );
        const { tagsList = [], ...rest } = valid;
        if (tagsList.length) {
          tagsList.map(async t => {
            const tag = await Tag.findOrCreate({ where: { name: t } }).spread(
              tg => tg
            );
            await article.addTagsList(tag);
          });
        }
        const updated = await article.update(rest, {
          where: { id: article.id, userId },
          returning: true,
          limit: 1
        });
        const tags = await updated
          .getTagsList({ attributes: ["name"] })
          .map(t => t.name || null);
        return res.status(CREATED).json({
          article: {
            ...updated.get(),
            author: _.pick(await updated.getAuthor(), ["username", "bio", "image"]),
            tagsList: tags
          },
          message: `Updated successfully`
        });
      }
      return res.status(UNAUTHORIZED).json({
        message: `You can only update the article you authored`
      });
    } catch (error) {
      return error.details
        ? res.status(BAD_REQUEST).json({ message: error.details[0].message })
        : res.status(INTERNAL_SERVER_ERROR).json({
            message: "Can't update the article, server error"
          });
    }
  }

  /**
   * @description It helps the user to delete any of his articles.
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} It returns the request's response object
   */

  static async deleteOne(req, res) {
    try {
      const { slug } = req.params;
      const { user: { id: userId } = {} } = req;
      const article = await Article.findOne({ where: { slug } });
      if (!article) {
        return res.status(NOT_FOUND).json({
          message: `Error deleting, article not found`
        });
      }
      if (article.userId !== userId) {
        return res.status(UNAUTHORIZED).json({
          message: `You can only delete the article you authored`
        });
      }
      await ArticleTags.destroy({ where: { articleId: article.id } });
      await Article.destroy({ where: { id: article.id } });
      return res.status(OK).json({ message: "Deleted successfully" });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "Can't delete the article, server error"
      });
    }
  }
}
