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
    info.setAttribute("gm_id", param);
    organisms.setAttribute("gm_id", param);
  }
}
