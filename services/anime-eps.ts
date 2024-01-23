import * as cheerio from "cheerio";
import { getRealSlug } from "./getSlug.ts";

export type StreamUrls = { res: string; url: string | undefined };
export type DownloadUrls = { provider: string; urls: StreamUrls[] };
export type Info = {
  title: string;
  prevUrl: string | "none";
  nextUrl: string | "none";
};
export type Episode = {
  streamUrl: StreamUrls[];
  downloadUrl: DownloadUrls[];
  info: Info;
};
async function getEpisodeStream($: cheerio.CheerioAPI): Promise<StreamUrls[]> {
  let YUpUrl;
  $("div.vmiror:contains('YUp')").each((_, el) => {
    const url = $(el).find("a").attr("data-video");
    YUpUrl = url;
  });

  const resData = await fetch(`https://anoboy.show${YUpUrl}`);
  const yup = await resData.text();
  const yupHtml = cheerio.load(yup);

  const realUrls: StreamUrls[] = [];
  yupHtml("a.link").each((_, el) => {
    const a = yupHtml(el).attr("href");
    const res = yupHtml(el).text().trim();
    realUrls.push({ res, url: a });
  });
  return realUrls;
}

function getEpisodeDownload(
  $: cheerio.CheerioAPI,
): DownloadUrls[] {
  const downloadUrl: DownloadUrls[] = [];
  $("div.download > div#colomb > p > span").each((_, el) => {
    const provider = $(el).find("span").text();
    const urls: StreamUrls[] = [];
    $(el)
      .find("a")
      .each((_, el) => {
        const res = $(el).text();
        const url = $(el).attr("href");
        urls.push({ res, url });
      });
    downloadUrl.push({ provider, urls });
  });
  return downloadUrl;
}

function getEpisodeInfo($: cheerio.CheerioAPI): Info {
  const title = $("div.pagetitle > h1").text();
  const prevUrl = $("i.fa-fast-backward").parent().attr("href") || "none";
  const nextUrl = $("i.fa-fast-forward").parent().find("a").attr("href") ||
    "none";
  const info: Info = { title, prevUrl, nextUrl };
  return info;
}

export default async function getEpisodeData(slug: string): Promise<Episode> {
  const realSlug = getRealSlug(slug);
  const res = await fetch(`https://anoboy.show/${realSlug}/`);
  const html = await res.text();
  const $: cheerio.CheerioAPI = cheerio.load(html);
  const [streamUrl, downloadUrl, info] = await Promise.all([
    getEpisodeStream($),
    getEpisodeDownload($),
    getEpisodeInfo($),
  ]);
  console.log({ info, streamUrl, downloadUrl });
  return { info, streamUrl, downloadUrl };
}

//getEpisodeData("2024-01-undead-unluck-episode-15")
