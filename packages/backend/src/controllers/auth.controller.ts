import { NextFunction, Request, Response } from "express";
import pkg from "@prisma/client";
const { Prisma } = pkg;
import AuthService from "../services/Auth.service.js";
import { logger } from "../logger.js";

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
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        logger.info(
          "There is a unique constraint violation, a new user cannot be created with this email."
        );

        return res.status(400).json({ message: "UNIQUE CONSTRAINT VIOLATION" });
      }
    } else if (error instanceof Error) {
      return next(error);
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
      return next(error);
    }
  }
}
