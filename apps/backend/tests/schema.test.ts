import { describe, it, expect } from "bun:test";
import {
  participantsTable,
  staffTable,
  type ParticipantInsert,
  type ParticipantSelect,
  type StaffInsert,
  type StaffSelect,
} from "../src/schema";

describe("Schema Types", () => {
  describe("participantsTable", () => {
    it("should be defined", () => {
      expect(participantsTable).toBeDefined();
    });

    it("should work with valid participant data", () => {
      const participantData: ParticipantInsert = {
        lastNameKanji: "田中",
        firstNameKanji: "太郎",
        lastNameKana: "たなか",
        firstNameKana: "たろう",
        email: "test@example.com",
        passwordHash: "hashedpassword",
      };

      expect(participantData.lastNameKanji).toBe("田中");
      expect(participantData.email).toBe("test@example.com");
    });
  });

  describe("staffTable", () => {
    it("should be defined", () => {
      expect(staffTable).toBeDefined();
    });

    it("should work with valid staff data", () => {
      const staffData: StaffInsert = {
        user: "admin",
        passwordHash: "hashedpassword",
      };

      expect(staffData.user).toBe("admin");
      expect(staffData.passwordHash).toBe("hashedpassword");
    });
  });

  describe("Type inference", () => {
    it("should correctly infer ParticipantInsert type", () => {
      const participantData: ParticipantInsert = {
        lastNameKanji: "田中",
        firstNameKanji: "太郎",
        lastNameKana: "たなか",
        firstNameKana: "たろう",
        email: "test@example.com",
        passwordHash: "hashedpassword",
      };

      expect(participantData.lastNameKanji).toBe("田中");
      expect(participantData.email).toBe("test@example.com");
    });

    it("should correctly infer ParticipantSelect type", () => {
      const participantData: ParticipantSelect = {
        id: 1,
        lastNameKanji: "田中",
        firstNameKanji: "太郎",
        lastNameKana: "たなか",
        firstNameKana: "たろう",
        email: "test@example.com",
        displayName: null,
        prefecture: null,
        freeText: null,
        isCancelled: false,
        isAccepted: false,
        createdAt: new Date(),
        passwordHash: "hashedpassword",
        updatedAt: new Date(),
      };

      expect(participantData.id).toBe(1);
      expect(participantData.isCancelled).toBe(false);
    });

    it("should correctly infer StaffInsert type", () => {
      const staffData: StaffInsert = {
        user: "admin",
        passwordHash: "hashedpassword",
      };

      expect(staffData.user).toBe("admin");
      expect(staffData.passwordHash).toBe("hashedpassword");
    });

    it("should correctly infer StaffSelect type", () => {
      const staffData: StaffSelect = {
        id: 1,
        user: "admin",
        passwordHash: "hashedpassword",
        createdAt: new Date(),
        accessedAt: new Date(),
      };

      expect(staffData.id).toBe(1);
      expect(staffData.user).toBe("admin");
    });
  });
});
