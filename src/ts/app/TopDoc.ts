import { MainDoc } from "./MainDoc";
import { setUpFreeSearch } from "./components/FreeSearch";
import { setUpTaxonFilter } from "./components/TaxonFilter";

export class TopDoc extends MainDoc {
  constructor() {
    super();
  }

  protected onLoadWin() {
    setUpFreeSearch();
    setUpTaxonFilter();
  }
}
