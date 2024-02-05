import { eq } from "drizzle-orm";
import { db } from "../db";
import { sessions } from "../db/tables";
import { Session } from "../types";

export * as Sessions from "./sessions";

export function init(sessionCode: string): Session {
  let session = db
    .select()
    .from(sessions)
    .where(eq(sessions.code, sessionCode))
    .get();

  if (!session) {
    session = db
      .insert(sessions)
      .values({ code: sessionCode })
      .returning()
      .get();
  }

  return session;
}
