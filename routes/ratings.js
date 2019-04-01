import { Router } from "express";
import checkAuth from "../middlewares/checkAuth";
import validator from "../middlewares/modelValidator";

import RatingController from "../controllers/ratingsController";

const ratingRouters = Router();
ratingRouters.use(checkAuth);
ratingRouters
  .route("/articles/:slug/rating")
  .get(validator.validateArticle, RatingController.getAll)
  .post(validator.validateArticle, RatingController.create)
  .put(validator.validateArticle, RatingController.update);

export default ratingRouters;
