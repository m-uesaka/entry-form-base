import {
  pgTable,
  integer,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const participantsTable = pgTable("participants", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // 名字（漢字）
  lastNameKanji: text("last_name_kanji").notNull(),
  // 名前（漢字）
  firstNameKanji: text("first_name_kanji").notNull(),
  // 名字（ふりがな）
  lastNameKana: text("last_name_kana").notNull(),
  // 名前（ふりがな）
  firstNameKana: text("first_name_kana").notNull(),
  // e-mail
  email: text("email").notNull(),
  // web上で名乗る名前
  displayName: text("display_name"),
  // 在住地
  prefecture: text("prefecture"),
  // 自由記述欄
  freeText: text("free_text"),
  // キャンセル済みか
  isCancelled: boolean("is_cancelled").notNull().default(false),
  // 受付済みか
  isAccepted: boolean("is_accepted").notNull().default(false),
  // データベースにデータが生成された時刻
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // マイページログイン用パスワード（ハッシュ化済み）
  passwordHash: text("password_hash").notNull(),
  // データが更新された時刻
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const staffTable = pgTable("staff", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // ユーザ名
  user: text("user").notNull().unique(),
  // パスワード（ハッシュ化済み）
  passwordHash: text("password_hash").notNull(),
  // アカウントを作った日時
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // スタッフ用ページへの最終アクセス日時
  accessedAt: timestamp("accessed_at").notNull().defaultNow(),
});

export type ParticipantInsert = typeof participantsTable.$inferInsert;
export type ParticipantSelect = typeof participantsTable.$inferSelect;
export type StaffInsert = typeof staffTable.$inferInsert;
export type StaffSelect = typeof staffTable.$inferSelect;
