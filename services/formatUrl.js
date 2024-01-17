function slug(slug) {
  const b = slug.split("/");
  const c = b.slice(-2);
  const result = c[0].slice(8);
  return result;
}
function img(url) {
  const a = url.split("/");
  const b = "https://ik.imagekit.io/i1s54dlkb/" + a.slice(4).join("/");
  return b;
}

function url(url){
  const result = url.replace("https://anoboy.pro/","")
  return result
}
module.exports = {
  slug,
  img,
  url
};

//console.log(slug("https://anoboy.pro/2024-01-metallic-rouge/"))
