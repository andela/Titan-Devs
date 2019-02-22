import { Router } from "express";
import Article from "../controllers/articlesController";
import articleValidator from "../middlewares/articleValidator";
import ArticleLikeController from "../controllers/articleLikesController";
import checkAuth from "../middlewares/checkAuth";

const article = Router();

article.post("/articles", checkAuth, Article.create);
article.post("/articles/:slug/bookmark", checkAuth, Article.bookmark);
article.post("/articles/:slug/likes", ArticleLikeController.like);
article.post("/articles/:slug/dislikes", ArticleLikeController.dislike);
article.get("/articles/:slug/likes", ArticleLikeController.getArticleLikes);

article
  .post("/articles", checkAuth, Article.create)
  .get(
    "/articles/:slug/share/twitter",
    checkAuth,
    articleValidator.validateArticle,
    Article.shareOnTwitter
  )
  .get(
    "/articles/:slug/share/fb",
    checkAuth,
    articleValidator.validateArticle,
    Article.shareOnFacebook
  )
  .get(
    "/articles/:slug/share/linkedIn",
    checkAuth,
    articleValidator.validateArticle,
    Article.shareOnLinkedin
  )
  .get("/articles/:slug/share/email", checkAuth, Article.shareOnEmail)
  .get("/articles/:slug", Article.findOneArticle);
article.post("/articles", Article.create);
article.post("/articles/:slug/bookmark", Article.bookmark);
article.put("/articles/:slug/report", Article.reportArticle);
export default article;
