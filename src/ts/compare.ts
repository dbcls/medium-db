import { EVENT_CLICK, EVENT_READY } from "./app/Consts";
import { Nullable, qs } from "yohak-tools";

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
    let queriedData: string[] = [];
    //
    const execute = () => {
      queriedData = ids.value.split(",").map((str) => str.trim());
      const value = queriedData.join(",");
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
    document.addEventListener("STANZA_ON_QUERY_DATA", (e: CustomEvent) => {
      queriedData = (e.detail as string[]).filter((str) => str !== "");
    });
    document.addEventListener("STANZA_ON_LOAD_DATA", (e: CustomEvent) => {
      console.log("ONLOAD", e);
      const response: MediaAlignmentTableResponse = e.detail;
      const loadedMedia: string[] = response.media.map((m) => m.gm_id);
      //
      const notFound = queriedData.filter((str) => !loadedMedia.includes(str));
      const errorMsg = notFound.length
        ? `Not found: ${notFound.join(", ")}`
        : "";
      qs("#errorMsg").textContent = errorMsg;
    });
  };
})();

export type MediaAlignmentTableResponse = {
  media: {
    gm_id: string;
    name: string;
    components: string[];
    organisms: string[];
  }[];
  organisms: {
    tax_id: string;
    name: string;
  }[];
  components: {
    gmo_id: string;
    name: string;
    parent: Nullable<string>;
    function: Nullable<string>;
  }[];
};
