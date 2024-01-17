var axios = require("axios");
var cheerio = require("cheerio");
var format = require("./formatUrl");

async function fetchData(slug) {
  try {
    const url = `https://anoboy.pro/${slug}/`;
    console.log(url);
    const res = await axios.get(url);
    const html = res.data;
    const $ = cheerio.load(html);

    return $;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}

async function info(slug) {
  const $ = await fetchData(slug);

  const title = $(".ptitle").text();
  const poster = format.img($("img.responsive").first().attr("src"));

  const infoPost = [];
  $(".infopost>li").each((i, el) => {
    const item = $(el).text();
    infoPost.push(item);
  });

  const sinops = $(".sinops").text().replace("\n", "").trim();

  const cdownloadList = [];
  $("div.downloadlist").each((i, el) => {
    cdownloadList.push($(el).text().trim());
  });
  const clinkList = [];
  $("div.clinklist").each((i, el) => {
    const linkList = [];
    $(el)
      .find(".ulinklist>li>a")
      .each((i, el) => {
        const url = format.url($(el).attr("href"));
        const title = $(el).text();
        linkList.push({ title, url });
      });
    clinkList.push(linkList);
  });

  let downloadList = cdownloadList.map((k, i) => {
    return { title :[k], linkList: clinkList[i] };
  });

  const data = { title, poster, infoPost, sinops, downloadList };
  console.log(JSON.stringify(data, null, 2));
  return data;
}

async function episode(slug) {
  console.log(slug.slice(8))
}

module.exports = info

const url = "2024-01-ishura-episode-2";
//episode(url);
