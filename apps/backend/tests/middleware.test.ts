import { describe, it, expect, beforeAll } from "bun:test";
import { Hono } from "hono";
import {
  dbMiddleware,
  sanitizeMiddleware,
  type Env,
  type Variables,
} from "../src/middleware";
import type { ParticipantSelect, StaffSelect } from "../src/schema";

// テスト用のモックデータ
const mockParticipant: ParticipantSelect = {
  id: 1,
  lastNameKanji: "田中",
  firstNameKanji: "太郎",
  lastNameKana: "たなか",
  firstNameKana: "たろう",
  email: "test@example.com",
  displayName: "タロウ",
  prefecture: "東京都",
  freeText: "よろしくお願いします",
  isCancelled: false,
  isAccepted: true,
  createdAt: new Date("2025-01-01T00:00:00Z"),
  passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz", // 実際のハッシュ値の例
  updatedAt: new Date("2025-01-01T00:00:00Z"),
};

const mockStaff: StaffSelect = {
  id: 1,
  user: "admin",
  passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz", // 実際のハッシュ値の例
  createdAt: new Date("2025-01-01T00:00:00Z"),
  accessedAt: new Date("2025-01-01T00:00:00Z"),
};

const mockEnv: Env = {
  DATABASE_URL: "postgresql://test:test@localhost:5432/test",
};

