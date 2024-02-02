import { db } from "../db";
import { groceries } from "../db/tables";
import { Grocery } from "../types";

export * as Groceries from "./groceries";

export function list(): Grocery[] {
  return db.select().from(groceries).all();
}
