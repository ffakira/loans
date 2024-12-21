import argon2 from "argon2";
import jwt from "jsonwebtoken";
import z from "zod";

export async function hashPassword(password: string): Promise<string | null> {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    console.error("[error@hashPassword]:", (err as Error).message);
    return null;
  }
}

export const verifyPasswordSchema = z.object({
  password: z.string(),
  hash: z.string(),
});

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    const result = await argon2.verify(hash, password);
    return result;
  } catch (err) {
    console.error("[error@verifyPassword]:", (err as Error).message);
    return false;
  }
}

export function generateToken(
  payload: string | object | Buffer,
): string | null {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string) {
  try {
    const jwtToken = jwt.verify(token, process.env.JWT_SECRET as string);
    return {
      status: "ok",
      code: 200,
      data: jwtToken,
    } as const;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.error("[error@verifyToken]: Token has expired");
      return {
        status: "error",
        code: 401,
        message: "Token has expired",
      } as const;
    } else if (err instanceof jwt.JsonWebTokenError) {
      console.error("[error@verifyToken]: Invalid token");
      return {
        status: "error",
        code: 401,
        message: "Invalid token",
      } as const;
    }
    console.error("[error@verifyToken]:", (err as Error).message);
    return {
      status: "error",
      code: 500,
      message: "Internal server error",
    } as const;
  }
}
