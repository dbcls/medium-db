import {MainDoc} from "./MainDoc";
import {getPram} from "./utils";
import {qs} from "imagelogic-tools/src/dom/qs";

export class ComponentDoc extends MainDoc {
  constructor() {super();}

  protected  onReady() {
    super.onReady();
    const param:string = getPram();

    const info:HTMLElement = qs("#info");
    const media:HTMLElement = qs("#media");
    info.setAttribute("query", param);
    media.setAttribute("query", param);
  }
}
