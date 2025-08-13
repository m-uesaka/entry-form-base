import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  participantsTable,
  staffTable,
  type ParticipantInsert,
  type ParticipantSelect,
  type StaffInsert,
  type StaffSelect,
} from "./schema";
import {
  dbMiddleware,
  sanitizeMiddleware,
  type Env,
  type Variables,
} from "./middleware";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

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
  password: z.string().min(10), // パスワードは必須
  isCancelled: z.boolean().default(false),
  isAccepted: z.boolean().default(false),
});

const staffSchema = z.object({
  user: z.string().min(1),
  password: z.string().min(10),
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// 参加者の一覧を取得
app.get("/participants", dbMiddleware, sanitizeMiddleware, async (c) => {
  const db = c.get("db");
  const sanitizeParticipants = c.get("sanitizeParticipants");

  const participants = await db.select().from(participantsTable);
  if (!participants) {
    return c.text("Failed to fetch participants", 500);
  }

  const safeParticipants = sanitizeParticipants(participants);
  return c.json({ participants: safeParticipants });
});

// 参加者の詳細を取得
app.get("/participants/:id", dbMiddleware, sanitizeMiddleware, async (c) => {
  const db = c.get("db");
  const sanitizeParticipant = c.get("sanitizeParticipant");

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

  const participant: ParticipantSelect = participants[0];
  const safeParticipant = sanitizeParticipant(participant);
  return c.json(safeParticipant);
});

// 新しい参加者を追加
app.post(
  "/participants",
  dbMiddleware,
  zValidator("json", participantSchema, (result, c) => {
    if (!result.success) {
      return c.text(result.error.issues[0].message, 400);
    }
  }),
  async (c) => {
    const db = c.get("db");
    const data = c.req.valid("json");

    // パスワードをハッシュ化（必須なのでnullチェック不要）
    const participantData: ParticipantInsert = {
      ...data,
      passwordHash: await bcrypt.hash(data.password, 10),
    };

    // passwordフィールドを削除（データベースには保存しない）
    delete (participantData as any).password;

    const participant = await db
      .insert(participantsTable)
      .values(participantData);
    return c.json({ participant: participant[0] });
  },
);

// 参加者情報を更新
app.put("/participants/:id", dbMiddleware, sanitizeMiddleware, async (c) => {
  const db = c.get("db");
  const sanitizeParticipant = c.get("sanitizeParticipant");

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
    .where(eq(participantsTable.id, id))
    .returning();

  if (updatedParticipant.length === 0) {
    return c.json({ error: "Participant not found" }, 404);
  }

  const updatedData: ParticipantSelect = updatedParticipant[0];
  const safeUpdatedData = sanitizeParticipant(updatedData);

  return c.json(safeUpdatedData);
});

// スタッフの一覧を取得
app.get("/staff", dbMiddleware, async (c) => {
  const db = c.get("db");
  const staff = await db
    .select({
      id: staffTable.id,
      user: staffTable.user,
      createdAt: staffTable.createdAt,
      accessedAt: staffTable.accessedAt,
    })
    .from(staffTable);
  if (!staff) {
    return c.text("Failed to fetch staff", 500);
  }
  return c.json({ staff });
});

// 新しいスタッフを追加
app.post(
  "/staff",
  dbMiddleware,
  zValidator("json", staffSchema, (result, c) => {
    if (!result.success) {
      return c.text(result.error.issues[0].message, 400);
    }
  }),
  async (c) => {
    const db = c.get("db");
    const { user, password } = c.req.valid("json");

    // パスワードをハッシュ化
    const passwordHash = await bcrypt.hash(password, 10);

    const staffData: StaffInsert = {
      user,
      passwordHash,
    };

    try {
      const newStaff = await db
        .insert(staffTable)
        .values(staffData)
        .returning({
          id: staffTable.id,
          user: staffTable.user,
          createdAt: staffTable.createdAt,
        });
      return c.json({ staff: newStaff[0] });
    } catch (error) {
      if ((error as any).code === "23505") {
        // unique constraint violation
        return c.json({ error: "User already exists" }, 409);
      }
      return c.json({ error: "Failed to create staff" }, 500);
    }
  },
);

// スタッフログイン
app.post("/staff/login", dbMiddleware, sanitizeMiddleware, async (c) => {
  const db = c.get("db");
  const sanitizeStaff = c.get("sanitizeStaff");
  const { user, password } = await c.req.json();

  if (!user || !password) {
    return c.json({ error: "User and password are required" }, 400);
  }

  const staff = await db
    .select()
    .from(staffTable)
    .where(eq(staffTable.user, user));

  if (staff.length === 0) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const staffMember: StaffSelect = staff[0];
  const isValidPassword = await bcrypt.compare(
    password,
    staffMember.passwordHash,
  );
  if (!isValidPassword) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  // 最終アクセス日時を更新
  await db
    .update(staffTable)
    .set({ accessedAt: new Date() })
    .where(eq(staffTable.id, staffMember.id));

  // パスワードハッシュを除いた安全なスタッフ情報を返却
  const safeStaffData = sanitizeStaff(staffMember);
  return c.json({
    message: "Login successful",
    staff: {
      ...safeStaffData,
      accessedAt: new Date(),
    },
  });
});

// 参加者ログイン
app.post("/participants/login", dbMiddleware, sanitizeMiddleware, async (c) => {
  const db = c.get("db");
  const sanitizeParticipant = c.get("sanitizeParticipant");
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const participant = await db
    .select()
    .from(participantsTable)
    .where(eq(participantsTable.email, email));

  if (participant.length === 0) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const participantData: ParticipantSelect = participant[0];
  const isValidPassword = await bcrypt.compare(
    password,
    participantData.passwordHash,
  );
  if (!isValidPassword) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  // パスワードハッシュを除いて返却
  const safeParticipantData = sanitizeParticipant(participantData);

  return c.json({
    message: "Login successful",
    participant: safeParticipantData,
  });
});

export type AppType = typeof app;

export default app;
