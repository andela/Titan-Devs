import { Router } from "express";
import Comment from "../controllers/commentController";
import checkAuth from "../middlewares/checkAuth";

const comment = Router();

comment.use(checkAuth);
comment.post("/articles/:slug/comments", Comment.create);
comment.post("/articles/:slug/comments/:commentId/likes", Comment.like);
comment.get("/articles/:slug/comments/:commentId/likes", Comment.getCommentLikes);
 
export default comment;
