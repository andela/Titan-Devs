import { Router } from "express";
import Article from "../controllers/articlesController";
import shareValidator from "../middlewares/shareValidator";
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
    shareValidator.validateArticle,
    Article.shareOnTwitter
  )
  .get(
    "/articles/:slug/share/fb",
    checkAuth,
    shareValidator.validateArticle,
    Article.shareOnFacebook
  )
  .get(
    "/articles/:slug/share/linkedIn",
    checkAuth,
    shareValidator.validateArticle,
    Article.shareOnLinkedin
  )
  .get("/articles/:slug/share/email", checkAuth, Article.shareOnEmail)
  .get("/articles/:slug", Article.findOneArticle);
article.post("/articles", Article.create);
article.post("/articles/:slug/bookmark", Article.bookmark);
article.put("/articles/:slug/report", Article.reportArticle);
export default article;
