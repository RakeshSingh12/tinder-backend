const request = require("supertest");

// Mock external services to avoid initialization errors when env vars are missing
jest.mock("../utils/razorpay", () => ({}));
jest.mock("../utils/sesClient", () => ({ sesClient: { send: jest.fn() } }));
jest.mock("../utils/cornJob", () => ({
  schedulePendingRequestsJob: jest.fn(),
}));

const app = require("../app");

describe("Health Check", () => {
  test("GET /health should return 200 OK", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("OK");
  });
});