describe("Middleware Tests", () => {
  describe("dbMiddleware", () => {
    it("should set database instance in context", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();

      // ミドルウェアとテスト用エンドポイントを追加
      app.use("*", dbMiddleware);
      app.get("/test", (c) => {
        const db = c.get("db");
        if (db) {
          return c.json({ success: true, hasDb: true });
        }
        return c.json({ success: false, hasDb: false });
      });

      const res = await app.request("/test", {}, mockEnv);
      const data = (await res.json()) as any;

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.hasDb).toBe(true);
    });

    it("should pass through requests correctly", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();

      app.use("*", dbMiddleware);
      app.get("/test", (c) => c.text("middleware passed"));

      const res = await app.request("/test", {}, mockEnv);

      expect(res.status).toBe(200);
      expect(await res.text()).toBe("middleware passed");
    });
  });

  describe("sanitizeMiddleware", () => {
    it("should set sanitization functions in context", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();
      app.use("*", sanitizeMiddleware);

      app.get("/test-functions", (c) => {
        const sanitizeParticipant = c.get("sanitizeParticipant");
        const sanitizeParticipants = c.get("sanitizeParticipants");
        const sanitizeStaff = c.get("sanitizeStaff");

        return c.json({
          hasSanitizeParticipant: typeof sanitizeParticipant === "function",
          hasSanitizeParticipants: typeof sanitizeParticipants === "function",
          hasSanitizeStaff: typeof sanitizeStaff === "function",
        });
      });

      const res = await app.request("/test-functions");
      const data = (await res.json()) as any;

      expect(res.status).toBe(200);
      expect(data.hasSanitizeParticipant).toBe(true);
      expect(data.hasSanitizeParticipants).toBe(true);
      expect(data.hasSanitizeStaff).toBe(true);
    });

    it("should sanitize participant data correctly", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();
      app.use("*", sanitizeMiddleware);

      app.get("/test-participant", (c) => {
        const sanitizeParticipant = c.get("sanitizeParticipant");
        const sanitized = sanitizeParticipant(mockParticipant);
        return c.json(sanitized);
      });

      const res = await app.request("/test-participant");
      const data = (await res.json()) as any;

      expect(res.status).toBe(200);
      expect(data).not.toHaveProperty("passwordHash");
      expect(data).toHaveProperty("id", mockParticipant.id);
      expect(data).toHaveProperty("email", mockParticipant.email);
      expect(data).toHaveProperty(
        "lastNameKanji",
        mockParticipant.lastNameKanji,
      );
      expect(data).toHaveProperty(
        "firstNameKanji",
        mockParticipant.firstNameKanji,
      );
    });

    it("should sanitize participants array correctly", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();
      app.use("*", sanitizeMiddleware);

      const participants = [
        mockParticipant,
        { ...mockParticipant, id: 2, email: "test2@example.com" },
      ];

      app.get("/test-participants", (c) => {
        const sanitizeParticipants = c.get("sanitizeParticipants");
        const sanitized = sanitizeParticipants(participants);
        return c.json(sanitized);
      });

      const res = await app.request("/test-participants");
      const data = (await res.json()) as any;

      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0]).not.toHaveProperty("passwordHash");
      expect(data[1]).not.toHaveProperty("passwordHash");
      expect(data[0]).toHaveProperty("id", 1);
      expect(data[1]).toHaveProperty("id", 2);
    });

    it("should sanitize staff data correctly", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();
      app.use("*", sanitizeMiddleware);

      app.get("/test-staff", (c) => {
        const sanitizeStaff = c.get("sanitizeStaff");
        const sanitized = sanitizeStaff(mockStaff);
        return c.json(sanitized);
      });

      const res = await app.request("/test-staff");
      const data = (await res.json()) as any;

      expect(res.status).toBe(200);
      expect(data).not.toHaveProperty("passwordHash");
      expect(data).toHaveProperty("id", mockStaff.id);
      expect(data).toHaveProperty("user", mockStaff.user);
      expect(data).toHaveProperty("createdAt");
      expect(data).toHaveProperty("accessedAt");
    });

    it("should handle empty participants array", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();
      app.use("*", sanitizeMiddleware);

      app.get("/test-empty", (c) => {
        const sanitizeParticipants = c.get("sanitizeParticipants");
        const sanitized = sanitizeParticipants([]);
        return c.json(sanitized);
      });

      const res = await app.request("/test-empty");
      const data = (await res.json()) as any;

      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    it("should pass through requests correctly", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();
      app.use("*", sanitizeMiddleware);

      app.get("/test-passthrough", (c) => c.text("sanitize middleware passed"));

      const res = await app.request("/test-passthrough");

      expect(res.status).toBe(200);
      expect(await res.text()).toBe("sanitize middleware passed");
    });
  });

  describe("Combined Middlewares", () => {
    it("should work together correctly", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();

      app.use("*", dbMiddleware);
      app.use("*", sanitizeMiddleware);

      app.get("/test-combined", (c) => {
        const db = c.get("db");
        const sanitizeParticipant = c.get("sanitizeParticipant");
        const sanitized = sanitizeParticipant(mockParticipant);

        return c.json({
          hasDb: !!db,
          sanitizedData: sanitized,
        });
      });

      const res = await app.request("/test-combined", {}, mockEnv);
      const data = (await res.json()) as any;

      expect(res.status).toBe(200);
      expect(data.hasDb).toBe(true);
      expect(data.sanitizedData).not.toHaveProperty("passwordHash");
      expect(data.sanitizedData).toHaveProperty("id", mockParticipant.id);
    });
  });

  describe("Type Safety Tests", () => {
    it("should maintain correct data structure after sanitization", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();
      app.use("*", sanitizeMiddleware);

      app.get("/test-types", (c) => {
        const sanitizeParticipant = c.get("sanitizeParticipant");
        const sanitized = sanitizeParticipant(mockParticipant);

        // TypeScriptの型安全性をテスト
        const keys = Object.keys(sanitized);
        const hasPasswordHash = "passwordHash" in sanitized;

        return c.json({
          keys,
          hasPasswordHash,
          keyCount: keys.length,
        });
      });

      const res = await app.request("/test-types");
      const data = (await res.json()) as any;

      expect(res.status).toBe(200);
      expect(data.hasPasswordHash).toBe(false);
      expect(data.keys).not.toContain("passwordHash");
      expect(data.keyCount).toBe(Object.keys(mockParticipant).length - 1); // passwordHashを除く
    });
  });

  describe("Error Handling", () => {
    it("should handle database connection errors gracefully", async () => {
      const app = new Hono<{ Bindings: Env; Variables: Variables }>();

      app.use("*", dbMiddleware);
      app.get("/test-error", (c) => {
        try {
          const db = c.get("db");
          return c.json({ success: true, hasDb: !!db });
        } catch (error) {
          return c.json(
            { success: false, error: "Database connection failed" },
            500,
          );
        }
      });

      // 無効なDATABASE_URLでテスト
      const invalidEnv = { DATABASE_URL: "invalid://connection/string" };

      const res = await app.request("/test-error", {}, invalidEnv);
      const data = (await res.json()) as any;

      // データベース接続自体は失敗するかもしれないが、ミドルウェアは通過するべき
      expect(res.status).toBe(200);
      expect(data).toHaveProperty("success");
    });
  });
});
