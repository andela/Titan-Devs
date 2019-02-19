import { Router } from "express";
import Article from "../controllers/articlesController";
import checkAuth from "../middlewares/checkAuth";
import shareValidator from "../middlewares/shareValidator";

const article = Router();

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
  .get("/article/:articleId/share/email", checkAuth, Article.shareOnEmail)
  .get("/article/:articleId", Article.findOneArticle);

export default article;
