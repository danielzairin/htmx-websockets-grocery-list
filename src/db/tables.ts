import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const groceries = sqliteTable("groceries", {
  name: text("id").primaryKey(),
  checked: integer("checked", { mode: "boolean" }).notNull().default(false),
});
