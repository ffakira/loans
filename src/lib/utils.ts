import argon2 from "argon2";
import jwt from "jsonwebtoken";

export async function hashPassword(password: string): Promise<string | null> {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    console.error("[error@hashPassword]:", (err as Error).message);
    return null;
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const result = await argon2.verify(hash, password);
    return result;
  } catch (err) {
    console.error("[error@verifyPassword]:", (err as Error).message);
    return false;
  }
}

export function generateToken(payload: string | object | Buffer): string | null {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" });
}

export function verifyToken(token: string): string | object | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      console.error("[error@verifyToken]:", (err as Error).message);
      return null;
    } 
}
