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
    { name: "Apples", sessionCode: session.code },
    { name: "Bananas", sessionCode: session.code },
    { name: "Cheese", checked: true, sessionCode: session.code },
  ])
  .run();
