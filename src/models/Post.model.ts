import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./User.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface PostInput {
  author: UserDocument["_id"];
  title: string;
  content: string;
}

export interface PostDocument extends PostInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
      default: () => `post_${nanoid()}`,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<PostDocument>("Post", postSchema);

export default PostModel;
