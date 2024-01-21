import { Hono } from "hono";
import { Child, logger, serveStatic } from "hono/middleware";
import basic from "./routes/basic.tsx";
import animeRoute from "./routes/anime.tsx";
import App from "./components/app.tsx";

declare module "hono" {
  interface ContextRenderer {
    (
      content: string | Child | Promise<string>,
      head?: { title: string; description: string; url: string; image: string },
      script?: string,
    ): Response | Promise<Response>;
  }
}

const app = new Hono({ strict: false });

app.use("*", logger());
app.use("*", async (c, next) => {
  console.log(c.req.header());
  await next();
});
app.use("*", async (c, next) => {
  c.setRenderer(
    (
      content,
      head = {
        title: "Kuroi | Anime & Manga Indo",
        description: "Tempat Nonton Anime dan Baca Manga",
        url: "https://kuroi.deno.dev",
        image: "https://yourwebsite.com/your-image.png",
      },
      script = "console.log('test')",
    ) => {
      return c.html(
        <App metaInfo={head} script={script}>
          {content}
        </App>,
      );
    },
  );
  await next();
});
app.route("/", basic);
app.route("/anime", animeRoute);
app.notFound((c) => {
  return c.text("Custom 404 Message", 404);
});
app.use(
  "*",
  serveStatic({
    root: "./public",
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`);
    },
  }),
);

export default app;
//Deno.serve(app.fetch);
