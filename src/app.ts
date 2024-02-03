import express from "express";
import path from "node:path";
import { engine } from "express-handlebars";
import { Groceries } from "./models/groceries";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
const viewsFolder = path.resolve(__dirname, "views");
app.set("views", viewsFolder);

app.get("/", (_req, res) => {
  const groceries = Groceries.list();
  res.render("home", { groceryList: groceries });
});

app.post("/groceries/:name/toggle-checked", (req, res) => {
  const { params } = req;
  const grocery = Groceries.toggleChecked(params.name);
  res.render("partials/grocery_li", { ...grocery, layout: false });
});

app.post("/groceries", (req, res) => {
  const { body } = req;
  const grocery = Groceries.create(body.name);
  res.render("partials/grocery_li", { ...grocery, layout: false });
});

app.delete("/groceries/:name", (req, res) => {
  const { params } = req;
  Groceries.del(params.name);
  res.send(null);
});

export default app;
