import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    content: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    photopath: { type: String },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Post", postSchema, "posts");
