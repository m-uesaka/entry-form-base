CREATE TABLE "participants" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "participants_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"last_name_kanji" text NOT NULL,
	"first_name_kanji" text NOT NULL,
	"last_name_kana" text NOT NULL,
	"first_name_kana" text NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"prefecture" text,
	"free_text" text,
	"is_cancelled" boolean DEFAULT false NOT NULL,
	"is_accepted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
