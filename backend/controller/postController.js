import Joi from "joi";
import fs from "fs";
import { BACKEND_SERVER_URL } from "../config/index.js";
import Post from "../models/post.js";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const postController = {
  //create post method
  async createPost(req, res, next) {
    const createPostSchema = Joi.object({
      content: Joi.string().required(),
      title: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
      photopath: Joi.string(),
    });
    const { error } = createPostSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, author, photopath } = req.body;
    if (photopath) {
      //read image in the buffer
      const buffer = Buffer.from(
        photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      //allocate redmon name for image
      const imagePath = `${Date.now()}-${author}.png`;
      //store locally
      try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
      } catch (error) {
        return next(error);
      }
      //store the post in database
      let post;
      try {
        const newPost = new Post({
          content,
          title,
          author,
          photopath: `${BACKEND_SERVER_URL}/storage/${imagePath}`,
        });
        post = await newPost.save();
      } catch (error) {
        return next(error);
      }
    }
    //if photo is not comming then it will save the data without image in database

    try {
      const newPost = new Post({
        content,
        title,
        author,
      });
      post = await newPost.save();
    } catch (error) {
      return next(error);
    }

    //sending response
    res.status(201).json({ post });
  },
  //get post by id method
  async getPostById(req, res, next) {
    const getPostSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = getPostSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let post;
    try {
      post = await Post.findOne({ _id: id }).populate("author");
      if (!post) {
        const error = {
          status: 404,
          message: "post not found!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ post });
  },
  //get all post method
  async getAllPost(req, res, next) {
    try {
      const posts = await Post.find({}).populate("author");
      const postArr = [];
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        postArr.push(post);
      }

      res.status(200).json({ posts: postArr });
    } catch (error) {
      return next(error);
    }
  },
  //delete post method
  async deletePost(req, res, next) {
    const deletePostSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = deletePostSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      await Post.deleteOne({ _id: id });
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "post has been deleted!" });
  },
  //update post method
  async updatePost(req, res, next) {
    const updatePostSchema = Joi.object({
      content: Joi.string(),
      title: Joi.string(),
      photopath: Joi.string(),
      author: Joi.string().required(),
      postId: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = updatePostSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, author, postId } = req.body;

    try {
      const post = await Post.findOne({ _id: postId });
      if (!post) {
        const error = {
          status: 404,
          message: "post not found!",
        };
        return next(error);
      }
      if (photopath) {
        let previous = post.photopath;
        previous = previous.split("/").pop();
        fs.unlinkSync(`storage/${previous}`);
        //read photo path in buffer
        const buffer = Buffer.from(
          photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          "base64"
        );
        //allocate random name
        const imagePath = `${Date.now()}-${author}.png`;
        //save it locally
        fs.writeFileSync(`storage/${imagePath}`, buffer);
        //update the database
        try {
          await Post.updateOne(
            { _id: postId },
            {
              content,
              title,
              photopath: `${BACKEND_SERVER_URL}/storage/${imagePath}`,
            }
          );
        } catch (error) {
          return next(error);
        }
      } else {
        await Post.updateOne(
          { _id: postId },
          {
            content,
            title,
          }
        );
      }
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "post has been uodated!" });
  },
};

export default postController;
