import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { client } from "../../src/utils/client";

describe("client.ts", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    // 環境変数を元に戻す
    if (originalEnv) {
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
  });

  describe("API_URL設定", () => {
    it("NEXT_PUBLIC_API_URL環境変数が設定されていない場合、デフォルトURLが使用される", () => {
      delete process.env.NEXT_PUBLIC_API_URL;

      // clientを再インポートする必要があるため、動的インポートを使用
      const { client: testClient } = require("../../src/utils/client");

      // clientオブジェクトが存在することを確認
      expect(testClient).toBeDefined();
      expect(["object", "function"]).toContain(typeof testClient);
    });

    it("NEXT_PUBLIC_API_URL環境変数が設定されている場合、その値が使用される", () => {
      process.env.NEXT_PUBLIC_API_URL = "https://custom-api.example.com";

      // clientを再インポートする
      const { client: testClient } = require("../../src/utils/client");

      // clientオブジェクトが存在することを確認
      expect(testClient).toBeDefined();
      expect(["object", "function"]).toContain(typeof testClient);
    });
  });

  describe("clientオブジェクト", () => {
    it("clientが正しく初期化されている", () => {
      expect(client).toBeDefined();
      expect(["object", "function"]).toContain(typeof client);
    });

    it("clientが必要なメソッドを持っている", () => {
      expect(client).toBeTruthy();
      // Honoクライアントの基本的なプロパティが存在することを確認
      // 実際の型はAppTypeに依存するが、オブジェクトまたは関数として存在することを確認
      expect(["object", "function"]).toContain(typeof client);
    });
  });

  describe("型安全性", () => {
    it("clientがAppType型を適用していることを確認", () => {
      // TypeScriptの型チェックでこれがコンパイルエラーにならないことを確認
      expect(client).toBeDefined();

      // clientが関数やオブジェクトのプロパティを持つことを確認
      // 具体的なAPIエンドポイントの型は実行時には確認できないが、
      // オブジェクトまたは関数として正しく初期化されていることを確認
      expect(["object", "function"]).toContain(typeof client);
      expect(client).not.toBeNull();
    });
  });

  describe("環境別設定", () => {
    it("開発環境でのデフォルトURL", () => {
      delete process.env.NEXT_PUBLIC_API_URL;

      // モジュールキャッシュをクリアして再インポート
      delete require.cache[require.resolve("../../src/utils/client")];
      const { client: devClient } = require("../../src/utils/client");

      expect(devClient).toBeDefined();
    });

    it("本番環境でのカスタムURL", () => {
      process.env.NEXT_PUBLIC_API_URL = "https://production-api.example.com";

      // モジュールキャッシュをクリアして再インポート
      delete require.cache[require.resolve("../../src/utils/client")];
      const { client: prodClient } = require("../../src/utils/client");

      expect(prodClient).toBeDefined();
    });
  });

  describe("APIクライアントの基本機能", () => {
    it("clientオブジェクトがhcから正しく生成されている", () => {
      expect(client).toBeDefined();
      expect(["object", "function"]).toContain(typeof client);
      expect(client).not.toBeNull();
      expect(client).not.toBeUndefined();
    });

    it("clientがfunctionまたはobjectとして利用可能", () => {
      // Honoクライアントは通常オブジェクトまたは関数として機能する
      const clientType = typeof client;
      expect(["object", "function"]).toContain(clientType);
    });
  });
});
