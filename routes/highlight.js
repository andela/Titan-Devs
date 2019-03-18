import { Router } from "express";
import checkAuth from "../middlewares/checkAuth";
import articleValidator from "../middlewares/articleValidator";
import HighlightController from "../controllers/highlightController";
import {
  validateOneHighlight,
  validateEditHighlight,
  validateHighlight,
  selectHighlightedText
} from "../middlewares/highlightValidator";

const highlightRouters = Router();
highlightRouters.use(checkAuth);
highlightRouters.post(
  "/articles/:slug/highlights",
  articleValidator.validateArticle,
  validateHighlight,
  selectHighlightedText,
  HighlightController.create
);

highlightRouters
  .route("/articles/:slug/highlights/:highlightId")
  .put(
    articleValidator.validateArticle,
    validateEditHighlight,
    selectHighlightedText,
    HighlightController.update
  )
  .delete(
    articleValidator.validateArticle,
    validateOneHighlight,
    HighlightController.delete
  )
  .get(
    articleValidator.validateArticle,
    validateOneHighlight,
    HighlightController.findOne
  );

highlightRouters.get(
  "/articles/:slug/highlights",
  articleValidator.validateArticle,
  HighlightController.findAll
);
export default highlightRouters;
