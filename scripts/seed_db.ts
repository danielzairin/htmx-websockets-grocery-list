import { db } from "../src/db";
import { groceries, sessions } from "../src/db/tables";

const session = db
  .insert(sessions)
  .values({
    code: "XOXO",
  })
  .returning()
  .get();

db.insert(groceries)
  .values([
    { name: "Apples", sessionCode: session.code, position: 1 },
    { name: "Bananas", sessionCode: session.code, position: 2 },
    { name: "Cheese", checked: true, sessionCode: session.code, position: 3 },
  ])
  .run();
