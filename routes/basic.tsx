import { Hono } from "hono";
import { getNewEps } from "../services/anime-news.ts";

const basic = new Hono({ strict: false });

async function B() {
  const a = await getNewEps();
  return <div>{JSON.stringify(a)}</div>;
}
basic
  .get("/", async (c) => {
    const newEps = await getNewEps();
    return c.render(
      <main class="flex justify-center w-full p-2">
        <div class="bg-gray-900 text-gray-100 border-2 border-gray-700 rounded-2xl p-2 w-full max-w-lg">
          <h1 class="text-lg font-bold mb-2">Episode terbaru</h1>
          <ul class="grid grid-cols-2 gap-2" hx-boost="true">
            {newEps.map((anime) => (
              <li class="flex flex-col border rounded-xl bg-slate-900 border-gray-700 shadow-slate-700/[.7]">
                <a href={anime.url} class="relative">
                  <img
                    class="w-full object-cover aspect-video rounded-t-xl"
                    src={anime.img}
                    alt={anime.title}
                    onerror="this.onerror=null; this.src='https://bit.ly/3tOfgIs'"
                  />
                  <h1 class="font-bold text-white w-full truncate text-ellipsis overflow-hidden p-2">
                    {anime.title}
                  </h1>
                  <p class="absolute top-0 left-0 py-1 px-2 bg-black bg-opacity-40 rounded-tl-xl rounded-br-xl">
                    {anime.eps}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>,
    );
  })
  .get("/dmca", (c) => {
    return c.render(
      <div>DMCA</div>,
    );
  });

export default basic;
