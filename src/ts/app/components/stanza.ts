import {qs} from "imagelogic-tools/src/dom/qs";

export class Stanza {
  func() {
    console.log("test");
    this.getVal();
  }

  getVal() {
    const input: HTMLInputElement = qs("[data-param-key='clst_id']");
    console.log(input.value);
    input.addEventListener("input", () => {
      qs(".output").innerText = input.value;
    });
  }


}
