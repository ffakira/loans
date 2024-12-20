import {
  createNewLoan,
  getLoansByUserId,
  loanSchema,
} from "@/services/loan.service";
import type { Request, Response } from "express";
import { z } from "zod";

type NewLoanUserHandleRequest = Request<
  { userId: string },
  unknown,
  Omit<z.infer<typeof loanSchema>, "userId">
>;

export async function createNewLoanHandle(
  req: NewLoanUserHandleRequest,
  res: Response,
) {
  const { userId } = req.params;
  let { startDate, endDate } = req.body;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const input = loanSchema.safeParse({
    ...req.body,
    userId,
    startDate,
    endDate,
  });

  if (!input.success) {
    const errorMessages = input.error.errors.map((error) => error.message);
    return res.status(400).json({
      status: "error",
      code: 400,
      message: errorMessages,
    });
  }

  try {
    const response = await createNewLoan(input.data);
    return res.status(response.code).json(response);
  } catch (err) {
    console.error("[error@/api/loan/new]: error creating a loan", err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Error creating loan",
    });
  }
}

type GetLoanByUserIdRequest = Request<{ userId: string }, unknown, unknown>;

export async function getLoanByUserIdHandle(
  req: GetLoanByUserIdRequest,
  res: Response,
) {
  const { userId } = req.params;

  /** @dev this should not occur since the route doesn't exist */
  if (!userId) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid input",
    });
  }

  try {
    const response = await getLoansByUserId(userId);
    return res.status(response.code).json(response);
  } catch (err) {
    console.error("[error@/api/loan]: error fetching loans", err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Error fetching loans",
    });
  }
}
