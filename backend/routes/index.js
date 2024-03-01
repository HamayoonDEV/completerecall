import express from "express";
import authController from "../controller/authController.js";
import auth from "../middleWare/auth.js";
import postController from "../controller/postController.js";
import commentController from "../controller/commentController.js";

const router = express.Router();
//authController endPoints
router.post("/register", authController.registerUser);
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);
router.get("/refresh", authController.refresh);

//postController endPoints
router.post("/post", auth, postController.createPost);
router.get("/post/:id", auth, postController.getPostById);
router.get("/post", auth, postController.getAllPost);
router.delete("/post/:id", auth, postController.deletePost);
router.put("/post/update", auth, postController.updatePost);

//commentController endPoints
router.post("/comment", auth, commentController.postComment);
router.get("/comment/:id", auth, commentController.getAllComments);
export default router;
