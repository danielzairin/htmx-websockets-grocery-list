import Express, { urlencoded } from "express";
import path from "node:path";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { Groceries } from "./models/groceries";

const app = Express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
const viewsFolder = path.resolve(__dirname, "views");
app.set("views", viewsFolder);

function getSessionCode(req: Express.Request): string | null {
  return req.cookies?.session_code || null;
}

app.get("/", (req, res) => {
  let sessionCode = getSessionCode(req);

  if (!sessionCode) {
    sessionCode = "XOXO";
    res.cookie("session_code", sessionCode);
  }

  const groceries = Groceries.list(sessionCode);
  res.render("home", { groceryList: groceries });
});

app.post("/groceries/:name/toggle-checked", (req, res) => {
  const sessionCode = getSessionCode(req);
  if (!sessionCode) {
    res.status(401).send();
    return;
  }

  const { params } = req;
  const grocery = Groceries.toggleChecked(params.name);
  res.render("partials/grocery_li", { ...grocery, layout: false });
});

app.post("/groceries", (req, res) => {
  const sessionCode = getSessionCode(req);
  if (!sessionCode) {
    res.status(401).send();
    return;
  }

  const { body } = req;
  const grocery = Groceries.create(body.name, sessionCode);
  res.render("partials/grocery_li", { ...grocery, layout: false });
});

app.delete("/groceries/:name", (req, res) => {
  const sessionCode = getSessionCode(req);
  if (!sessionCode) {
    res.status(401).send();
    return;
  }

  const { params } = req;
  Groceries.del(params.name);
  res.send(null);
});

export default app;
