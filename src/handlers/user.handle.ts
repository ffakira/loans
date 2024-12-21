import { generateToken } from "@/lib/utils";
import {
  createUser,
  loginSchema,
  loginUserByProvider,
  registerSchema,
} from "@/services/user.service";
import { Request, Response } from "express";
import { z } from "zod";

type CreateUserHandleRequest = Request<
  unknown,
  unknown,
  z.infer<typeof registerSchema>
>;

export async function createUserHandle(
  req: CreateUserHandleRequest,
  res: Response,
) {
  const input = registerSchema.safeParse(req.body);

  if (!input.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid input",
    });
  }

  try {
    const response = await createUser(input.data);
    return res.status(response.code).json(response);
  } catch (err) {
    console.error("[error@/api/register]: error registering a user", err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Error creating user",
    });
  }
}

type LoginUserByProviderHandleRequest = Request<
  unknown,
  unknown,
  z.infer<typeof loginSchema>
>;

export async function loginUserByProviderHandle(
  req: LoginUserByProviderHandleRequest,
  res: Response,
) {
  const input = loginSchema.safeParse(req.body);

  if (!input.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid input",
    });
  }

  try {
    const response = await loginUserByProvider(input.data);

    if (response.status === "ok") {
      const token = generateToken(response.data);
      return res.status(response.code).json({ ...response, token });
    } else {
      return res.status(response.code).json(response);
    }
  } catch (err) {
    console.error("[error@/api/login]: error logging in user", err);
  }
}
