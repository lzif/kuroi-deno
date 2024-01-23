const url = 'http://books.toscrape.com/';
const init = {headers:{"Referer":"https://www.yourupload.com/"}};
const request = new Request("https://s103.vidcache.net:8166/play/a202401224DhGK42qtGp/video.mp4");
try {
  const res = await fetch(request, init)
  //const html = await res.text();
  console.log(await res.blob())
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const title = doc.querySelector('title')?.textContent;
  console.log(title);
} catch(error) {
  console.log(error);
}
