import { Router, type Request, type Response } from "express";
import {
  createUser,
  loginSchema,
  loginUserByProvider,
  registerSchema,
} from "@/services/user.service";
import { generateToken } from "@/lib/utils";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
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
});

router.post("/login", async (req: Request, res: Response) => {
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
});

export default router;
