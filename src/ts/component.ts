import { EVENT_READY } from "./app/Consts";
import { getPram } from "./app/utils";
import { qs } from "imagelogic-tools/src/dom/qs";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setup();
  });

  const setup = () => {
    const param: string = getPram();

    const info: HTMLElement = qs("#info");
    info.setAttribute("gmo_id", param);
    //
    const mediaStanza: HTMLElement = qs("#media");
    mediaStanza.setAttribute(
      "api_url",
      `http://growthmedium.org/sparqlist/api/gmdb_media_by_gmoid?gmo_id=${param}`
    );
    mediaStanza.setAttribute("title", `Media with ${param}`);
  };
})();
