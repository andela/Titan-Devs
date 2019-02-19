import { Router } from "express";
import Article from "../controllers/articlesController";

import ArticleLikeController from "../controllers/articleLikesController";
import checkAuth from "../middlewares/checkAuth";
import shareValidator from "../middlewares/shareValidator";

const article = Router();

article.post("/articles", checkAuth, Article.create);
article.post("/articles/:slug/bookmark", Article.bookmark);
article.post("/articles/:slug/likes", ArticleLikeController.like);
article.post("/articles/:slug/dislikes", ArticleLikeController.dislike);
article.get("/articles/:slug/likes", ArticleLikeController.getArticleLikes);

article
  .post("/articles", Article.create)
  .get(
    "/article/:articleId/share/twitter",
    checkAuth,
    shareValidator.validateArticle,
    Article.shareOnTwitter
  )
  .get(
    "/article/:articleId/share/fb",
    checkAuth,
    shareValidator.validateArticle,
    Article.shareOnFacebook
  )
<<<<<<< HEAD
  .get(
    "/article/:articleId/share/linkedIn",
    checkAuth,
    shareValidator.validateArticle,
    Article.shareOnLinkedin
  )
=======
>>>>>>> [#163518700] share on facebook
  .get("/article/:articleId/share/email", checkAuth, Article.shareOnEmail)
  .get("/article/:articleId", Article.findOneArticle);

export default article;
