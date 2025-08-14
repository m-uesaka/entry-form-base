import type { AppType } from "backend/src/index";
import { hc } from "hono/client";

// デフォルトのAPI URLを設定（開発環境用）
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// 型安全なAPIクライアントを作成
export const client = hc<AppType>(API_URL);
