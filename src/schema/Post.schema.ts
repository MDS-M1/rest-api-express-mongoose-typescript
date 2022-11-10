import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schema:
 *     Product:
 *       type: object
 *       required:
 *        - title
 *        - author
 *        - content
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         content:
 *           type: string
 */

const payload = {
  body: object({
    title: string({
      required_error: "A title is required",
    }).max(120, "This title is too long"),
    content: string({
      required_error: "Content missing in this post",
    }),
  }),
};

const params = {
  params: object({
    postId: string({
      required_error: "postId is required",
    }),
  }),
};

export const createPostSchema = object({
  ...payload,
});

export const updatePostSchema = object({
  ...payload,
  ...params,
});

export const deletePostSchema = object({
  ...params,
});

export const getPostSchema = object({
  ...params,
});

export type CreatePostInput = TypeOf<typeof createPostSchema>;
export type UpdatePostInput = TypeOf<typeof updatePostSchema>;
export type ReadPostInput = TypeOf<typeof deletePostSchema>;
export type DeletePostInput = TypeOf<typeof getPostSchema>;
