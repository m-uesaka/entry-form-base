-- Make password_hash NOT NULL for participants table
ALTER TABLE "participants" ALTER COLUMN "password_hash" SET NOT NULL;
