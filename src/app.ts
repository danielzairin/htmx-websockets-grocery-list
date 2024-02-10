import Express, { urlencoded } from "express";
import path from "node:path";
import { ExpressHandlebars } from "express-handlebars";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { Groceries } from "./models/groceries";
import { Sessions } from "./models/sessions";
import expressWs from "express-ws";
import type WebSocket from "ws";

const { app, getWss } = expressWs(Express());

app.use(morgan("dev"));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(Express.static(path.resolve(__dirname, "../public")));

const hbs = new ExpressHandlebars({});
app.engine("handlebars", hbs.engine);
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

app.post("/session/authorize", (req, res) => {
  const sessionCode = req.body.session_code as string;
  const session = Sessions.init(sessionCode);
  res.cookie("session_code", session.code);
  res.redirect(303, "/");
});

const connections: Record<string, WebSocket[]> = {};

app.ws("/ws", (ws, req) => {
  const sessionCode = getSessionCode(req);
  if (!sessionCode) {
    ws.close();
    return;
  }

  connections[sessionCode] = connections[sessionCode]
    ? [...connections[sessionCode], ws]
    : [ws];

  ws.on("message", async (rawMessage) => {
    const message = JSON.parse(rawMessage.toString());
    switch (message["ws_action"]) {
      case "sort": {
        const { sorted_name, sorted_new_position } = message;
        Groceries.reorder(
          sessionCode,
          sorted_name,
          Number(sorted_new_position)
        );
        break;
      }

      case "toggle-checked": {
        const { grocery_name } = message;
        Groceries.toggleChecked(grocery_name);
        break;
      }

      case "delete-grocery": {
        const { grocery_name } = message;
        Groceries.del(grocery_name);
        break;
      }

      case "add-grocery": {
        const { grocery_name } = message;
        Groceries.create(grocery_name, sessionCode);
        break;
      }
    }

    for (const w of connections[sessionCode]) {
      if (w.readyState !== w.OPEN) continue;
      w.send(
        `${await hbs.render(
          path.resolve(
            __dirname,
            "views/partials/sortable_grocery_list.handlebars"
          ),
          { groceryList: Groceries.list(sessionCode) }
        )}`
      );
    }
  });
});

export default app;
