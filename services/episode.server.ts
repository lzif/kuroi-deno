import axios from "axios";
import * as cheerio from "cheerio";
import { getRealSlug } from "./getSlug";

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
  $("div.vmiror:contains('YUp')").each((i, el) => {
    const url = $(el).find("a").attr("data-video");
    YUpUrl = url;
  });

  const resData = await axios.get(`https://anoboy.show${YUpUrl}`);
  const yup = resData.data;
  const yupHtml = cheerio.load(yup);

  const realUrls: StreamUrls[] = [];
  yupHtml("a.link").each((i, el) => {
    const a = yupHtml(el).attr("href");
    const res = yupHtml(el).text().trim();
    realUrls.push({ res, url: a });
  });
  return realUrls;
}

async function getEpisodeDownload(
  $: cheerio.CheerioAPI,
): Promise<DownloadUrls[]> {
  const downloadUrl: DownloadUrls[] = [];
  $("div.download > div#colomb > p > span").each((i, el) => {
    const provider = $(el).find("span").text();
    const urls: StreamUrls[] = [];
    $(el)
      .find("a")
      .each((i, el) => {
        const res = $(el).text();
        const url = $(el).attr("href");
        urls.push({ res, url });
      });
    downloadUrl.push({ provider, urls });
  });
  return downloadUrl;
}

async function getEpisodeInfo($: cheerio.CheerioAPI): Promise<Info> {
  const title = $("div.pagetitle > h1").text();
  const prevUrl = $("i.fa-fast-backward").parent().attr("href") || "none";
  const nextUrl =
    $("i.fa-fast-forward").parent().find("a").attr("href") || "none";
  const info: Info = { title, prevUrl, nextUrl };
  return info;
}

export default async function getEpisodeData(slug: string): Promise<Episode> {
  const realSlug = getRealSlug(slug);
  const res = await axios.get(`https://anoboy.show/${realSlug}/`);
  const html = res.data;
  const $: cheerio.CheerioAPI = cheerio.load(html);
  const [streamUrl, downloadUrl, info] = await Promise.all([
    getEpisodeStream($),
    getEpisodeDownload($),
    getEpisodeInfo($),
  ]);
  return { info, streamUrl, downloadUrl };
}
