import request from "supertest";
import express from "express";
import userRoutes from "./user.routes";

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

const SET_TIMEOUT = 30_000;
const API = {
  register: "/api/register",
  login: "/api/login",
} as const;

jest.mock('../lib/utils', () => ({
  ...jest.requireActual('../lib/utils'),
  generateToken: jest.fn(() => 'mocked-jwt-token'),
  verifyToken: jest.fn(() => 'mocked-jwt-token'),
}));

describe(`User routes for ${API.register}`, () => {
  jest.setTimeout(SET_TIMEOUT);

  /**
   * @dev suppress console.error output
   */
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = jest.fn();
  });

  it("should create a new user", async () => {
    const response = await request(app)
      .post(API.register)
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: "ok",
      code: 201,
      message: "User created",
    });
  });

  it("should return a validation error for invalid input", async () => {
    const response = await request(app)
      .post(API.register)
      .send({
        firstName: "",
        lastName: "Doe",
        email: "invalid-email",
        password: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: 400,
      message: "Invalid input",
    });
  });

  it("should return a duplicate key error for existing email", async () => {
    await request(app)
      .post(API.register)
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

    const response = await request(app)
      .post(API.register)
      .send({
        firstName: "Jane",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      status: "error",
      code: 409,
      message: "Email already exists",
    });
  });

  it("should return validation error, for invalid input", async () => {
    const response = await request(app)
      .post(API.register)
      .send({
        firstName: "",
        lastName: "Doe",
        email: "invalid-email",
        password: "123",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: 400,
      message: "Invalid input",
    });
  });

  it("should return a dupkey error for email field", async () => {
    await request(app)
      .post(API.register)
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "email@example.com",
        password: "password123",
    });

    const response = await request(app)
      .post(API.register)
      .send({
        firstName: "Jane",
        lastName: "Doe",
        email: "email@example.com",
        password: "password123",
      });
    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      status: "error",
      code: 409,
      message: "Email already exists",
    });
  });
});

describe(`User routes for ${API.login}`, () => {
  jest.setTimeout(SET_TIMEOUT);

  beforeEach(async () => {
    console.error = jest.fn();

    await request(app)
      .post(API.register)
      .send({
        firstName: "James",
        lastName: "Bond",
        email: "james.bond@email.com",
        password: "supersecretmission007",
      });
  });

  afterEach(() => {
    console.error = jest.fn();
  })

  it("should login successfully", async () => {
    const response = await request(app)
      .post(API.login)
      .send({
        provider: "email",
        email: "james.bond@email.com",
        password: "supersecretmission007",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "ok",
        code: 200,
        message: "User logged in",
        data: {
          email: "james.bond@email.com",
          firstName: "James",
          lastName: "Bond",
          isVerified: false,
        }
      })
    );
    expect(response.body.token).toBe("mocked-jwt-token");
  });

  it("should return an error for invalid input", async () => {
    const response = await request(app)
      .post(API.login)
      .send({
        provider: "google",
        email: "",
        password: "",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: 400,
      message: "Invalid input",
    });
  });

  it("should return an error for invalid email or password", async () => {
    const response = await request(app)
      .post(API.login)
      .send({
        provider: "email",
        email: "james.bond@example.com",
        password: "missionfailed007"
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: "error",
      code: 401,
      message: "Invalid email or password",
    });
  });
});
