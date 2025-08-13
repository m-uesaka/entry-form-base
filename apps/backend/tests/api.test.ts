import { describe, it, expect } from "bun:test";
import app from "../src/index";

describe("API Basic Tests", () => {
  describe("GET /", () => {
    it("should return Hello Hono!", async () => {
      const res = await app.request(
        "/",
        {
          method: "GET",
        },
        {
          DATABASE_URL: "postgresql://test:test@localhost:5432/test",
        },
      );

      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("Hello Hono!");
    });
  });

  describe("POST /participants", () => {
    it("should return 400 for invalid email", async () => {
      const participantData = {
        email: "invalid-email",
        lastNameKanji: "田中",
        firstNameKanji: "太郎",
        lastNameKana: "たなか",
        firstNameKana: "たろう",
        password: "password123456789",
      };

      const res = await app.request(
        "/participants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(participantData),
        },
        {
          DATABASE_URL: "postgresql://test:test@localhost:5432/test",
        },
      );

      expect(res.status).toBe(400);
    });

    it("should return 400 for short password", async () => {
      const participantData = {
        email: "test@example.com",
        lastNameKanji: "田中",
        firstNameKanji: "太郎",
        lastNameKana: "たなか",
        firstNameKana: "たろう",
        password: "123",
      };

      const res = await app.request(
        "/participants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(participantData),
        },
        {
          DATABASE_URL: "postgresql://test:test@localhost:5432/test",
        },
      );

      expect(res.status).toBe(400);
    });
  });

  describe("POST /staff", () => {
    it("should return 400 for short password", async () => {
      const staffData = {
        user: "admin",
        password: "123",
      };

      const res = await app.request(
        "/staff",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(staffData),
        },
        {
          DATABASE_URL: "postgresql://test:test@localhost:5432/test",
        },
      );

      expect(res.status).toBe(400);
    });
  });

  describe("POST /staff/login", () => {
    it("should return 400 for missing credentials", async () => {
      const res = await app.request(
        "/staff/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: "admin",
          }),
        },
        {
          DATABASE_URL: "postgresql://test:test@localhost:5432/test",
        },
      );

      expect(res.status).toBe(400);
      const data = (await res.json()) as any;
      expect(data.error).toBe("User and password are required");
    });
  });

  describe("POST /participants/login", () => {
    it("should return 400 for missing credentials", async () => {
      const res = await app.request(
        "/participants/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
          }),
        },
        {
          DATABASE_URL: "postgresql://test:test@localhost:5432/test",
        },
      );

      expect(res.status).toBe(400);
      const data = (await res.json()) as any;
      expect(data.error).toBe("Email and password are required");
    });
  });
});
