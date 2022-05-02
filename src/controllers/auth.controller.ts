import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { Prisma } from "@prisma/client";
import AuthService from "../services/Auth.service";
import { logger } from "../logger";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  try {
    const user = await AuthService.register({
      email: email,
      password: password,
    });

    return res.send({
      status: true,
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        logger.info(
          "There is a unique constraint violation, a new user cannot be created with this email."
        );

        return res.status(400).json({ message: "UNIQUE CONSTRAINT VIOLATION" });
      } else if (error instanceof Error) {
        return next(createError(error.message));
      }
    }
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  try {
    const data = await AuthService.login({ email: email, password: password });

    return res.send({
      status: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(createError(error.message));
    }
  }
}
