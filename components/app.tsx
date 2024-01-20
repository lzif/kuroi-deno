import { Child, jsx } from "hono/middleware";

const App = ({
  children,
  metaInfo,
}: {
  children: Child;
  metaInfo: { title: string; url: string; description: string; image: string };
}) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />{" "}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metaInfo.title}</title>
        <meta name="title" content={metaInfo.title} />
        <meta name="description" content={metaInfo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaInfo.url} />{" "}
        <meta property="og:title" content={metaInfo.title} />
        <meta property="og:description" content={metaInfo.description} />
        <meta property="og:image" content={metaInfo.image} />
        <meta property="twitter:card" content="summary_large_image" />{" "}
        <meta property="twitter:url" content={metaInfo.url} />
        <meta property="twitter:title" content={metaInfo.title} />
        <meta property="twitter:description" content={metaInfo.description} />
        <meta property="twitter:image" content={metaInfo.image} />
        <link rel="stylesheet" href="/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      </head>
      <body
        class="bg-gray-950 text-gray-50"
        style="font-family: 'Poppins', sans-serif;"
      >
        <div class="w-full bg-sky-600 p-2 wb-2" hx-boost>
          <header class="w-full wb-2 text-2xl font-bold text-center">
            <a href="/">Kuroi</a>
          </header>
          <nav class="flex justify-around p-1">
            <a href="/anime">Anime</a>
            <a href="/manga">Manga</a>
          </nav>
        </div>
        {children}
        <script src="//cdn.jsdelivr.net/npm/eruda"></script>
        <script>eruda.init();</script>
      </body>
    </html>
  );
};

export default App;