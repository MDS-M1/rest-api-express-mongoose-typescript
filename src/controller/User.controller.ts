import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/User.schema";
import { createUser, findUsers } from "../service/User.service";
import logger from "../utils/logger";

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
    return res.send(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
