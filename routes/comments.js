import { Router } from "express";
import Comment from "../controllers/commentController";
import validateRequest from "../middlewares/requestValidator/validateRequest";
import checkAuth from "../middlewares/checkAuth";

const comment = Router();
comment.use(checkAuth);
comment
  .route("/articles/:slug/comments")
  .post(Comment.create)
  .get(validateRequest, Comment.fetchAllComments);
comment
  .route("/articles/:slug/comments/:id")
  .get(Comment.fetch)
  .put(Comment.update)
  .delete(Comment.delete);
comment
  .route("/articles/:slug/comments/:commentId/likes")
  .post(Comment.like)
  .get(Comment.getCommentLikes);
comment.get("/articles/:slug/comments/:commentId/history", Comment.getEditHistory);

export default comment;
