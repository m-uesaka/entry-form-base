# Entry Form Backend

## 環境構成

- **開発環境**: ローカルPostgreSQLデータベース（Docker）
- **プロダクション環境**: Supabase PostgreSQL（Cloudflare Workers）

## セットアップ

### 開発環境

1. 依存関係のインストール：
```bash
bun install
```

2. ローカルデータベースの起動：
```bash
bun run db:start
```

3. データベースマイグレーションの実行：
```bash
bun run db:generate  # スキーマからマイグレーションファイルを生成
bun run db:migrate   # マイグレーションを実行
```

4. 開発サーバーの起動：
```bash
bun run dev
```

### データベース管理コマンド

```bash
# ローカルデータベースの起動
bun run db:start

# ローカルデータベースの停止
bun run db:stop

# データベースのリセット（全データ削除）
bun run db:reset

# マイグレーションファイルの生成
bun run db:generate

# マイグレーションの実行
bun run db:migrate

# スキーマの直接プッシュ（開発時のみ）
bun run db:push
```

### プロダクション環境

```bash
# プロダクションデプロイ
bun run deploy
```

## 型生成

[Cloudflare Worker設定に基づく型の生成/同期](https://developers.cloudflare.com/workers/wrangler/commands/#types)：

```bash
bun run cf-typegen
```

Honoをインスタンス化する際に`CloudflareBindings`をジェネリクスとして渡す：

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```

## API エンドポイント

- `GET /participants` - 全参加者の取得
- `GET /participants/:id` - 特定参加者の取得
- `POST /participants` - 新規参加者の追加
- `PUT /participants/:id` - 参加者情報の更新
