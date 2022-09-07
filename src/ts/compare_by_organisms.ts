import { EVENT_CLICK, EVENT_READY } from "./app/Consts";
import { Nullable, qs } from "yohak-tools";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setupCompareInput();
  });

  const fetchMedia = async (tax_ids: string[]) => {
    const API = "http://growthmedium.org/sparqlist/api/gmdb_media_by_taxon";
    const response = await fetch(API, {
      method: "POST",
      mode: "cors",
      body: `tax_ids=${tax_ids}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data: MediaByTaxonResponse = await response.json();
    return data.contents.map((item) => item.gm_id);
  };
  const setupCompareInput = () => {
    const table = qs<HTMLElement>("togostanza-gmdb-media-alignment-table");
    const ids = qs<HTMLInputElement>("#ids");
    const button = qs("#compareBtn");
    const url = new URL(location.href);
    const queriedTaxIds = url.searchParams.get("tax_ids");
    let queriedData: string[] = [];
    //
    const execute = async () => {
      queriedData = ids.value.split(",").map((str) => str.trim());
      console.log(queriedData);

      const gmIds = await fetchMedia(queriedData);
      const value = gmIds.join(",");
      table.setAttribute("gm_ids", value);
      table.style.display = "block";
      //
      const url = new URL(location.href);
      console.log(queriedData.join(","));
      url.searchParams.set("tax_ids", queriedData.join(","));
      history.pushState(null, "", url);
    };

    if (queriedTaxIds) {
      ids.value = queriedTaxIds;
      execute();
    } else {
      // ids.value = "1111041,1658616,760260";
      ids.value = "1111041,1658616,169489";
    }
    //

    button.addEventListener(EVENT_CLICK, () => execute());
    document.addEventListener("STANZA_ON_QUERY_DATA", (e: CustomEvent) => {
      // queriedData = (e.detail as string[]).filter((str) => str !== "");
      qs("#errorMsg").textContent = "";
    });
    document.addEventListener("STANZA_ON_LOAD_DATA", (e: CustomEvent) => {
      const response: MediaAlignmentTableResponse = e.detail;
      const loadedOrganisms: string[] = response.organisms.map((m) => m.tax_id);
      //
      const notFound = queriedData.filter(
        (str) => !loadedOrganisms.includes(str)
      );
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
export type MediaByTaxonResponse = {
  total: number;
  offset: number;
  limit: number;
  contents: {
    gm_id: string;
    name: string;
  }[];
};
