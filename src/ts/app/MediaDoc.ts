import {MainDoc} from "./MainDoc";
import {getPram} from "./utils";
import {qs} from "imagelogic-tools/src/dom/qs";

export class MediaDoc extends MainDoc {
  constructor() {super();}

  protected onReady() {
    super.onReady();
    const param: string = getPram();

    const info: HTMLElement = qs("#info");
    const organisms: HTMLElement = qs("#organisms");
    const GMID: HTMLElement = qs("#GMID");
    info.setAttribute("gm_id", param);
    organisms.setAttribute("gm_id", param);
    GMID.innerText = param;
    const similarList: HTMLElement = qs("#similar");
    similarList.setAttribute("api_url", `http://growthmedium.org/sparqlist/api/gmdb_list_similar_media_by_gmid?gm_id=${param}`)
    similarList.setAttribute("title", `Similar Growth Media of ${param}`);
  }
}
