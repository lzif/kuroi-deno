const axios = require('axios');
const cheerio = require('cheerio');

async function getReleaseSchedule() {
  const res = await axios.get("https://anoboy.pro/jadwal-rilis/");
  const html = res.data;
  const $ = cheerio.load(html);

  const title = $("div.line-card > h2").text();
  let info;
  const scheduleDay = [];

  $("div.post-content > div.infolist").each((i, el) => {
    if (i == 0) {
      info = $(el).text();
    } else {
      const scheduleItem = {
        day: $(el).find("h3").text().trim(),
        list: [],
      };
      $(el)
        .find("ul > li")
        .each((i, el) => {
          const anime = $(el).find("a").text();
          const animeUrl = $(el).find("a").attr("href");
          const schedule = $(el)
            .contents()
            .filter((i, el) => el.nodeType === 3)
            .text()
            .trim();
          scheduleItem.list.push({ anime, animeUrl, schedule });
        });
      scheduleDay.push(scheduleItem);
    }
  });

  const releaseSchedule = {
    title,
    info,
    scheduleDay,
  };
  return releaseSchedule;
}

module.exports = getReleaseSchedule
