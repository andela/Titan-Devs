import { Router } from "express";
import Article from "../controllers/articlesController";
import articleValidator from "../middlewares/articleValidator";
import ArticleLikeController from "../controllers/articleLikesController";
import BookmarkController from "../controllers/bookmarkController";
import ReportArticleController from "../controllers/reportArticleController";
import checkAuth from "../middlewares/checkAuth";

const article = Router();

article.post("/articles/:slug/bookmark", checkAuth, BookmarkController.bookmark);
article.post("/articles/:slug/likes", ArticleLikeController.like);
article.post("/articles/:slug/dislikes", ArticleLikeController.dislike);
article.get("/articles/:slug/likes", ArticleLikeController.getArticleLikes);

article
  .post("/articles", checkAuth, Article.create)
  .get("/articles/:slug", Article.findOneArticle);
article.put(
  "/articles/:slug/report",
  articleValidator.validateArticle,
  ReportArticleController.reportArticle
);
export default article;
