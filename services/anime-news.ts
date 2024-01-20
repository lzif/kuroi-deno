import * as cheerio from "cheerio";
import * as format from "./formatUrl.ts";
interface Anime {
  url: string;
  title: string;
  eps: string;
  img: string;
}

export async function getNewEps(): Promise<Anime[]> {
  const res = await fetch("https://anoboy.pro/");
  const html = await res.text();
  const $ = cheerio.load(html);
  const data: Anime[] = [];
  $("div.container > .main-col > .xrelated-box > .xrelated").each((i, el) => {
    const url = `/anime${format.url($(el).find("a").attr("href"))}`;
    const img = format.img($(el).find("img").attr("src")!);
    const eps = $(el).find(".eplist").text();
    const title = $(el).find(".titlelist").text();

    data.push({ url, title, eps, img });
  });
  //console.log(data);
  return data;
}
