import { EVENT_READY } from "./app/Consts";
import { getPram } from "./app/utils";
import { qs } from "imagelogic-tools/src/dom/qs";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setup();
  });

  const setup = () => {
    const id: string = getPram();
    const info: HTMLElement = qs("#info");
    info.setAttribute("tax_id", id);

    const media: HTMLElement = qs("#media");
    media.setAttribute(
      "api_url",
      `http://growthmedium.org/sparqlist/api/gmdb_media_by_taxid?tax_id=${id}`
    );
    media.setAttribute("title", `Media with ${id}`);
    media.setAttribute("column_sizes", "15,85");

    //
    const organism: HTMLElement = qs("#organisms");
    organism.setAttribute(
      "api_url",
      `http://growthmedium.org/sparqlist/api/gmdb_infraspecific_list_by_taxid?tax_id=${id}`
    );
    organism.setAttribute("title", `Organisms with ${id}`);
    organism.setAttribute("column_sizes", "15,15,70");
  };
})();
