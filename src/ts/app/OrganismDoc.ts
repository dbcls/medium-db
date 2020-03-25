import {MainDoc} from "./MainDoc";
import {getPram} from "./utils";
import {qs} from "imagelogic-tools/src/dom/qs";

export class OrganismDoc extends MainDoc {
  constructor() {super();}

  protected onReady() {
    super.onReady();
    const param: string = getPram();

    const info: HTMLElement = qs("#info");
    const media: HTMLElement = qs("#media");
    const TAXID:HTMLElement = qs("#TAXID");
    info.setAttribute("tax_id", param);
    media.setAttribute("tax_id", param);
    TAXID.innerText = param;
  }
}

