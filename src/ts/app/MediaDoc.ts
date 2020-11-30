import {MainDoc} from "./MainDoc";
import {getPram} from "./utils";
import {qs} from "imagelogic-tools/src/dom/qs";

export class MediaDoc extends MainDoc {
  constructor() {super();}

  protected onReady() {
    super.onReady();
    const param: string = getPram();

    const info: HTMLElement = qs("#info");
    info.setAttribute("gm_id", param);

    const similarWrapper: HTMLElement = qs("#similar");
    const similarStanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
    similarStanza.setAttribute("limit", "10");
    similarStanza.setAttribute("column_names", "true");
    similarStanza.setAttribute("api_url", `http://growthmedium.org/sparqlist/api/gmdb_list_similar_media_by_gmid?gm_id=${param}`);
    similarStanza.setAttribute("title", `Similar Growth Media of ${param}`);
    similarWrapper.append(similarStanza);

    const organismsWrapper: HTMLElement = qs("#organisms");
    const organismsStanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
    organismsStanza.setAttribute("limit", "10");
    organismsStanza.setAttribute("column_names", "true");
    organismsStanza.setAttribute("api_url", `http://growthmedium.org/sparqlist/api/gmdb_organisms_by_gmid?gm_id=${param}`);
    organismsStanza.setAttribute("title", `Organisms cultured in ${param}`);
    setTimeout(() => {
      organismsWrapper.append(organismsStanza);
    }, 500);


    // const similarList: HTMLElement = qs("#similar");
  }
}
