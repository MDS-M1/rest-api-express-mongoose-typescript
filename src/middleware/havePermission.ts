import { Request, Response, NextFunction } from "express";

export enum Roles {
  ADMIN = "admin",
  USER = "user",
}

const havePermission =
  (roles: Roles[] | Roles = Roles.USER) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    const hasPermission = Array.isArray(roles)
      ? Object.values(roles).some((v) => v === user.role)
      : user.role === roles;

    if (!hasPermission) {
      return res.sendStatus(403);
    }

    return next();
  };

export default havePermission;
