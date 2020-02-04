import {qs} from "imagelogic-tools/src/dom/qs";

export class Stanza {
  onParmChange(type: string) {
    console.log("run");
    const input: HTMLInputElement = qs("[data-param-key]");
    const stanza: HTMLElement = qs(type);
    input.addEventListener("input", () => {
      stanza.setAttribute(input.dataset.paramKey, input.value);
    });
  }


}
