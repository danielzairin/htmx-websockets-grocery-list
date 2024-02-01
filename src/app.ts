import express from "express";
import path from "node:path";
import { engine } from "express-handlebars";
import { mocks } from "./mocks";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
const viewsFolder = path.resolve(__dirname, "views");
app.set("views", viewsFolder);

app.get("/", (_req, res) => {
  res.render("home", { groceryList: mocks.groceryList });
});

app.post("/toggle", (_req, res) => {
  res.send("");
});

export default app;
