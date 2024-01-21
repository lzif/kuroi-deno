import { Hono } from "hono";
import { Child, logger, serveStatic } from "hono/middleware";
import { extract, install } from "twind";
import presetTailwind from "twind/preset";
import basic from "./routes/basic.tsx";
import animeRoute from "./routes/anime.tsx";
import App from "./components/app.tsx";

install({
  presets: [presetTailwind(), {}],
});

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
      const htmlJsx = (
        <App metaInfo={head} script={script}>
          {content}
        </App>
      );
      const body = "<!DOCTYPE html>" + htmlJsx.toString();
      const { html, css } = extract(body);
      const hxBoost = c.req.header("hx-boosted");
      const styleTag = `<style data-twind>${css}</style>`;

      if (hxBoost) {
        return c.html(html.replace("</body>", `${styleTag}</body>`));
      }

      return c.html(html.replace("</head>", `${styleTag}</head>`));
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
