import { Child, jsx } from "hono/middleware";
import { html, raw } from "hono/helper";
const App = ({
  children,
  metaInfo,
  script,
}: {
  children: Child;
  metaInfo: {
    title: string;
    url: string;
    description: string;
    image: string;
  };
  script: string;
}) => {
  return (
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metaInfo.title}</title>
        <meta name="title" content={metaInfo.title} />
        <meta name="description" content={metaInfo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaInfo.url} />
        <meta property="og:title" content={metaInfo.title} />
        <meta property="og:description" content={metaInfo.description} />
        <meta property="og:image" content={metaInfo.image} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={metaInfo.url} />
        <meta property="twitter:title" content={metaInfo.title} />
        <meta property="twitter:description" content={metaInfo.description} />
        <meta property="twitter:image" content={metaInfo.image} />
        <meta
          name="google-site-verification"
          content="Lssel9_Z2vke-k4LQdm-ZcxyYMz7lE6PAbvYL1pLVDY"
        />
        <meta name="htmx-config" content='{"includeIndicatorStyles": false}' />
        <link
          href="https://fonts.cdnfonts.com/css/poppins?styles=20394"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <style>
          {raw(
            `html {
   -webkit-tap-highlight-color: transparent;
   } 
   @keyframes fade-in {
     from { opacity: 0; }
   }

   @keyframes fade-out {
     to { opacity: 0; }
   }

   @keyframes slide-from-right {
     from { transform: translateX(90px); }
   }

   @keyframes slide-to-left {
     to { transform: translateX(-90px); }
   }

   .slide-it {
     view-transition-name: slide-it;
   }

   ::view-transition-old(slide-it) {
     animation: 180ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
     600ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
   }
   ::view-transition-new(slide-it) {
     animation: 420ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
     600ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
   }
   .htmx-indicator{
        opacity:0;
        transition: all 200ms ease-in;
        transform: translateY(100%);
    }
    .htmx-request .htmx-indicator{
    opacity:1;
    transform: translateY(0%);
  }
  .htmx-request.htmx-indicator{
      opacity:1;transform: translateY(0%);
  }`,
          )}
        </style>
      </head>
      <body
        class="bg-gray-900 text-white relative"
        style="font-family: 'Poppins', sans-serif;"
        hx-indicator=".htmx-indicator"
        hx-boost="true"
        hx-target=".main"
        hx-select=".main"
        hx-swap="outerHTML transition:true show:no-scroll"
      >
        <div class="w-full bg-sky-600 p-2 mb-2 sticky top-0 z-50">
          <header class="w-full mb-2 text-2xl font-bold text-center">
            <a href="/">Kuroi</a>
          </header>
          <nav class="flex justify-around p-1">
            <a href="/anime">Anime</a>
            <a href="/manga">Manga</a>
          </nav>
        </div>
        <span class="htmx-indicator fixed bottom-0 w-full p-2 text-center bg-black bg-opacity-40 z-50">
          Loading ...
        </span>
        <div class="main">
          {children}
          {script &&
            html`<script>
              ${raw(script)};
            </script>`}
        </div>
        {Deno.env.get("TERMUX_APK_RELEASE") && (
          <div>
            <script src="//cdn.jsdelivr.net/npm/eruda"></script>
            <script>eruda.init();</script>
          </div>
        )}
      </body>
    </html>
  );
};

export default App;
