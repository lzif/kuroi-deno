var axios = require("axios");
var cheerio = require("cheerio");
var format = require("./formatUrl");

async function getNewEps() {
  const res = await axios.get("https://anoboy.pro/");
  const html = res.data;
  const $ = cheerio.load(html);
  const data = [];
  $("div.container>.main-col>.xrelated-box>.xrelated").each((i, el) => {
    const url = "/anime/" + format.url($(el).find("a").attr("href"));
    const img = format.img($(el).find("img").attr("src"));
    const eps = $(el).find(".eplist").text();
    const title = $(el).find(".titlelist").text();

    data.push({ url, title, eps, img });
  });
  return data;
}

module.exports = getNewEps
