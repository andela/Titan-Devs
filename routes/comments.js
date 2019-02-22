import { Router } from "express";
import Comment from "../controllers/commentController";

const comment = Router();

comment.post("/articles/:slug/comments", Comment.create);
comment.post("/articles/:slug/comments/:commentId/likes", Comment.like);
comment.get("/articles/:slug/comments/:commentId/likes", Comment.getCommentLikes);

export default comment;
