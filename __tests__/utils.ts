import loanRoutes from "@/routes/loan.routes";
import userRoutes from "@/routes/user.routes";
import express from "express";

export const SET_TIMEOUT = 30_000;

export const API = {
  register: "/api/register",
  login: "/api/login",
  newLoan: "/api/loan/new/user",
} as const;

const app = express();
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", loanRoutes);

export { app };

export function addMonths(time: Date, months: number): Date {
  return new Date(time.setMonth(time.getMonth() + months));
}

export function subtractMonths(time: Date, months: number): Date {
  return new Date(time.setMonth(time.getMonth() - months));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
