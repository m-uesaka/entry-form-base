import { describe, it, expect } from "bun:test";

describe("PublicEntryList", () => {
  describe("コンポーネントの基本構造", () => {
    it("PublicEntryListファイルが存在すること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      expect(() => fs.readFileSync(componentPath, "utf-8")).not.toThrow();
    });

    it("use client ディレクティブが含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('"use client"');
    });
  });

  describe("API統合とReact Query", () => {
    it("useQueryがインポートされていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("useQuery");
      expect(content).toContain("@tanstack/react-query");
    });

    it("clientがインポートされていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("client");
      expect(content).toContain("@/utils/client");
    });

    it("ParticipantsResponse型がインポートされていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("ParticipantsResponse");
      expect(content).toContain("Participant");
    });

    it("queryKeyとqueryFnが正しく設定されていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("queryKey");
      expect(content).toContain("queryFn");
      expect(content).toContain("participants");
    });
  });

  describe("状態管理", () => {
    it("useQueryの戻り値を適切に分割代入していること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("data:");
      expect(content).toContain("isLoading");
      expect(content).toContain("error");
    });

    it("participantsResponseから参加者データを取得していること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("participantsResponse");
      expect(content).toContain("participants ?? []");
    });
  });

  describe("表示ロジック", () => {
    it("参加者数を計算するロジックが含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("activeParticipantCount");
      expect(content).toContain("filter");
      expect(content).toContain("!participant.isCancelled");
    });

    it("表示名を取得する関数が含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("getDisplayName");
      expect(content).toContain("キャンセル");
    });

    it("都道府県を取得する関数が含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("getPrefecture");
    });
  });

  describe("UIレンダリング", () => {
    it("ローディング状態の表示が含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("isLoading");
      expect(content).toContain("animate-spin");
    });

    it("エラー状態の表示が含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("error");
      expect(content).toContain("bg-red-100");
    });

    it("テーブル要素が含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("<table");
      expect(content).toContain("<thead");
      expect(content).toContain("<tbody");
      expect(content).toContain("<th");
      expect(content).toContain("<td");
    });

    it("参加者数表示が含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("現在の参加者数");
      expect(content).toContain("activeParticipantCount");
    });
  });

  describe("スタイリング", () => {
    it("Tailwind CSSクラスが適切に使用されていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("max-w-4xl");
      expect(content).toContain("mx-auto");
      expect(content).toContain("p-6");
    });

    it("キャンセル済み参加者用のスタイルが含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("bg-gray-100");
      expect(content).toContain("text-gray-500");
      expect(content).toContain("italic");
    });

    it("ホバー効果が含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("hover:bg-gray-50");
    });
  });

  describe("エラーハンドリング", () => {
    it("フォールバックのfetch処理が含まれていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("catch");
      expect(content).toContain("fetch");
      expect(content).toContain("NEXT_PUBLIC_API_URL");
    });

    it("try-catch構文が適切に使用されていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("try {");
      expect(content).toContain("} catch");
    });
  });

  describe("TypeScript型安全性", () => {
    it("適切な型注釈が使用されていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("ParticipantsResponse");
      expect(content).toContain("Error");
      expect(content).toContain("Participant");
    });

    it("ESLint無効化コメントが適切に使用されていること", () => {
      const fs = require("fs");
      const path = require("path");
      const componentPath = path.join(
        __dirname,
        "../../src/app/PublicEntryList.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain(
        "eslint-disable-next-line @typescript-eslint/no-explicit-any",
      );
    });
  });
});
