import { Router } from "express";
import Article from "../controllers/articlesController";
import articleValidator from "../middlewares/articleValidator";
import ArticleLikeController from "../controllers/articleLikesController";
import BookmarkController from "../controllers/bookmarkController";
import ReportArticleController from "../controllers/reportArticleController";
import ShareController from '../controllers/shareController';
import checkAuth from "../middlewares/checkAuth";

const article = Router();

article.post("/articles/:slug/bookmark", checkAuth, BookmarkController.bookmark);
article.post("/articles/:slug/likes", ArticleLikeController.like);
article.post("/articles/:slug/dislikes", ArticleLikeController.dislike);
article.get("/articles/:slug/likes", ArticleLikeController.getArticleLikes);

article
  .post("/articles", checkAuth, Article.create)
  .get(
    "/articles/:slug/share/twitter",
    checkAuth,
    articleValidator.validateArticle,
    ShareController.shareOnTwitter
  )
  .get(
    "/articles/:slug/share/fb",
    checkAuth,
    articleValidator.validateArticle,
    ShareController.shareOnFacebook
  )
  .get(
    "/articles/:slug/share/linkedIn",
    checkAuth,
    articleValidator.validateArticle,
    ShareController.shareOnLinkedin
  )
  .get("/articles/:slug/share/email", checkAuth, ShareController.shareOnEmail)
  .get("/articles/:slug", Article.findOneArticle);
article.put(
  "/articles/:slug/report",
  articleValidator.validateArticle,
  ReportArticleController.reportArticle
);
export default article;
