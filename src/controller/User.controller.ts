import { Request, Response } from "express";
import { registerCreateSession } from "./Session.controller";
import { CreateUserInput } from "../schema/User.schema";
import { createUser, findUsers } from "../service/User.service";
import logger from "../utils/logger";
import { UserDocument } from "../models/User.model";

export async function getUsersHandler(req: Request, res: Response) {
  const users = await findUsers();

  if (!users || users.length === 0) {
    return res.sendStatus(404);
  }

  return res.send(users);
}

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    const userTokens = await registerCreateSession(req, user as UserDocument);
    return res.send({ ...user, ...userTokens });
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
