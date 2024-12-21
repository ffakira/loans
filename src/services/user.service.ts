import z from "zod";
import mongoose from "mongoose";
import User from "@/schemas/user.schema";
import { hashPassword, verifyPassword } from "@/lib/utils";

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
});

export async function createUser(raw: z.infer<typeof registerSchema>) {
  const input = registerSchema.safeParse(raw);

  if (!input.success) {
    return {
      status: "error",
      code: 400,
      message: "Invalid input",
    } as const;
  }

  try {
    const data = input.data;
    const hash = await hashPassword(data.password);

    if (!hash) {
      return {
        status: "error",
        code: 500,
        message: "Error hashing password",
      } as const;
    }

    data.password = hash;
    const user = new User(data);
    await user.save();

    return {
      status: "ok",
      code: 201,
      message: "User created",
    } as const;
  } catch (err) {
    /** @dev verify dup key for email */
    if ((err as Error & { code: number }).code === 11000) {
      console.error(
        `[error@createUser]: Error creating user, params: [${raw}]`,
        err,
      );
      return {
        status: "error",
        code: 409,
        message: "Email already exists",
      } as const;
    }

    /** @dev verify mongoose schema validations */
    if (err instanceof mongoose.Error.ValidationError) {
      console.error(
        `[error@createUser]: Error creating user, params: [${raw}]`,
        err,
      );
      return {
        status: "error",
        code: 400,
        message: "Invalid input",
      } as const;
    }

    /** @dev general error that have not been caught*/
    if (err instanceof mongoose.Error) {
      console.error(
        `[error@createUser]: Error creating user, params: [${raw}]`,
        err,
      );
      return {
        status: "error",
        code: 500,
        message: "Error creating user",
      } as const;
    } else {
      console.error(
        `[error@createUser]: Error creating user, params: [${raw}]`,
        err,
      );
      return {
        status: "error",
        code: 500,
        message: "Error creating user",
      } as const;
    }
  }
}

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
  provider: z.enum(["email"]),
});

export const userSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  isVerified: z.boolean(),
});

export async function loginUserByProvider(raw: z.infer<typeof loginSchema>) {
  const input = loginSchema.safeParse(raw);

  if (!input.success) {
    return {
      status: "error",
      code: 400,
      message: "Invalid input",
    } as const;
  }

  try {
    const data = input.data;

    switch (data.provider) {
      case "email": {
        const user = await User.findOne({ email: data.email }).populate([
          "email",
          "firstName",
          "lastName",
          "isVerified",
        ]);
        if (!user) {
          return {
            status: "error",
            code: 401,
            message: "Invalid email or password",
          } as const;
        }

        const isValid = await verifyPassword(data.password, user.password);

        let userObj = user.toObject() as z.infer<typeof userSchema>;
        userObj = {
          email: userObj.email,
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          isVerified: userObj.isVerified,
        };

        if (!isValid) {
          return {
            status: "error",
            code: 401,
            message: "Invalid email or password",
          } as const;
        }

        return {
          status: "ok",
          code: 200,
          message: "User logged in",
          data: userObj,
        } as const;
      }

      default: {
        return {
          status: "error",
          code: 400,
          message: "Invalid provider",
        } as const;
      }
    }
  } catch (err) {
    console.error(
      `[error@loginUserByProvider]: Error logging in user, params: [${raw}]`,
      err,
    );
    if (err instanceof mongoose.Error.ValidationError) {
      return {
        status: "error",
        code: 400,
        message: "Invalid input",
      } as const;
    }

    if (err instanceof mongoose.Error) {
      return {
        status: "error",
        code: 500,
        message: "Error logging in user",
      } as const;
    }

    return {
      status: "error",
      code: 500,
      message: "Error logging in user",
    } as const;
  }
}
