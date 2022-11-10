import { Request, Response } from "express";
import { CreatePostInput, UpdatePostInput } from "../schema/Post.schema";
import {
  createPost,
  deletePost,
  findAndUpdatePost,
  findPost,
  findPosts,
} from "../service/Post.service";

export async function createPostHandler(
  req: Request<{}, {}, CreatePostInput["body"]>,
  res: Response
) {
  const authorId = res.locals.user._id;

  const body = req.body;

  const post = await createPost({
    ...body,
    author: authorId,
  });

  return res.send(post);
}

export async function updatePostHandler(
  req: Request<UpdatePostInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const postId = req.params.postId;
  const update = req.body;

  const post = await findPost({ postId });

  if (!post) {
    return res.sendStatus(404);
  }

  const updatedPost = await findAndUpdatePost({ postId }, update, {
    new: true,
  });

  return res.send(updatedPost);
}

export async function getPostHandler(
  req: Request<UpdatePostInput["params"]>,
  res: Response
) {
  const postId = req.params.postId;
  const post = await findPost({ postId });

  if (!post) {
    return res.sendStatus(404);
  }

  return res.send(post);
}

export async function getPostsHandler(req: Request, res: Response) {
  const posts = await findPosts();

  if (!posts || posts.length === 0) {
    return res.sendStatus(404);
  }

  return res.send(posts);
}

export async function deletePostHandler(
  req: Request<UpdatePostInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const postId = req.params.postId;

  const product = await findPost({ postId });

  if (!product) {
    return res.sendStatus(404);
  }

  await deletePost({ postId });

  return res.sendStatus(200);
}
