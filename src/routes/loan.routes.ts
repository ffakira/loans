import { Router } from "express";
import {
  createNewLoanHandle,
  getLoanByUserIdHandle,
} from "@/handlers/loan.handle";

const router = Router();

router.post("/new/user/:userId", createNewLoanHandle);
router.get("/user/:userId", getLoanByUserIdHandle);

export default router;
