import request from "supertest";
import type { Types } from "mongoose";

import {
  app,
  SET_TIMEOUT,
  API,
  addMonths,
  formatDate,
  subtractMonths,
} from "@tests/utils";
import User from "@/schemas/user.schema";

jest.mock("../src/lib/utils", () => ({
  ...jest.requireActual("../src/lib/utils"),
  generateToken: jest.fn(() => "mocked-jwt-token"),
}));

describe(`Loan routes for ${API.newLoan}`, () => {
  jest.setTimeout(SET_TIMEOUT);
  let userId: Types.ObjectId | undefined;

  beforeAll(async () => {
    console.error = jest.fn();

    await request(app).post(API.register).send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    const user = await User.findOne({ email: "john.doe@example.com" });
    userId = user?._id;

    expect(userId).toBeDefined();
  });

  afterAll(() => {
    console.error = jest.fn();
  });

  it("should create a new loan", async () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getDate() + 1);
    const now = formatDate(currentDate);
    const future = formatDate(new Date(addMonths(currentDate, 24)));

    const response = await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 24,
      principalAmount: 5000,
      interestRate: 5,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "ok",
        code: 201,
        message: "Loan created successfully",
        data: expect.objectContaining({
          userId: userId!.toString(),
          principalAmount: 5000 * 100,
          interestRate: 5 * 100,
          durationMonths: 24,
          status: "pending",
        }),
      }),
    );
  });

  it("should fail to create a new loan with pending status", async () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getDate() + 1);
    const now = formatDate(currentDate);
    const future = formatDate(new Date(addMonths(currentDate, 24)));

    await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 24,
      principalAmount: 5000,
      interestRate: 5,
    });

    const response = await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 24,
      principalAmount: 5000,
      interestRate: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: 400,
      message: "User already has a pending loan",
    });
  });

  it("should fail to create a new loan with invalid dates", async () => {
    const currentDate = new Date();
    const now = formatDate(subtractMonths(currentDate, 3));
    const future = formatDate(addMonths(currentDate, 6));

    const response = await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 24,
      principalAmount: 5000,
      interestRate: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: 400,
      message: ["Start date cannot be in the past"],
    });
  });

  it("should fail to create a new loan below or above the principal amount limits", async () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getDate() + 1);
    const now = formatDate(currentDate);
    const future = formatDate(new Date(addMonths(currentDate, 24)));

    const response = await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 24,
      principalAmount: 4999,
      interestRate: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: 400,
      message: ["Principal amount must be greater than 5000"],
    });

    const response2 = await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 24,
      principalAmount: 1_000_001,
      interestRate: 5,
    });

    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({
      status: "error",
      code: 400,
      message: ["Principal amount cannot exceed 1_000_000"],
    });
  });

  it("should fail to create a new loan below or above the interest rate limits", async () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getDate() + 1);
    const now = formatDate(currentDate);
    const future = formatDate(new Date(addMonths(currentDate, 24)));

    const response = await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 24,
      principalAmount: 5000,
      interestRate: 4,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: 400,
      message: ["Interest rate must be at least 5%"],
    });

    const response2 = await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 24,
      principalAmount: 5000,
      interestRate: 37,
    });

    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({
      status: "error",
      code: 400,
      message: ["Interest rate must be at most 36%"],
    });
  });

  it("should fail to create a new loan below or above the duration limits", async () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getDate() + 1);
    const now = formatDate(currentDate);
    const future = formatDate(new Date(addMonths(currentDate, 24)));

    const response = await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 5,
      principalAmount: 5000,
      interestRate: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: 400,
      message: ["Duration must be at least 6 months"],
    });

    const response2 = await request(app).post(`${API.newLoan}/${userId}`).send({
      startDate: now,
      endDate: future,
      durationMonths: 61,
      principalAmount: 5000,
      interestRate: 5,
    });

    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({
      status: "error",
      code: 400,
      message: ["Duration must be at most 60 months"],
    });
  });
});
