import opn from "opn";
import models from "../models";
import constants from "../helpers/constants";

const { Article } = models;
let opnResponse;
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } = constants.statusCode;
export default class ShareArticleController {
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
}
