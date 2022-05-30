import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { verifyToken } from "../shared/jwt";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (
    req.path === "/register" ||
    req.path === "/login" ||
    req.path === "/health"
  ) {
    return next();
  }

  if (!req.headers.authorization) {
    return next(new createError.Unauthorized("Auth header required."));
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new createError.Unauthorized("Access token required."));
  }

  try {
    const result = await verifyToken(token);

    //TODO fix type casting
    const { payload } = result.payload as {
      payload: {
        id: number;
        email: string;
        name: string | null;
        password: string;
      };
    };

    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new createError.Unauthorized(error.message));
    }
  }
}
