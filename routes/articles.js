import { Router } from "express";
import Article from "../controllers/articlesController";

const article = Router();

article.post("/articles", Article.create);
article.post("/articles/:slug/bookmark", Article.bookmark);

export default article;
