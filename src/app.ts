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

app.post("/toggle", (_req, res) => {
  res.send("");
});

export default app;
