import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    postId: { type: mongoose.SchemaTypes.ObjectId, ref: "Post" },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Comment", commentSchema, "comments");
