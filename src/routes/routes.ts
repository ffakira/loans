import { Router } from "express";
import userRoutes from "@/routes/user.routes";
import loanRoutes from "@/routes/loan.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/loan", loanRoutes);

export default router;
