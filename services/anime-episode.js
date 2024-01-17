const axios = require("axios");
const cheerio = require("cheerio");
const format = require("./formatUrl");
async function getEpisodeStream($) {
  let YUpUrl;
  $("div.vmiror:contains('YUp')").each((i, el) => {
    const url = $(el).find("a").attr("data-video");
    YUpUrl = url;
  });

  const resData = await axios.get(`https://anoboy.show${YUpUrl}`);
  const yup = resData.data;
  const yupHtml = cheerio.load(yup);

  const realUrls = [];
  yupHtml("a.link").each((i, el) => {
    const a = yupHtml(el).attr("href");
    const res = yupHtml(el).text().trim();
    realUrls.push({ res, url: a });
  });
  return realUrls;
}

async function getEpisodeDownload($) {
  const downloadUrl = [];
  $("div.download > div#colomb > p > span").each((i, el) => {
    const provider = $(el).find("span").text();
    const urls = [];
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

async function getEpisodeInfo($) {
  const title = $("div.pagetitle > h1").text();
  const prevUrl = $("i.fa-fast-backward").parent().attr("href") || "none";
  const nextUrl =
    $("i.fa-fast-forward").parent().find("a").attr("href") || "none";
  const info = { title, prevUrl, nextUrl };
  return info;
}

async function getEpisodeData(slug) {
  const realSlug = slug.slice(8);
  const res = await axios.get(`https://anoboy.show/${realSlug}/`);
  const html = res.data;
  const $ = cheerio.load(html);
  const [streamUrl, downloadUrl, info] = await Promise.all([
    getEpisodeStream($),
    getEpisodeDownload($),
    getEpisodeInfo($),
  ])
  console.log({ info, streamUrl, downloadUrl });
  return { info, streamUrl, downloadUrl };
}
module.exports = getEpisodeData;

const slug = "2024-01-metallic-rouge-episode-1"
//getEpisodeData(slug)
