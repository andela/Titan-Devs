import { Router } from "express";
import Article from "../controllers/articles";

const article = Router();

article.post("/articles", Article.create);

export default article;
