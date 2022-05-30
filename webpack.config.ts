import { makeConfig } from "./webpack/makeConfig";
import { join } from "path";
import historyApiFallback = require("connect-history-api-fallback");
//
const CWD = process.cwd();
const DIR_SRC = join(CWD, "src");
const DIR_PUBLIC = join(CWD, "public_static");
const DIR_ASSETS = join(DIR_PUBLIC, "assets");
//
export default makeConfig({
  output: DIR_PUBLIC,
  server: {
    root: DIR_PUBLIC,
    watch: `${DIR_SRC}/**/*.*`,
    browserSync: {
      middleware: [
        historyApiFallback({
          rewrites: [
            { from: /^\/about\/*/, to: "/about/index.html" },
            { from: /^\/search\/*/, to: "/search/index.html" },
            { from: /^\/statistics\/*/, to: "/statistics/index.html" },
            {
              from: /^\/media_alignment\/*/,
              to: "/media_alignment/index.html",
            },
            { from: /^\/taxon\/*/, to: "/taxon/index.html" },
            { from: /^\/medium\/*/, to: "/medium/index.html" },
            { from: /^\/component\/*/, to: "/component/index.html" },
            { from: /^\/organism\/*/, to: "/organism/index.html" },
            { from: /^\/compare\/*/, to: "/compare/index.html" },
          ],
        }),
      ],
    },
  },
  pug: {
    src: join(DIR_SRC, "pug"),
    dest: join(DIR_PUBLIC),
    data: ["_include/settings.js", "_include/meta.js"],
    files: {
      "index.html": "top.pug",
      "about/index.html": "about.pug",
      "statistics/index.html": "statistics.pug",
      "medium/index.html": "medium.pug",
      "component/index.html": "component.pug",
      "organism/index.html": "organism.pug",
      "taxon/index.html": "taxon.pug",
      "search/index.html": "search.pug",
      "compare/index.html": "compare.pug",
      "media_alignment/index.html": "media_alignment.pug",
    },
  },
  less: {
    src: join(DIR_SRC, "less"),
    dest: join(DIR_ASSETS, "css"),
    files: {
      "main.css": "main.less",
    },
  },
  ts: {
    src: join(DIR_SRC, "ts"),
    dest: join(DIR_ASSETS, "js"),
    files: {
      "top.js": "top.ts",
      "search.js": "search.ts",
      "component.js": "component.ts",
      "media.js": "media.ts",
      "organism.js": "organism.ts",
      "taxon.js": "taxon.ts",
      "compare.js": "compare.ts",
      "media-alignment.js": "media-alignment.ts",
    },
  },
  copy: [
    {
      from: join(DIR_SRC, "assets/libs"),
      to: join(DIR_ASSETS, "libs"),
    },
    {
      from: join(DIR_SRC, "assets/img"),
      to: join(DIR_ASSETS, "images"),
    },
    {
      from: join(DIR_SRC, "redirects"),
      to: join(DIR_PUBLIC),
    },
  ],
});
