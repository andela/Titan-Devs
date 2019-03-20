import { Router } from "express";
import Article from "../controllers/articlesController";
import articleValidator from "../middlewares/articleValidator";
import ArticleLikeController from "../controllers/articleLikesController";
import checkAuth from "../middlewares/checkAuth";
import optionalAuth from "../middlewares/optionalAuth";
import BookmarkController from "../controllers/bookmarkController";
import ReportArticleController from "../controllers/reportArticleController";

const article = Router();

article.get("/articles/:slug", optionalAuth, Article.findOneArticle);
article.get("/articles", optionalAuth, Article.findAll);

article
  .use(checkAuth)
  .post("/articles", Article.create)
  .post("/articles/:slug/bookmark", BookmarkController.bookmark)
  .post("/articles/:slug/likes", ArticleLikeController.like)
  .post("/articles/:slug/dislikes", ArticleLikeController.dislike)
  .get("/articles/:slug/likes", ArticleLikeController.getArticleLikes)
  .put(
    "/articles/:slug/report",
    articleValidator.validateArticle,
    ReportArticleController.reportArticle
  )
  .route("/articles/:slug")
  .put(Article.update)
  .delete(Article.deleteOne);

export default article;
