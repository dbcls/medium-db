import { EVENT_READY } from "./app/Consts";
import { getPram } from "./app/utils";
import { qs } from "imagelogic-tools/src/dom/qs";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setup();
  });

  const setup = () => {
    const id: string = getPram();
    const info = qs("#info");
    info.setAttribute("gm_id", id);
    //
    const similar = qs("#similar");
    similar.setAttribute(
      "api_url",
      `http://growthmedium.org/sparqlist/api/gmdb_list_similar_media_by_gmid?gm_id=${id}`
    );
    similar.setAttribute("title", `Similar Growth Media of ${id}`);

    const organisms = qs("#organisms");
    organisms.setAttribute(
      "api_url",
      `http://growthmedium.org/sparqlist/api/gmdb_organisms_by_gmid?gm_id=${id}`
    );
    organisms.setAttribute("title", `Organisms cultured in ${id}`);
  };
})();
