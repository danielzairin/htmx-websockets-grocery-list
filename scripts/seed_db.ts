import { db } from "../src/db";
import { groceries } from "../src/db/tables";

db.insert(groceries)
  .values([
    { name: "Apples" },
    { name: "Bananas" },
    { name: "Cheese", checked: true },
  ])
  .run();
