import { NextFunction, Request, Response } from "express";
import UserSession from "../types/UserSession";

const userRequired = (req: Request, res: Response, next: NextFunction) => {
  if ((req.session as UserSession).user) {
    next();
  } else {
    res.sendStatus(403);
  }
}

export default userRequired;
