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
    const url = new URL(location.href);
    const queriedGmIds = url.searchParams.get("gm_ids");
    //
    const execute = () => {
      const value = ids.value
        .split(",")
        // .reverse()
        .map((str) => str.trim())
        .join(",");
      table.setAttribute("gm_ids", value);
      table.style.display = "block";
      //
      const url = new URL(location.href);
      url.searchParams.set("gm_ids", value);
      history.pushState(null, "", url);
    };

    if (queriedGmIds) {
      ids.value = queriedGmIds;
      execute();
    } else {
      ids.value = "HM_D00001,JCM_M333";
    }
    //

    button.addEventListener(EVENT_CLICK, () => execute());
  };
})();
