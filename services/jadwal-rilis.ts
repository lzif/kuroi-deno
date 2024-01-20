import * as cheerio from "cheerio";

type ListAnime = {
  anime:string;animeUrl:string;schedule:string
}
type ScheduleDay = {
  day:string;
  list:ListAnime[]
}

export default async function getReleaseSchedule() {
  const res = await fetch("https://anoboy.pro/jadwal-rilis/");
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $("div.line-card > h2").text();
  let info;
  const scheduleDay:ScheduleDay[] = [];

  $("div.post-content > div.infolist").each((i, el) => {
    if (i == 0) {
      info = $(el).text();
    } else {
      const scheduleItem:ScheduleDay = {
        day: $(el).find("h3").text().trim(),
        list: [],
      };
      $(el)
        .find("ul > li")
        .each((_, el) => {
          const anime = $(el).find("a").text();
          const animeUrl = $(el).find("a").attr("href")!;
          const schedule = $(el)
            .contents()
            .filter((_, el) => el.nodeType === 3)
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
  console.log(releaseSchedule)
  return releaseSchedule;
}

getReleaseSchedule()
