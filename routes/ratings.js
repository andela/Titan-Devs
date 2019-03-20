import { Router } from "express";
import checkAuth from "../middlewares/checkAuth";
import articleValidator from "../middlewares/modelValidator";
import RatingController from "../controllers/ratingsController";

const ratingRouters = Router();
ratingRouters.use(checkAuth);
ratingRouters
  .route("/article/:slug/rating")
  .get(articleValidator.validateArticle, RatingController.getAll)
  .post(articleValidator.validateArticle, RatingController.create)
  .put(articleValidator.validateArticle, RatingController.update);

export default ratingRouters;
