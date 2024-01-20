import * as cheerio from "cheerio";

export type NewEps = {
  title: string;
  episode: string;
  cover: string | undefined;
  url: string | undefined;
};
export type NewData = {
  allPages: string;
  pagination: string | null;
  item: NewEps[];
};
export async function getNewData(
  page: number,
): Promise<NewData> {
  try {
    const url = `https://anoboy.pro/episodes/${
      page == 1 ? "" : `page/${page}/`
    }`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const allPages = $("div.card .line-card p").html()!;
    const paginationHtml = cheerio.load($("div.pagination").html()!); 
    const pagination =[]
    paginationHtml("a,span").each((index, element) => {
      const item = {};
      item["text"] = $(element).text().trim();
      item["href"] = $(element).attr("href") ?  $(element).attr("href").replace("https://anoboy.pro","/anime"): null;
      item["class"] = $(element).attr("class");
      pagination.push(item);
    });

    const epsTerbaru: NewEps[] = [];
    $("div.main-col .xrelated").each((i, el) => {
      const listItem = {
        title: $(el).find("div.titlelist").text(),
        episode: $(el).find("div.eplist").text(),
        cover: $(el).find("img").attr("src"),
        url: $(el).find("a").attr("href")?.replace("https://anoboy.pro", ""),
      };
      epsTerbaru.push(listItem);
    });

    const result: NewData = { allPages, pagination, item: epsTerbaru };
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (err) {
    console.log(err);
    throw Error("terjadi kesalahan ketika ambil data");
  }
}
getNewData(3);
