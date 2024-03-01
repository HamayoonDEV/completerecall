import Joi from "joi";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const commentController = {
  //postComment method
  async postComment(req, res, next) {
    const postCommentSchema = Joi.object({
      content: Joi.string().required(),
      author: Joi.string().required(),
      postId: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = postCommentSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, author, postId } = req.body;
    try {
      const post = await Post.findOne({ _id: postId });
      if (post) {
        try {
          const newComment = new Comment({
            content,
            author,
            postId,
          });
          await newComment.save();
        } catch (error) {
          return next(error);
        }
      } else {
        const error = {
          status: 404,
          message: "post not found!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //sendig response
    res.status(201).json({ message: "comment created!" });
  },
  //get all comments by post id
  async getAllComments(req, res, next) {
    const getAllCommentsSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = getAllCommentsSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let comments;
    try {
      comments = await Comment.find({ postId: id }).populate("author");
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ comments });
  },
};

export default commentController;
