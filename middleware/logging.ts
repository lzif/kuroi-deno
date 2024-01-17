import { bold, cyan, green } from "colors";
import { Context, Next } from "oak";

export default async (context: Context, next: Next) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  console.log(
    `${green(context.request.method)} ${
      cyan(context.request.url.pathname)
    } ${context.response.status} - ${bold(String(rt))}`,
  );
};
