import { EVENT_READY } from "./app/Consts";
import { getPram } from "./app/utils";
import { qs } from "imagelogic-tools/src/dom/qs";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setup();
  });

  const setup = () => {
    const id: string = getPram();
    const info: HTMLElement = qs("#info");
    info.setAttribute("tax_id", id);
  };
})();
