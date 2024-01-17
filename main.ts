import { bold, cyan, green, yellow } from "colors";
import { Application, Context, RouteParams, Router, State, Status } from "oak";
import { oakCors } from "cors";
import { dejsEngine as ejsEngine, oakAdapter, viewEngine } from "view_engine";
import {
  errorHandling,
  loggerMiddleware,
  resTimeMiddleware,
} from "./middleware/index.ts";

// Add render method
declare module "oak" {
  interface Context {
    render: (fileName: string, data?: object) => void;
  }
  interface RouterContext<
    R extends string,
    P extends RouteParams<R> = RouteParams<R>,
    S extends State = Record<string, any>,
  > {
    render: (fileName: string, data?: object) => void;
  }
}

// render 404 not found
function notFound(context: Context) {
  context.response.status = Status.NotFound;
  context.render("error.ejs", { pathname: context.request.url.pathname });
}

const controller = new AbortController();

// Router
const router = new Router();
router
  .get("/", (ctx: Context) => {
    ctx.render("index.ejs", { title: "Kuroi" });
  });

const app = new Application();

app.use(
  viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views",
  }),
);

app.use(loggerMiddleware);
app.use(resTimeMiddleware);
app.use(errorHandling);

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context, next) => {
  const root = `${Deno.cwd()}/public`;
  try {
    await context.send({ root });
  } catch {
    next();
  }
});
app.use(notFound);

app.addEventListener("listen", ({ hostname, port, serverType }) => {
  console.log(
    bold("Start listening on ") + yellow(`${hostname}:${port}`),
  );
  console.log(bold("  using HTTP server: " + yellow(serverType)));
});

const { signal } = controller;
await app.listen({ hostname: "127.0.0.1", port: 8000, signal });
console.log(bold("Finished."));
