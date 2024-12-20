import { verifyToken } from "@/lib/utils";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];
  const verify = verifyToken(token);

  if (!verify) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unauthorized",
    });
  }

  next();
}
