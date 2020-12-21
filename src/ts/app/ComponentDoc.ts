import {MainDoc} from "./MainDoc";
import {getPram} from "./utils";
import {qs} from "imagelogic-tools/src/dom/qs";

export class ComponentDoc extends MainDoc {
  constructor() {super();}

  protected onReady() {
    super.onReady();
    const param: string = getPram();

    const info: HTMLElement = qs("#info");
    info.setAttribute("gmo_id", param);
    //
    const mediaWrapper: HTMLElement = qs("#media");
    const mediaStanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
    mediaStanza.setAttribute("limit", "10");
    mediaStanza.setAttribute("column_names", "true");
    mediaStanza.setAttribute("api_url", `http://growthmedium.org/sparqlist/api/gmdb_media_by_gmoid?gmo_id=${param}`);
    mediaStanza.setAttribute("title", `Media with ${param}`);
    mediaWrapper.append(mediaStanza);
  }
}
