import { describe, it, expect } from "bun:test";
import {
  validateParticipantForm,
  validateField,
} from "../../src/utils/validation";
import type { NewParticipantFormData } from "../../src/types/form";

describe("validateParticipantForm", () => {
  const validFormData: NewParticipantFormData = {
    lastNameKanji: "山田",
    firstNameKanji: "太郎",
    lastNameKana: "やまだ",
    firstNameKana: "たろう",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("有効なフォームデータでエラーが返らないこと", () => {
    const errors = validateParticipantForm(validFormData);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  describe("必須フィールドのバリデーション", () => {
    it("名字（漢字）が空の場合、エラーが返ること", () => {
      const formData = { ...validFormData, lastNameKanji: "" };
      const errors = validateParticipantForm(formData);
      expect(errors.lastNameKanji).toBe("名字（漢字）は必須です");
    });

    it("名字（漢字）がスペースのみの場合、エラーが返ること", () => {
      const formData = { ...validFormData, lastNameKanji: "   " };
      const errors = validateParticipantForm(formData);
      expect(errors.lastNameKanji).toBe("名字（漢字）は必須です");
    });

    it("名前（漢字）が空の場合、エラーが返ること", () => {
      const formData = { ...validFormData, firstNameKanji: "" };
      const errors = validateParticipantForm(formData);
      expect(errors.firstNameKanji).toBe("名前（漢字）は必須です");
    });

    it("名前（漢字）がスペースのみの場合、エラーが返ること", () => {
      const formData = { ...validFormData, firstNameKanji: "   " };
      const errors = validateParticipantForm(formData);
      expect(errors.firstNameKanji).toBe("名前（漢字）は必須です");
    });

    it("名字（ふりがな）が空の場合、エラーが返ること", () => {
      const formData = { ...validFormData, lastNameKana: "" };
      const errors = validateParticipantForm(formData);
      expect(errors.lastNameKana).toBe("名字（ふりがな）は必須です");
    });

    it("名前（ふりがな）が空の場合、エラーが返ること", () => {
      const formData = { ...validFormData, firstNameKana: "" };
      const errors = validateParticipantForm(formData);
      expect(errors.firstNameKana).toBe("名前（ふりがな）は必須です");
    });

    it("メールアドレスが空の場合、エラーが返ること", () => {
      const formData = { ...validFormData, email: "" };
      const errors = validateParticipantForm(formData);
      expect(errors.email).toBe("メールアドレスは必須です");
    });

    it("パスワードが空の場合、エラーが返ること", () => {
      const formData = { ...validFormData, password: "" };
      const errors = validateParticipantForm(formData);
      expect(errors.password).toBe("パスワードは必須です");
    });

    it("パスワード確認が空の場合、エラーが返ること", () => {
      const formData = { ...validFormData, confirmPassword: "" };
      const errors = validateParticipantForm(formData);
      expect(errors.confirmPassword).toBe("パスワード確認は必須です");
    });
  });

  describe("メールアドレスのバリデーション", () => {
    it("無効なメールアドレス形式の場合、エラーが返ること", () => {
      const invalidEmails = [
        "invalid-email",
        "@example.com",
        "test@",
        "test@example",
        "test.example.com",
        "test@.com",
        "test@com",
        "",
      ];

      invalidEmails.forEach((email) => {
        const formData = { ...validFormData, email };
        const errors = validateParticipantForm(formData);
        if (email === "") {
          expect(errors.email).toBe("メールアドレスは必須です");
        } else {
          expect(errors.email).toBe("有効なメールアドレスを入力してください");
        }
      });
    });

    it("有効なメールアドレス形式の場合、エラーが返らないこと", () => {
      const validEmails = [
        "test@example.com",
        "user.name@example.co.jp",
        "test123@test-domain.com",
        "a@b.co",
      ];

      validEmails.forEach((email) => {
        const formData = { ...validFormData, email };
        const errors = validateParticipantForm(formData);
        expect(errors.email).toBeUndefined();
      });
    });
  });

  describe("パスワードのバリデーション", () => {
    it("パスワードが10文字未満の場合、エラーが返ること", () => {
      const shortPasswords = ["123456789", "short", "a"];

      shortPasswords.forEach((password) => {
        const formData = {
          ...validFormData,
          password,
          confirmPassword: password,
        };
        const errors = validateParticipantForm(formData);
        expect(errors.password).toBe(
          "パスワードは10文字以上で入力してください",
        );
      });
    });

    it("パスワードが10文字以上の場合、パスワード長のエラーが返らないこと", () => {
      const validPasswords = [
        "1234567890",
        "verylongpassword",
        "password123456",
      ];

      validPasswords.forEach((password) => {
        const formData = {
          ...validFormData,
          password,
          confirmPassword: password,
        };
        const errors = validateParticipantForm(formData);
        expect(errors.password).toBeUndefined();
      });
    });

    it("パスワードと確認用パスワードが一致しない場合、エラーが返ること", () => {
      const formData = {
        ...validFormData,
        password: "password123",
        confirmPassword: "different123",
      };
      const errors = validateParticipantForm(formData);
      expect(errors.confirmPassword).toBe("パスワードが一致しません");
    });

    it("パスワードと確認用パスワードが一致する場合、エラーが返らないこと", () => {
      const formData = {
        ...validFormData,
        password: "password123",
        confirmPassword: "password123",
      };
      const errors = validateParticipantForm(formData);
      expect(errors.confirmPassword).toBeUndefined();
    });
  });

  describe("ひらがなのバリデーション", () => {
    it("名字（ふりがな）がひらがな以外の場合、エラーが返ること", () => {
      const invalidKana = [
        "ヤマダ",
        "yamada",
        "YAMADA",
        "山田",
        "123",
        "やまだカタカナ",
      ];

      invalidKana.forEach((lastNameKana) => {
        const formData = { ...validFormData, lastNameKana };
        const errors = validateParticipantForm(formData);
        expect(errors.lastNameKana).toBe("ひらがなで入力してください");
      });
    });

    it("名前（ふりがな）がひらがな以外の場合、エラーが返ること", () => {
      const invalidKana = [
        "タロウ",
        "tarou",
        "TAROU",
        "太郎",
        "123",
        "たろうカタカナ",
      ];

      invalidKana.forEach((firstNameKana) => {
        const formData = { ...validFormData, firstNameKana };
        const errors = validateParticipantForm(formData);
        expect(errors.firstNameKana).toBe("ひらがなで入力してください");
      });
    });

    it("ひらがなと長音符（ー）の場合、エラーが返らないこと", () => {
      const validKana = ["やまだ", "たろう", "あー", "いーうー", "すー"];

      validKana.forEach((kana) => {
        const formData = {
          ...validFormData,
          lastNameKana: kana,
          firstNameKana: kana,
        };
        const errors = validateParticipantForm(formData);
        expect(errors.lastNameKana).toBeUndefined();
        expect(errors.firstNameKana).toBeUndefined();
      });
    });
  });

  describe("複数エラーの場合", () => {
    it("複数のフィールドにエラーがある場合、すべてのエラーが返ること", () => {
      const invalidFormData: NewParticipantFormData = {
        lastNameKanji: "",
        firstNameKanji: "",
        lastNameKana: "ヤマダ", // カタカナ
        firstNameKana: "",
        email: "invalid-email",
        displayName: "",
        prefecture: "",
        freeText: "",
        password: "short", // 10文字未満
        confirmPassword: "different", // 不一致
      };

      const errors = validateParticipantForm(invalidFormData);

      expect(errors.lastNameKanji).toBe("名字（漢字）は必須です");
      expect(errors.firstNameKanji).toBe("名前（漢字）は必須です");
      expect(errors.lastNameKana).toBe("ひらがなで入力してください");
      expect(errors.firstNameKana).toBe("名前（ふりがな）は必須です");
      expect(errors.email).toBe("有効なメールアドレスを入力してください");
      expect(errors.password).toBe("パスワードは10文字以上で入力してください");
      expect(errors.confirmPassword).toBe("パスワードが一致しません");
    });
  });
});

describe("validateField", () => {
  const mockFormData: NewParticipantFormData = {
    lastNameKanji: "山田",
    firstNameKanji: "太郎",
    lastNameKana: "やまだ",
    firstNameKana: "たろう",
    email: "test@example.com",
    displayName: "タロー",
    prefecture: "東京都",
    freeText: "よろしくお願いします",
    password: "password123",
    confirmPassword: "password123",
  };

  describe("個別フィールドのバリデーション", () => {
    it("lastNameKanji - 有効な値でnullが返ること", () => {
      const result = validateField("lastNameKanji", "山田", mockFormData);
      expect(result).toBe(null);
    });

    it("lastNameKanji - 空文字でエラーが返ること", () => {
      const result = validateField("lastNameKanji", "", mockFormData);
      expect(result).toBe("名字（漢字）は必須です");
    });

    it("lastNameKana - ひらがなで null が返ること", () => {
      const result = validateField("lastNameKana", "やまだ", mockFormData);
      expect(result).toBe(null);
    });

    it("lastNameKana - カタカナでエラーが返ること", () => {
      const result = validateField("lastNameKana", "ヤマダ", mockFormData);
      expect(result).toBe("ひらがなで入力してください");
    });

    it("email - 有効なメールでnullが返ること", () => {
      const result = validateField("email", "test@example.com", mockFormData);
      expect(result).toBe(null);
    });

    it("email - 無効なメールでエラーが返ること", () => {
      const result = validateField("email", "invalid-email", mockFormData);
      expect(result).toBe("有効なメールアドレスを入力してください");
    });

    it("password - 10文字以上でnullが返ること", () => {
      const result = validateField("password", "1234567890", mockFormData);
      expect(result).toBe(null);
    });

    it("password - 10文字未満でエラーが返ること", () => {
      const result = validateField("password", "short", mockFormData);
      expect(result).toBe("パスワードは10文字以上で入力してください");
    });

    it("confirmPassword - パスワードと一致でnullが返ること", () => {
      const formData = { ...mockFormData, password: "testpassword" };
      const result = validateField("confirmPassword", "testpassword", formData);
      expect(result).toBe(null);
    });

    it("confirmPassword - パスワードと不一致でエラーが返ること", () => {
      const formData = { ...mockFormData, password: "testpassword" };
      const result = validateField("confirmPassword", "different", formData);
      expect(result).toBe("パスワードが一致しません");
    });
  });

  describe("オプションフィールドのバリデーション", () => {
    it("displayName - 値があってもなくてもnullが返ること", () => {
      const result1 = validateField("displayName", "タロー", mockFormData);
      const result2 = validateField("displayName", "", mockFormData);
      expect(result1).toBe(null);
      expect(result2).toBe(null);
    });

    it("prefecture - 値があってもなくてもnullが返ること", () => {
      const result1 = validateField("prefecture", "東京都", mockFormData);
      const result2 = validateField("prefecture", "", mockFormData);
      expect(result1).toBe(null);
      expect(result2).toBe(null);
    });

    it("freeText - 値があってもなくてもnullが返ること", () => {
      const result1 = validateField("freeText", "テキスト", mockFormData);
      const result2 = validateField("freeText", "", mockFormData);
      expect(result1).toBe(null);
      expect(result2).toBe(null);
    });
  });
});
