import { Router } from "express";
import {
  createUserHandle,
  loginUserByProviderHandle,
} from "@/handlers/user.handle";

const router = Router();

router.post("/register", createUserHandle);
router.post("/login", loginUserByProviderHandle);

export default router;
