import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .dev.vars for development
config({ path: ".dev.vars" });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/entry_form_dev',
  },
  verbose: true,
  strict: true,
});
