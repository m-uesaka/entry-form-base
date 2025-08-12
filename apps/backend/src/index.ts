import { Hono } from "hono";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/postgres-js";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import {
  participantsTable,
  type ParticipantInsert,
  type ParticipantSelect,
} from "./schema";

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: "*",
  }),
);

const participantSchema = z.object({
  email: z.email(),
  lastNameKanji: z.string().min(1),
  firstNameKanji: z.string().min(1),
  lastNameKana: z.string().min(1),
  firstNameKana: z.string().min(1),
  displayName: z.string().nullable(),
  prefecture: z.string().nullable(),
  freeText: z.string().nullable(),
  isCancelled: z.boolean().default(false),
  isAccepted: z.boolean().default(false),
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// 参加者の一覧を取得
app.get("/participants", async (c) => {
  const client = postgres(c.env.DATABASE_URL, { prepare: false });
  const db = drizzle({ client });
  const participants = await db.select().from(participantsTable);
  if (!participants) {
    return c.text("Failed to fetch participants", 500);
  }
  return c.json({ participants });
});

// 参加者の詳細を取得
app.get("/participants/:id", async (c) => {
  const client = postgres(c.env.DATABASE_URL, { prepare: false });
  const db = drizzle({ client });

  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "Invalid ID" }, 400);
  }
  const participants = await db
    .select()
    .from(participantsTable)
    .where(eq(participantsTable.id, id));
  if (participants.length === 0) {
    return c.json({ error: "Participant not found" }, 404);
  }
  return c.json(participants[0]);
});

// 新しい参加者を追加
app.post(
  "/participants",
  zValidator("json", participantSchema, (result, c) => {
    if (!result.success) {
      return c.text(result.error.issues[0].message, 400);
    }
  }),
  async (c) => {
    const client = postgres(c.env.DATABASE_URL, { prepare: false });
    const db = drizzle({ client });
    const participant = await db
      .insert(participantsTable)
      .values(c.req.valid("json"));
    return c.json({ participant: participant[0] });
  },
);

// 参加者情報を更新
app.put("/participants/:id", async (c) => {
  const client = postgres(c.env.DATABASE_URL, { prepare: false });
  const db = drizzle({ client });
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "Invalid ID" }, 400);
  }
  const body = (await c.req.json()) as Partial<ParticipantInsert>;

  const updatedParticipant = await db
    .update(participantsTable)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(eq(participantsTable.id, id));

  if (updatedParticipant.length === 0) {
    return c.json({ error: "Participant not found" }, 404);
  }

  return c.json(updatedParticipant[0]);
});

export type AppType = typeof app;

export default app;
