import { eq } from "drizzle-orm";
import { db } from "../db";
import { groceries } from "../db/tables";
import { Grocery } from "../types";

export * as Groceries from "./groceries";

export function list(sessionCode: string): Grocery[] {
  return db
    .select()
    .from(groceries)
    .where(eq(groceries.sessionCode, sessionCode))
    .all();
}

export function toggleChecked(name: string): Grocery {
  const grocery = db
    .select()
    .from(groceries)
    .where(eq(groceries.name, name))
    .get();

  if (!grocery) {
    throw Error(`Grocery with name '${name}' not found`);
  }

  const updatedGrocery = db
    .update(groceries)
    .set({ checked: !grocery.checked })
    .where(eq(groceries.name, name))
    .returning()
    .get();

  return updatedGrocery;
}

export function create(name: string, sessionCode: string): Grocery {
  return db.insert(groceries).values({ name, sessionCode }).returning().get();
}

export function del(name: string): void {
  db.delete(groceries).where(eq(groceries.name, name)).run();
}
