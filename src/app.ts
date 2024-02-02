import express from "express";
import path from "node:path";
import { engine } from "express-handlebars";
import { Groceries } from "./models/groceries";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
const viewsFolder = path.resolve(__dirname, "views");
app.set("views", viewsFolder);

app.get("/", (_req, res) => {
  const groceries = Groceries.list();
  res.render("home", { groceryList: groceries });
});

app.post("/groceries/:name/toggle-checked", (req, res) => {
  const { name } = req.params;
  const grocery = Groceries.toggleChecked(name);
  res.render("partials/grocery_li", { ...grocery, layout: false });
});

export default app;
