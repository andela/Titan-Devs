import _ from "lodash";
import models from "../models";
import constants from "../helpers/constants";
import articleValidator, {
  articleSchema
} from "../helpers/validators/articleValidators";
import calculateReadTime from "../helpers/calculateReadTime";

const { User, Article, Tag, ArticleTags, Comment } = models;
const {
  CREATED,
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST
} = constants.statusCode;
const { SERVER_ERROR, NO_ARTICLE_FOUND } = constants.errorMessage;

const articleQuery = {
  order: [["createdAt", "DESC"]],
  where: { deletedAt: null },
  attributes: { exclude: ["deletedAt"] },
  include: [
    {
      model: User,
      as: "author",
      attributes: ["username", "image", "firstName", "lastName"],
      include: [{ model: User, as: "followers", attributes: ["id", "username"] }]
    },
    {
      model: User,
      as: "likes",
      attributes: ["username", "image", "firstName", "lastName"],
      through: { attributes: [] }
    },
    {
      model: Tag,
      attributes: ["name"],
      as: "tagsList",
      through: { attributes: [] }
    },
    {
      model: Comment,
      as: "comments",
      attributes: ["id", "body", "createdAt", "updatedAt", "like"],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username", "image", "firstName", "lastName"]
        },
        {
          model: User,
          as: "likes",
          through: { attributes: [] },
          attributes: ["username", "image", "firstName", "lastName"]
        }
      ]
    }
  ]
};

const orderArticle = (article, id) => {
  const {
    author: { followers, username, bio, image, firstName, lastName }
  } = article.get();
  const { tagsList, likes, ...artInfo } = article.get();
  const following = !!_.dropWhile(followers, f => f.id !== id).length;
  return {
    ...artInfo,
    likes,
    author: { following, username, bio, image, firstName, lastName },
    liked: !!likes.length,
    likesCount: likes.length,
    tagsList: tagsList.map(t => t.get().name || null)
  };
};
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
      if (req.user && valid) {
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
        return res.status(CREATED).json({
          message: "Article created",
          article: { ...article.get(), tagsList }
        });
      }
    } catch (error) {
      return error.details
        ? res.status(BAD_REQUEST).json({ message: error.details[0].message })
        : res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
    }
  }

  /**
   * @description It helps the user to fetch a single article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {object} It returns the response object.
   */

  static async findOneArticle(req, res) {
    const { user: { id = null } = {} } = req;
    const { slug } = req.params;
    const { where, order, ...rest } = articleQuery;
    try {
      const article = await Article.findOne({
        where: { slug, deletedAt: null },
        ...rest
      });

      return article
        ? res.status(OK).json({
            message: "Article found successfully",
            article: orderArticle(article, id)
          })
        : res.status(NOT_FOUND).json({
            message: `No article matching with the ${slug} slug`
          });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
    }
  }

  /**
   * @description It helps the user to fetch all of the created articles.
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} It returns the request's response object
   */

  static async findAll(req, res, next) {
    const { user: { id = null } = {} } = req;
    const { author, favorited, tag, page = 1, limit = 20 } = req.query;
    try {
      const all = await Article.findAll({
        offset: (Number(page) - 1) * Number(limit),
        limit,
        ...articleQuery
      });
      if (all.length > 0) {
        const articles = all.map(each => orderArticle(each, id));
        return author || favorited || tag
          ? next(articles)
          : res.status(OK).json({
              message: "Articles retrieved successfully",
              articles,
              articlesCount: articles.length
            });
      }
      return res.status(NOT_FOUND).json({ message: NO_ARTICLE_FOUND });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
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
          message: `Article updated successfully`
        });
      }
      return res.status(UNAUTHORIZED).json({
        message: `You can only update the article you authored`
      });
    } catch (error) {
      return error.details
        ? res.status(BAD_REQUEST).json({ message: error.details[0].message })
        : res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
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
      const {
        user: { id: userId }
      } = req;
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
      return res.status(OK).json({ message: "Article deleted successfully" });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
    }
  }
}
