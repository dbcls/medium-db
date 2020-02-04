import {DocBase} from "./DocBase";
import {Stanza} from "./components/stanza";

export class MainDoc extends DocBase {
  private stanza: Stanza;

  constructor() {
    super();
  }

  protected onReady() {
    this.stanza = new Stanza();
    if (document.body.classList.contains("gms_by_clstid")) {
      this.stanza.onParmChange("togostanza-gms_by_clstid");
    }
    if (document.body.classList.contains("gms_by_tid")) {
      this.stanza.onParmChange("togostanza-gms_by_tid");
    }
    if (document.body.classList.contains("growth_medium")) {
      this.stanza.onParmChange("togostanza-growth_medium");
    }
  }

}
