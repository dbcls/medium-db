import {MainDoc} from "./MainDoc";
import {qs} from "imagelogic-tools/src/dom/qs";
import {fromEvent} from "rxjs";
import {debounceTime, map, tap} from "rxjs/operators";


export class TopDoc extends MainDoc {
  constructor() {
    super();
  }

  protected onReady() {
    const input: HTMLInputElement = qs("#queryInput");
    const media: HTMLElement = qs("#media");
    const components: HTMLElement = qs("#components");
    const organisms: HTMLElement = qs("#organisms");

    fromEvent(input, "input").pipe(
      map(r => (r.currentTarget as HTMLInputElement).value),
      debounceTime(500),
    ).subscribe(r => {
      media.setAttribute("query", r);
      components.setAttribute("query", r);
      organisms.setAttribute("query", r);
    });

  }

}
