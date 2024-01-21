import { Hono } from "hono";
import getEpisodeData from "../services/anime-eps.ts";

const animeRoute = new Hono({ strict: false });

animeRoute
  .get("/", (c) => {
    return c.render(<div>Memek</div>);
  })
  .get("/episode/:slug", async (c) => {
    const slug = c.req.param("slug");
    if (!slug) {
      c.redirect("/");
    }
    const animeEps = await getEpisodeData(slug);
    return c.render(
      <>
        <iframe
          id="video"
          src={animeEps.streamUrl[0].url}
          frameborder="0"
        >
        </iframe>
        <div>
          {animeEps.streamUrl.map((anime) => (
            <button data-url={anime.url} onClick="showVideo(this.dataset.url)">
              {anime.res}
            </button>
          ))}
        </div>
        <div>
          <h3>Download Link</h3>
          {animeEps.downloadUrl.map((download) => (
            <div>
              <p>{download.provider}</p>
              {download.urls.map((url) => <a href={url.url}>{url.res}</a>)}
            </div>
          ))}
        </div>
      </>,
      {
        title: "Kuroi | Anime & Manga Indo",
        description: "Tempat Nonton Anime dan Baca Manga",
        url: "https://kuroi.deno.dev",
        image: "https://yourwebsite.com/your-image.png",
      },
      `function showVideo(url) {
  document.getElementById("video").src = url
}`,
    );
  });

export default animeRoute;
