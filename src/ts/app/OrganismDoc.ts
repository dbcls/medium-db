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
