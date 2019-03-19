import { Router } from "express";
import Article from "../controllers/articlesController";
import articleValidator from "../middlewares/articleValidator";
import ArticleLikeController from "../controllers/articleLikesController";
import checkAuth from "../middlewares/checkAuth";
import optionalAuth from "../middlewares/optionalAuth";
import BookmarkController from "../controllers/bookmarkController";
import ReportArticleController from "../controllers/reportArticleController";

const article = Router();

article.get("/articles", optionalAuth, Article.findAll);
article.put("/articles/:slug", checkAuth, Article.update);
article.delete("/articles/:slug", checkAuth, Article.deleteOne);
article.post("/articles/:slug/bookmark", checkAuth, BookmarkController.bookmark);
article.post("/articles/:slug/likes", checkAuth, ArticleLikeController.like);
article.post("/articles/:slug/dislikes", checkAuth, ArticleLikeController.dislike);
article.get(
  "/articles/:slug/likes",
  checkAuth,
  ArticleLikeController.getArticleLikes
);

article
  .post("/articles", checkAuth, Article.create)
  .get("/articles/:slug", Article.findOneArticle);
article.put(
  "/articles/:slug/report",
  checkAuth,
  articleValidator.validateArticle,
  ReportArticleController.reportArticle
);
export default article;
