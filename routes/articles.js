import { Router } from "express";
import Article from "../controllers/articlesController";
import ArticleLikeController from "../controllers/articleLikesController";

const article = Router();

article.post("/articles", Article.create);
article.post("/articles/:slug/bookmark", Article.bookmark);
article.get("/articles/:slug", Article.getArticle);
article.post("/articles/:slug/likes", ArticleLikeController.like);
article.post("/articles/:slug/dislikes", ArticleLikeController.dislike);
article.get("/articles/:slug/likes", ArticleLikeController.getArticleLikes);
export default article;
