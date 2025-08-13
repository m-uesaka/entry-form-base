import { createMiddleware } from "hono/factory";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { ParticipantSelect, StaffSelect } from "./schema";

export type Env = {
  DATABASE_URL: string;
};

export type Variables = {
  db: ReturnType<typeof drizzle>;
  sanitizeParticipant: (
    participant: ParticipantSelect,
  ) => Omit<ParticipantSelect, "passwordHash">;
  sanitizeParticipants: (
    participants: ParticipantSelect[],
  ) => Omit<ParticipantSelect, "passwordHash">[];
  sanitizeStaff: (staff: StaffSelect) => Omit<StaffSelect, "passwordHash">;
};

// データベース接続ミドルウェア
export const dbMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  const client = postgres(c.env.DATABASE_URL, { prepare: false });
  const db = drizzle({ client });
  c.set("db", db);
  await next();
});

// データサニタイゼーションミドルウェア
export const sanitizeMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  // 単一の参加者からパスワードハッシュを除外
  const sanitizeParticipant = (
    participant: ParticipantSelect,
  ): Omit<ParticipantSelect, "passwordHash"> => {
    const { passwordHash, ...safeParticipant } = participant;
    return safeParticipant;
  };

  // 複数の参加者からパスワードハッシュを除外
  const sanitizeParticipants = (
    participants: ParticipantSelect[],
  ): Omit<ParticipantSelect, "passwordHash">[] => {
    return participants.map(sanitizeParticipant);
  };

  // スタッフからパスワードハッシュを除外
  const sanitizeStaff = (
    staff: StaffSelect,
  ): Omit<StaffSelect, "passwordHash"> => {
    const { passwordHash, ...safeStaff } = staff;
    return safeStaff;
  };

  c.set("sanitizeParticipant", sanitizeParticipant);
  c.set("sanitizeParticipants", sanitizeParticipants);
  c.set("sanitizeStaff", sanitizeStaff);

  await next();
});
