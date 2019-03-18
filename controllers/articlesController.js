import opn from "opn";
import _ from "lodash";
import models from "../models";
import constants from "../helpers/constants";
import articleValidator, {
  articleSchema
} from "../helpers/validators/articleValidators";
import calculateReadTime from "../helpers/calculateReadTime";

const { User, Article, Tag, ArticleTags, Bookmark, ReportArticle } = models;
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
        : res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: "Can't create the article, server error" });
    }
  }

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
            bookmark: bookmarked.dataValues,
            status: CREATED
          });
        }
        return res.status(OK).json({
          message: "Error while bookmarking the article",
          status: INTERNAL_SERVER_ERROR
        });
      }
      const { id } = bookmark.dataValues;
      const deleted = Bookmark.destroy({ where: { id } });
      return deleted
        ? res.status(OK).json({ message: "Bookmark deleted", status: OK })
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
      return res.status(200).json({
        article
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Article was NOT posted, Server error" });
    }
  }
  /**
   * @description It helps the user to share the article via email.
   * @param  {object} req - The request object.
   * @param  {object} res - The response object.
   * @returns {object} It returns the response object.
   */

  static async shareOnEmail(req, res) {
    try {
      const { slug } = req.params;
      const article = await Article.findOne({ where: { slug } });
      if (!article) {
        return res.status(400).json({
          message: "Article doesn't exist"
        });
      }
      opn(
        `mailto:?subject=${article.dataValues.title}&body=${
          process.env.SERVER_HOST
        }/article/${slug}`
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

  /**
   * @description It helps the user to share the article via Facebook.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {object} It returns the response object.
   */

  static async shareOnFacebook(req, res) {
    try {
      const { slug } = req.params;
      if (process.env === "production") {
        opn(
          `https://www.facebook.com/sharer/sharer.php?&u=${
            process.env.SERVER_HOST
          }/article/${slug}`
        );
      } else {
        opn(
          `https://www.facebook.com/sharer/sharer.php?&u=http://tolocalhost.com/api/v1/article/${slug}`
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

  /**
   * @description It helps the user to share the article via Twitter.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {object} It returns the response object.
   */

  static async shareOnTwitter(req, res) {
    try {
      const { slug } = req.params;
      opn(
        `https://twitter.com/intent/tweet?text=${
          process.env.SERVER_HOST
        }/article/${slug}`
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

  /**
   * @description It helps the user to share the article via LinkedIn.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {object} It returns the response object.
   */

  static async shareOnLinkedin(req, res) {
    try {
      const { slug } = req.params;
      if (process.env === "production") {
        opn(
          `https://www.linkedin.com/sharing/share-offsite/?url=${
            process.env.SERVER_HOST
          }/article/${slug}`
        );
      } else {
        opn(
          `https://www.linkedin.com/sharing/share-offsite/?url=http://tolocalhost.com/api/v1/article/${slug}`
        );
      }
      return res.status(200).json({
        message: "Article ready to be posted on linkedIn"
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Article was NOT posted, Server error" });
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
      const { articleId } = article.dataValues;
      const reportArticle = await ReportArticle.create({
        articleId,
        userId,
        description
      });
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
        message: "No more articles found, still need to read more?"
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
      if (article.userId !== userId || !article) {
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
