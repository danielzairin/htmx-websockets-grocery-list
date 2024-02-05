import Express, { urlencoded } from "express";
import path from "node:path";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { Groceries } from "./models/groceries";
import { Sessions } from "./models/sessions";

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
    res.render("enter_code");
    return;
  }

  const groceries = Groceries.list(sessionCode);
  res.render("home", { groceryList: groceries, sessionCode });
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

app.post("/session/authorize", (req, res) => {
  const sessionCode = req.body.session_code as string;
  const session = Sessions.init(sessionCode);
  res.cookie("session_code", session.code);
  res.redirect(303, "/");
});

export default app;
