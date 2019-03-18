import { Router } from "express";
import Article from "../controllers/articlesController";
import articleValidator from "../middlewares/articleValidator";
import ArticleLikeController from "../controllers/articleLikesController";
import BookmarkController from "../controllers/bookmarkController";
import ReportArticleController from "../controllers/reportArticleController";
import checkAuth from "../middlewares/checkAuth";
import optionalAuth from "../middlewares/optionalAuth";

const article = Router();

article.get("/articles", optionalAuth, Article.findAll);
article.put("/articles/:slug", checkAuth, Article.update);
article.delete("/articles/:slug", checkAuth, Article.deleteOne);
article.post("/articles/:slug/bookmark", checkAuth, Article.bookmark);
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
article.post("/articles", Article.create);
article.post("/articles/:slug/bookmark", Article.bookmark);
article.put("/articles/:slug/report", checkAuth, Article.reportArticle);
export default article;
