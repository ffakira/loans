import z from "zod";
import Loan from "@/schemas/loan.schema";

/**
 * @dev `principalAmount` is base in cents
 * @dev `interestRate` is in percentage base in 100
 * e.g.: 5% => 50
 */
export const loanSchema = z
  .object({
    userId: z.string(),
    principalAmount: z
      .number()
      .min(5000, { message: "Principal amount must be greater than 5000" })
      .max(1_000_000, { message: "Principal amount cannot exceed 1_000_000" }),
    interestRate: z
      .number()
      .min(5, { message: "Interest rate must be at least 5%" })
      .max(36, { message: "Interest rate must be at most 36%" }),
    durationMonths: z
      .number()
      .min(6, { message: "Duration must be at least 6 months" })
      .max(60, { message: "Duration must be at most 60 months" }),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.startDate > new Date(), {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  });

export async function createNewLoan(raw: z.infer<typeof loanSchema>) {
  const input = loanSchema.safeParse(raw);

  if (!input.success) {
    const errorMessages = input.error.errors.map((error) => error.message);
    return {
      status: "error",
      code: 400,
      message: errorMessages,
    } as const;
  }

  try {
    const loanData = input.data;
    const existingLoan = await Loan.findOne({
      userId: loanData.userId,
      status: "pending",
    });
    if (existingLoan) {
      return {
        status: "error",
        code: 400,
        message: "User already has a pending loan",
      } as const;
    }

    if (loanData.startDate > loanData.endDate) {
      return {
        status: "error",
        code: 400,
        message: "Start date cannot be greater than end date",
      } as const;
    }

    // Calculate to base 100
    const principalAmount = loanData.principalAmount * 100;
    const interestRate = loanData.interestRate * 100;

    const newLoan = new Loan({
      ...loanData,
      principalAmount,
      interestRate,
    });
    await newLoan.save();

    return {
      status: "ok",
      code: 201,
      message: "Loan created successfully",
      data: newLoan,
    } as const;
  } catch (err) {
    console.error(
      `[error@createNewLoan]: Error creating loan, params: [${raw}]`,
      err,
    );
    return {
      status: "error",
      code: 500,
      message: "Error creating loan",
    } as const;
  }
}

export async function getLoansByUserId(userId: string) {
  if (!userId) {
    return {
      status: "error",
      code: 400,
      message: "Invalid input",
    } as const;
  }

  try {
    const loans = await Loan.find({ userId });
    return {
      status: "ok",
      code: 200,
      message: "Loans retrieved successfully",
      data: loans,
    } as const;
  } catch (err) {
    console.error(
      `[error@getLoansByUserId]: Error retrieving loans, params: [${userId}]`,
      err,
    );
    return {
      status: "error",
      code: 500,
      message: "Error retrieving loans",
    } as const;
  }
}
