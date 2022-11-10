import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/User.schema";
import { createUser } from "../service/User.service";
import logger from "../utils/logger";

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
