import { Hono } from "hono";
import { getNewEps } from "../services/anime-news.ts";
import {
  renderToReadableStream,
  Suspense,
} from "https://deno.land/x/hono@v3.12.5/jsx/streaming.ts";
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

`<ul class="grid grid-cols-2 gap-2">                                              <% newEps.forEach(function(item) { %>                                          <li                                                                              hx-boost="true"                                                                class="flex flex-col border rounded-xl bg-slate-900 border-gray-700 shadow-slate-700/[.7]"                                                                  >                                                                                <img                                                                             class="w-full aspect-video rounded-t-xl"                                       src="<%= item.img %>"                                                          alt="<%= item.title %>"                                                      />                                                                             <div class="p-4 md:p-5">                                                         <h3                                                                              class="text-lg font-bold text-white w-full truncate text-ellipsis overflow-hidden"                                                                          >                                                                                <%= item.title %>                                                            </h3>                                                                          <!-- p class="mt-1 text-gray-400">                                     Some quick example text to build on the card title and make up the bulk of the card's content.
    </p -->
              <a
                class="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
                href="<%= item.url %>"
              >
                Tonton
              </a>
            </div>
          </li>
          <% }); %>
        </ul>`;
