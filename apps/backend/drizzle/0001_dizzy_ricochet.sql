CREATE TABLE "staff" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "staff_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"accessed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "staff_user_unique" UNIQUE("user")
);
--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "password_hash" text;