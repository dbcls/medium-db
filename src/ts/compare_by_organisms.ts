import { EVENT_CLICK, EVENT_READY } from "./app/Consts";
import { Nullable, qs } from "yohak-tools";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setupCompareInput();
  });

  const fetchMedia = async (tax_ids: string[]): Promise<string[]> => {
    const API = "http://growthmedium.org/sparqlist/api/gmdb_media_by_taxon";
    const response = await fetch(API, {
      method: "POST",
      mode: "cors",
      body: `tax_ids=${tax_ids}&limit=${100}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data: MediaByTaxonResponse = await response.json();
    return data.contents.map((item) => item.gm_id);
  };
  const filterTaxIds = async (tax_ids: string[]): Promise<string[]> => {
    const API =
      "http://growthmedium.org/sparqlist/api/gmdb_taxa_with_media_within_genus";
    const response = await fetch(API, {
      method: "POST",
      mode: "cors",
      body: `tax_ids=${tax_ids}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return await response.json();
  };

  const setError = (queried: string[], filtered: string[]) => {
    const errorData = queried.filter((str) => !filtered.includes(str));
    const errorMsg = errorData.length
      ? `Not found: ${errorData.join(", ")}`
      : "";
    qs("#errorMsg").textContent = errorMsg;
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
      const filteredData = await filterTaxIds(queriedData);
      const gmIds = await fetchMedia(filteredData);
      const value = gmIds.join(",");
      setError(queriedData, filteredData);
      table.setAttribute("gm_ids", value);
      table.setAttribute("prioritized_tax_ids", filteredData.join(","));
      table.style.display = "block";
      //
      const url = new URL(location.href);
      url.searchParams.set("tax_ids", queriedData.join(","));
      history.pushState(null, "", url);
    };

    if (queriedTaxIds) {
      ids.value = queriedTaxIds;
      execute();
    } else {
      // ids.value = "1111041,1658616,760260";
      ids.value = "77580,28024,2771,38275";
    }
    //

    button.addEventListener(EVENT_CLICK, () => execute());
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
