import { describe, it, expect } from "bun:test";

describe("Validation Tests", () => {
  describe("Email validation", () => {
    it("should validate email format", () => {
      const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("Password validation", () => {
    it("should validate password length", () => {
      const validatePassword = (password: string): boolean => {
        return typeof password === "string" && password.length >= 10;
      };

      expect(validatePassword("password123456")).toBe(true);
      expect(validatePassword("123")).toBe(false);
      expect(validatePassword("")).toBe(false);
    });
  });
});
