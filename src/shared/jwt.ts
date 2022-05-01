import jwt from "jsonwebtoken";
import createError from "http-errors";

const jwtSecret = process.env.JWT_SECRET ?? "";

export async function signToken(payload: string | object | Buffer) {
  const signedToken = jwt.sign({ payload }, jwtSecret);

  if (!signedToken) {
    throw new createError.InternalServerError();
  }

  return signedToken;
}

export async function verifyToken(token: string) {
  const result = await jwt.verify(token, jwtSecret, { complete: true });

  if (!result) {
    throw new createError.Unauthorized();
  }

  return result;
}
