import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
  code: text("code").primaryKey(),
});

export const sessionsRelations = relations(sessions, ({ many }) => ({
  groceries: many(groceries),
}));

export const groceries = sqliteTable("groceries", {
  name: text("id").primaryKey(),
  checked: integer("checked", { mode: "boolean" }).notNull().default(false),
  sessionCode: text("sessionCode").notNull(),
  position: integer("position").notNull(),
});

export const groceriesRelations = relations(groceries, ({ one }) => ({
  sesssion: one(sessions, {
    fields: [groceries.sessionCode],
    references: [sessions.code],
  }),
}));
