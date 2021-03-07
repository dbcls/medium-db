import { MainDoc } from "./MainDoc";
import { getPram } from "./utils";
import { qs } from "imagelogic-tools/src/dom/qs";

export class TaxonDoc extends MainDoc {
  constructor() {
    super();
  }
  protected onLoadWin() {
    super.onLoadWin();
    setup();
  }
}

const setup = () => {
  const id: string = getPram();
  const info: HTMLElement = qs("#info");
  info.setAttribute("tax_id", id);
};
