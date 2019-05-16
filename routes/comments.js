import { Router } from "express";
import Comment from "../controllers/commentController";
import validateRequest from "../middlewares/requestValidator/validateRequest";
import checkAuth from "../middlewares/checkAuth";
import optionalAuth from "../middlewares/optionalAuth";

const comment = Router();

comment
  .get(
    "/articles/:slug/comments",
    optionalAuth,
    validateRequest,
    Comment.fetchAllComments
  )
  .get("/articles/:slug/comments/:id", Comment.fetch)
  .post("/articles/:slug/comments", checkAuth, Comment.create)
  .put("/articles/:slug/comments/:id", checkAuth, Comment.update)
  .delete("/articles/:slug/comments/:id", checkAuth, Comment.delete)
  .post("/articles/:slug/comments/:commentId/likes", checkAuth, Comment.like)
  .get(
    "/articles/:slug/comments/:commentId/likes",
    checkAuth,
    Comment.getCommentLikes
  )
  .get(
    "/articles/:slug/comments/:commentId/history",
    checkAuth,
    Comment.getEditHistory
  );

export default comment;
