import { Express, Request, Response } from "express";
import {
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
  getPostHandler,
  getPostsHandler,
} from "./controller/Post.controller";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
} from "./controller/Session.controller";
import {
  createUserHandler,
  getUsersHandler,
} from "./controller/User.controller";
import requireUser from "./middleware/requireUser";
import validate from "./middleware/validate";
import havePermission, { Roles } from "./middleware/havePermission";
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
  getPostSchema,
} from "./schema/Post.schema";
import { createSessionSchema } from "./schema/Session.schema";
import { createUserSchema } from "./schema/User.schema";

function routes(app: Express) {
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  /**
   * @openapi
   * '/users':
   *  post:
   *     tags:
   *     - Users
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   *  get:
   *     tags:
   *     - Users
   *     summary: Get all users
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/User'
   *       404:
   *         description: No users found
   */
  app.post("/users", validate(createUserSchema), createUserHandler);
  app.get(
    "/users",
    [requireUser, havePermission(Roles.ADMIN)],
    getUsersHandler
  );

  app.post(
    "/sessions",
    validate(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/sessions", requireUser, getUserSessionsHandler);

  app.delete("/sessions", requireUser, deleteSessionHandler);

  /**
   * @openapi
   * '/posts':
   *  get:
   *     tags:
   *     - Posts
   *     summary: Get all posts
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Post'
   *       404:
   *         description: No posts found
   */
  app.get("/posts", requireUser, getPostsHandler);

  /**
   * @openapi
   * '/post/{postId}':
   *  get:
   *     tags:
   *     - Posts
   *     summary: Get a single post by the postId
   *     parameters:
   *      - name: postId
   *        in: path
   *        description: The id of the post
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Post'
   *       404:
   *         description: Post not found
   */
  app.get(
    "/post/:postId",
    [requireUser, validate(getPostSchema)],
    getPostHandler
  );
  app.post(
    "/post",
    [requireUser, havePermission(Roles.ADMIN), validate(createPostSchema)],
    createPostHandler
  );
  app.put(
    "/post/:postId",
    [requireUser, havePermission(Roles.ADMIN), validate(updatePostSchema)],
    updatePostHandler
  );
  app.delete(
    "/post/:postId",
    [requireUser, havePermission(Roles.ADMIN), validate(deletePostSchema)],
    deletePostHandler
  );
}

export default routes;
