import { getPram } from "./app/utils";
import { EVENT_READY } from "./app/Consts";
import { qs } from "imagelogic-tools/src/dom/qs";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setup();
  });
  const setup = () => {
    const id: string = getPram();
    const info: HTMLElement = qs("#info");
    info.setAttribute("tax_id", id);

    const phenotype: HTMLElement = qs("#phenotype");
    phenotype.setAttribute("tax_id", id);

    const media: HTMLElement = qs("#media");
    media.setAttribute(
      "api_url",
      `http://growthmedium.org/sparqlist/api/gmdb_media_by_taxid?tax_id=${id}`
    );
    media.setAttribute("title", `Media with ${id}`);
  };
})();
