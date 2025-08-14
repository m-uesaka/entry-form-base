import type { AppType } from "backend/src";
import { hc } from "hono/client";

// デフォルトのAPI URLを設定（開発環境用）
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// 型安全なAPIクライアントを作成
// 型の互換性問題を解決するため、一旦unknownにキャストしてからAppTypeにキャスト
export const client = hc(API_URL) as unknown as AppType;