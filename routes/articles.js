import { Router } from "express";
import Article from "../controllers/articlesController";
import ArticleLike from "../controllers/articleLikesController";

const article = Router();

article.post("/articles", Article.create);
<<<<<<< HEAD
article.post("/articles/:slug/bookmark", Article.bookmark);
=======
article.get("/articles/:slug", Article.getArticle);
article.post("/articles/:slug/likes", ArticleLike.like, ArticleLike.dislike);
article.delete("/articles/:slug/likes", ArticleLike.dislike);
>>>>>>> [#163518692]Enable user to like or dislike an article

export default article;
