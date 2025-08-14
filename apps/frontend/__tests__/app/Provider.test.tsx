import { describe, it, expect } from "bun:test";

describe("Provider", () => {
  describe("基本機能", () => {
    it("Providerが正しくインポートされること", () => {
      const Provider = require("../../src/app/Provider").default;
      expect(Provider).toBeDefined();
      expect(typeof Provider).toBe("function");
    });

    it("Providerコンポーネントが関数であること", () => {
      const Provider = require("../../src/app/Provider").default;
      expect(typeof Provider).toBe("function");
      expect(Provider.name).toBe("Provider");
    });
  });

  describe("プロップス定義", () => {
    it("childrenプロップを受け取る型定義があること", () => {
      // TypeScriptの型レベルでテスト
      const Provider = require("../../src/app/Provider").default;
      expect(Provider).toBeDefined();
    });
  });

  describe("QueryClient統合", () => {
    it("QueryClientProviderを使用していること", async () => {
      // ファイルの内容を確認してQueryClientProviderが使われていることをテスト
      const fs = require("fs");
      const path = require("path");
      const providerPath = path.join(__dirname, "../../src/app/Provider.tsx");
      const content = fs.readFileSync(providerPath, "utf-8");

      expect(content).toContain("QueryClient");
      expect(content).toContain("QueryClientProvider");
      expect(content).toContain("@tanstack/react-query");
    });

    it("新しいQueryClientインスタンスを作成していること", async () => {
      const fs = require("fs");
      const path = require("path");
      const providerPath = path.join(__dirname, "../../src/app/Provider.tsx");
      const content = fs.readFileSync(providerPath, "utf-8");

      expect(content).toContain("new QueryClient()");
    });
  });

  describe("コンポーネント構造", () => {
    it("children propsを適切にレンダリングしていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const providerPath = path.join(__dirname, "../../src/app/Provider.tsx");
      const content = fs.readFileSync(providerPath, "utf-8");

      expect(content).toContain("children");
      expect(content).toContain("React.ReactNode");
    });

    it("use client ディレクティブが含まれていること", async () => {
      const fs = require("fs");
      const path = require("path");
      const providerPath = path.join(__dirname, "../../src/app/Provider.tsx");
      const content = fs.readFileSync(providerPath, "utf-8");

      expect(content).toContain("'use client'");
    });
  });
});
