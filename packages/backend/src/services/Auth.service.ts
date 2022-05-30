import prisma from "../prismaClient";
import bcrypt from "bcryptjs";
import createError from "http-errors";
import { signToken } from "../shared/jwt";

class AuthService {
  public async register({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name?: string;
  }) {
    const hashedPassword = bcrypt.hashSync(password);

    const user = await prisma.user.create({
      data: { email: email, password: hashedPassword, name: name },
    });

    const accessToken = await signToken(user);

    return {
      email: user.email,
      userId: user.id,
      name: user.name,
      accessToken: accessToken,
    };
  }

  public async login({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user || !user.password) {
      throw new createError.NotFound("User not registered.");
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new createError.Unauthorized(
        "Email address or password not valid."
      );
    }

    const accessToken = await signToken(user);

    return {
      email: user.email,
      userId: user.id,
      name: user.name,
      accessToken: accessToken,
    };
  }
}

export default new AuthService();
