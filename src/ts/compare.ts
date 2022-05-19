import { EVENT_CLICK, EVENT_READY } from "./app/Consts";
import { qs } from "imagelogic-tools/src/dom/qs";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setupCompareInput();
  });
  const setupCompareInput = () => {
    const table = qs<HTMLElement>("togostanza-gmdb-media-alignment-table");
    const ids = qs<HTMLInputElement>("#ids");
    const button = qs("#compareBtn");
    //

    button.addEventListener(EVENT_CLICK, () => {
      const value = ids.value
        .split(",")
        .reverse()
        .map((str) => str.trim())
        .join(",");
      table.setAttribute("gm_ids", value);
      table.style.display = "block";
    });
  };
})();
