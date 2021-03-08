import { MainDoc } from "./MainDoc";
import { getPram } from "./utils";
import { qs } from "imagelogic-tools/src/dom/qs";

export class ComponentDoc extends MainDoc {
  constructor() {
    super();
  }

  protected onReady() {
    super.onReady();
    setup();
  }
}

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
