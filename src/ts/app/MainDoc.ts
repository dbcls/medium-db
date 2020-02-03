import {DocBase} from "./DocBase";
import {Stanza} from "./components/stanza";

export class MainDoc extends DocBase {
  private stanza: Stanza;

  constructor() {
    super();
  }

  protected onReady() {
    this.stanza = new Stanza();
    this.stanza.func();
  }

}
