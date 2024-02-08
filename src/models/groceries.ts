import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { groceries } from "../db/tables";
import { Grocery } from "../types";
import { between } from "drizzle-orm";

export * as Groceries from "./groceries";

export function list(sessionCode: string): Grocery[] {
  return db
    .select()
    .from(groceries)
    .where(eq(groceries.sessionCode, sessionCode))
    .orderBy(groceries.position)
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
  return db
    .insert(groceries)
    .values({ name, sessionCode, position: 69 })
    .returning()
    .get();
}

export function del(name: string): void {
  db.delete(groceries).where(eq(groceries.name, name)).run();
}

export function reorder(
  sessionCode: string,
  name: string,
  newPosition: number
): Grocery[] {
  const orignalGroceryList = db
    .select()
    .from(groceries)
    .where(eq(groceries.sessionCode, sessionCode))
    .all();

  const targetGrocery = db
    .select()
    .from(groceries)
    .where(eq(groceries.name, name))
    .get();

  if (!targetGrocery) {
    return orignalGroceryList;
  }

  const currentPosition = targetGrocery.position;

  if (newPosition > currentPosition) {
    const updates = db
      .update(groceries)
      .set({ position: sql`${groceries.position} - 1` })
      .where(between(groceries.position, currentPosition, newPosition))
      .returning()
      .all();
  } else if (newPosition < currentPosition) {
    db.update(groceries)
      .set({ position: sql`${groceries.position} + 1` })
      .where(between(groceries.position, newPosition, currentPosition))
      .run();
  }

  db.update(groceries)
    .set({ position: newPosition })
    .where(eq(groceries.name, name))
    .run();

  const newGroceryList = db
    .select()
    .from(groceries)
    .where(eq(groceries.sessionCode, sessionCode))
    .orderBy(groceries.position)
    .all();

  return newGroceryList;
}
