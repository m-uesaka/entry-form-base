import { describe, it, expect } from "bun:test";

describe("NewParticipantsForm", () => {
  describe("コンポーネントの基本構造", () => {
    it("NewParticipantsFormが正しくインポートされること", () => {
      const NewParticipantsForm =
        require("../../src/app/NewParticipantsForm").default;
      expect(NewParticipantsForm).toBeDefined();
      expect(typeof NewParticipantsForm).toBe("function");
    });

    it("use client ディレクティブが含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("use client");
    });

    it("useStateとuseMutationが使用されていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("useState");
      expect(content).toContain("useMutation");
      expect(content).toContain("@tanstack/react-query");
    });
  });

  describe("フォームフィールドの構造", () => {
    it("すべての必須フィールドがHTMLに含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      // 必須フィールドのラベル確認
      expect(content).toContain("名字（漢字）");
      expect(content).toContain("名前（漢字）");
      expect(content).toContain("名字（ふりがな）");
      expect(content).toContain("名前（ふりがな）");
      expect(content).toContain("メールアドレス");
      expect(content).toContain("パスワード");
      expect(content).toContain("パスワード確認");
    });

    it("オプションフィールドが含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("表示名");
      expect(content).toContain("在住地");
      expect(content).toContain("自由記述欄");
    });

    it("都道府県選択フィールドが含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("PREFECTURES");
      expect(content).toContain("select");
    });
  });

  describe("バリデーション機能", () => {
    it("validation関数がインポートされていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("validateParticipantForm");
      expect(content).toContain("validateField");
      expect(content).toContain("@/utils/validation");
    });

    it("エラー表示機能が含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("errors.");
      expect(content).toContain("text-red-500");
      expect(content).toContain("border-red-500");
    });
  });

  describe("フォーム送信機能", () => {
    it("mutationが定義されていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("mutation");
      expect(content).toContain("useMutation");
    });

    it("clientがインポートされていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("client");
      expect(content).toContain("@/utils/client");
    });

    it("API呼び出し機能が含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("(client as any)");
      expect(content).toContain("participants");
      expect(content).toContain("$post");
    });

    it("フォールバック処理が含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("fetch");
      expect(content).toContain("/participants");
      expect(content).toContain("POST");
    });

    it("送信状態の管理が含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("mutation.isPending");
      expect(content).toContain("isSubmitting");
      expect(content).toContain("登録中...");
    });
  });

  describe("UIスタイル", () => {
    it("Tailwind CSSクラスが使用されていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("className=");
      expect(content).toContain("bg-");
      expect(content).toContain("text-");
      expect(content).toContain("border-");
    });

    it("レスポンシブデザインのクラスが含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("md:");
      expect(content).toContain("grid-cols-");
    });
  });

  describe("型定義の統合", () => {
    it("form.ts型定義がインポートされていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("@/types/form");
      expect(content).toContain("NewParticipantFormData");
      expect(content).toContain("FormState");
      expect(content).toContain("PREFECTURES");
    });
  });

  describe("初期状態とフォーム状態管理", () => {
    it("initialState が定義されていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("initialState");
      expect(content).toContain("FormState");
    });

    it("フィールド変更ハンドラーが含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("handleInputChange");
      expect(content).toContain("handleSubmit");
      expect(content).toContain("onChange");
    });
  });

  describe("成功・エラーメッセージ", () => {
    it("成功メッセージ表示機能が含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("submitMessage");
      expect(content).toContain("onSuccess");
      expect(content).toContain("参加者登録が完了しました");
    });

    it("エラーメッセージ表示機能が含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("errors.submit");
      expect(content).toContain("onError");
      expect(content).toContain("bg-red-100");
    });
  });

  describe("React Query統合", () => {
    it("mutationFnが定義されていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("mutationFn:");
      expect(content).toContain("async");
    });

    it("onSuccessとonErrorハンドラーが含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const formPath = path.join(
        __dirname,
        "../../src/app/NewParticipantsForm.tsx",
      );
      const content = fs.readFileSync(formPath, "utf-8");

      expect(content).toContain("onSuccess:");
      expect(content).toContain("onError:");
    });
  });
});
