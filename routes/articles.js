import { Router } from "express";
import Article from "../controllers/articlesController";

const article = Router();

article.post("/articles", Article.create);

export default article;
