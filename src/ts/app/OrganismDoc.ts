import { MainDoc } from "./MainDoc";
import { getPram } from "./utils";
import { qs } from "imagelogic-tools/src/dom/qs";

export class OrganismDoc extends MainDoc {
  constructor() {
    super();
  }

  protected onReady() {
    super.onReady();
    setup();
    // const param: string = getPram();
    //
    // const info: HTMLElement = qs("#info");
    // info.setAttribute("tax_id", param);
    // //
    // const mediaWrapper: HTMLElement = qs("#media");
    // const mediaStanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
    // mediaStanza.setAttribute("limit", "10");
    // mediaStanza.setAttribute("column_names", "true");
    // mediaStanza.setAttribute("api_url", `http://growthmedium.org/sparqlist/api/gmdb_media_by_taxid?gmo_ids=${param}`);
    // mediaStanza.setAttribute("title", `Media with ${param}`);
    // mediaWrapper.append(mediaStanza);
  }
}

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
