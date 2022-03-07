import { join } from "path";
import * as util from "gulp-util";
import { ENV_DEV } from "./utils/consts";
import { IProfile } from "imagelogic-gulp";
import { IBuild } from "imagelogic-gulp";

const PROFILE_PAGES: string = "pages";
const BUILD_ALL: string = "all";

const SRC_DIR = join(process.cwd(), "src");
const PUBLIC_DIR = join(process.cwd(), "public_static");
const PROD_DIR = join(PUBLIC_DIR);
const ASSETS_DIR = join(PROD_DIR, "assets");

class Config {
  env: string = ENV_DEV;

  profile: IProfile[] = [
    {
      name: PROFILE_PAGES,
      pug: {
        src: join(SRC_DIR, "pug"),
        dest: join(PROD_DIR),
        watch: ["pug", "json", "js", "svg", "html"],
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
          "media_alignment/index.html": "media_alignment.pug",
        },
      },
      less: {
        src: join(SRC_DIR, "less"),
        dest: join(ASSETS_DIR, "css"),
        watch: ["less"],
        files: {
          "main.css": "main.less",
        },
        autoprefixer: {},
      },
      ts: {
        src: join(SRC_DIR, "ts"),
        dest: join(ASSETS_DIR, "js"),
        watch: ["ts"],
        files: {
          "top.js": "top.ts",
          "search.js": "search.ts",
          "component.js": "component.ts",
          "media.js": "media.ts",
          "organism.js": "organism.ts",
          "taxon.js": "taxon.ts",
          "media-alignment.js": "media-alignment.ts",
        },
      },
      sync: [
        {
          name: "img",
          src: join(SRC_DIR, "assets/img"),
          dest: join(ASSETS_DIR, "images"),
          watch: false,
        },
        {
          name: "libs",
          src: join(SRC_DIR, "assets/libs"),
          dest: join(ASSETS_DIR, "libs"),
          watch: true,
        },
        {
          name: "fonts",
          src: join(SRC_DIR, "assets/fonts"),
          dest: join(ASSETS_DIR, "fonts"),
          watch: false,
        },
        {
          name: "redirects",
          src: join(SRC_DIR, "redirects"),
          dest: PROD_DIR,
          watch: false,
        },
      ],
    },
  ];
  build: IBuild[] = [
    {
      name: BUILD_ALL,
      clean: [join(PROD_DIR)],
      profiles: [PROFILE_PAGES],
      livereload: {
        dir: PUBLIC_DIR,
        ext: ["php", "html", "css", "js", "jpg", "gif", "svg", "png"],
      },
      imagemin: {
        path: join(ASSETS_DIR, "images"),
        pngquant: [0.4, 1],
        jpegmin: 80,
      },
      server: {
        base: PUBLIC_DIR,
      },
    },
  ];

  changeEnv(env: string) {
    this.env = env;
  }

  constructor() {
    util.log("making config");
  }
}

const config: Config = new Config();
export = config;
