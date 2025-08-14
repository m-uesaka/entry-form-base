import { describe, test, expect } from "bun:test";
import * as fs from "fs";
import * as path from "path";

const updateActionPath = path.join(
  __dirname,
  "../../src/actions/updateParticipant.ts",
);

describe("updateParticipantAction", () => {
  describe("基本構造", () => {
    test("updateParticipantActionファイルが存在すること", () => {
      expect(fs.existsSync(updateActionPath)).toBe(true);
    });

    test('"use server"ディレクティブが含まれていること', () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain('"use server"');
    });

    test("updateParticipantAction関数がエクスポートされていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain(
        "export async function updateParticipantAction",
      );
    });
  });

  describe("型定義", () => {
    test("必要な型がインポートされていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("UpdateParticipantFormData");
      expect(content).toContain("MyPageFormState");
    });

    test("関数シグネチャが正しいこと", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("prevState: MyPageFormState");
      expect(content).toContain("formData: FormData");
      expect(content).toContain("Promise<MyPageFormState>");
    });
  });

  describe("バリデーション", () => {
    test("validateField関数がインポートされていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("validateField");
    });

    test("必須フィールドのバリデーションが含まれていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("requiredFields");
      expect(content).toContain("lastNameKanji");
      expect(content).toContain("firstNameKanji");
      expect(content).toContain("lastNameKana");
      expect(content).toContain("firstNameKana");
      expect(content).toContain("email");
    });

    test("都道府県「その他」の処理が含まれていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("その他");
      expect(content).toContain('prefectureOther?.trim() || "その他"');
    });
  });

  describe("API呼び出し", () => {
    test("callUpdateAPI関数が定義されていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("async function callUpdateAPI");
    });

    test("clientがインポートされていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain('import { client } from "@/utils/client"');
    });

    test("Honoクライアント呼び出しが含まれていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("(client as any).participants");
      expect(content).toContain(".$put({");
    });

    test("フォールバック処理が含まれていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("NEXT_PUBLIC_API_URL");
      expect(content).toContain('method: "PUT"');
      expect(content).toContain("/participants/");
    });
  });

  describe("エラーハンドリング", () => {
    test("try-catch構文が含まれていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("try {");
      expect(content).toContain("} catch");
    });

    test("エラー時の戻り値が適切であること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("isSubmitting: false");
      expect(content).toContain("prevState.data");
      expect(content).toContain("prevState.participant");
    });
  });

  describe("戻り値", () => {
    test("成功時の戻り値が含まれていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("data: updateData");
      expect(content).toContain("participant: result.participant");
      expect(content).toContain("参加者情報を更新しました");
    });

    test("バリデーションエラー時の戻り値が含まれていること", () => {
      const content = fs.readFileSync(updateActionPath, "utf-8");
      expect(content).toContain("errors: {},");
      expect(content).toContain("errors,");
    });
  });
});
