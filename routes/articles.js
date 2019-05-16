import { Router } from "express";
import Article from "../controllers/articlesController";
import articleValidator from "../middlewares/modelValidator";
import ArticleLikeController from "../controllers/articleLikesController";
import checkAuth from "../middlewares/checkAuth";
import optionalAuth from "../middlewares/optionalAuth";
import BookmarkController from "../controllers/bookmarkController";
import ReportArticleController from "../controllers/reportArticleController";
import articleFilters from "../middlewares/articleFilters";

const article = Router();

article
  .get("/articles/:slug", optionalAuth, Article.findOneArticle)
  .get("/articles", optionalAuth, Article.findAll, articleFilters)
  .post("/articles", checkAuth, Article.create)
  .post("/articles/:slug/bookmark", checkAuth, BookmarkController.bookmark)
  .post("/articles/:slug/likes", checkAuth, ArticleLikeController.like)
  .post("/articles/:slug/dislikes", checkAuth, ArticleLikeController.dislike)
  .get("/articles/:slug/likes", checkAuth, ArticleLikeController.getArticleLikes)
  .put(
    "/articles/:slug/report",
    checkAuth,
    articleValidator.validateArticle,
    ReportArticleController.reportArticle
  )
  .put("/articles/:slug", checkAuth, Article.update)
  .delete("/articles/:slug", checkAuth, Article.deleteOne);

export default article;
