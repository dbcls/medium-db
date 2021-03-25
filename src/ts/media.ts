import { EVENT_READY } from "./app/Consts";
import { getPram } from "./app/utils";
import { qs } from "imagelogic-tools/src/dom/qs";

(() => {
  document.addEventListener(EVENT_READY, () => {
    setup();
  });

  const setup = () => {
    const id: string = getPram();
    !!id ? showSingleItem(id) : showMediaList();
  };

  const showMediaList = () => {
    qs("#all").style.display = "block";
    const list = qs("#list");
    list.setAttribute(
      "api_url",
      "http://growthmedium.org/sparqlist/api/list_media"
    );
    list.setAttribute("column_sizes", "15,85");
  };

  const showSingleItem = (id: string) => {
    qs("#singleItem").style.display = "block";

    const info = qs("#info");
    info.setAttribute("gm_id", id);
    //
    const similar = qs("#similar");
    similar.setAttribute(
      "api_url",
      `http://growthmedium.org/sparqlist/api/gmdb_list_similar_media_by_gmid?gm_id=${id}`
    );
    similar.setAttribute("title", `Similar Growth Media of ${id}`);
    similar.setAttribute("column_sizes", "15,70,15");

    const organisms = qs("#organisms");
    organisms.setAttribute(
      "api_url",
      `http://growthmedium.org/sparqlist/api/gmdb_organisms_by_gmid?gm_id=${id}`
    );
    organisms.setAttribute("title", `Organisms cultured in ${id}`);
    organisms.setAttribute("column_sizes", "15,85");
  };
})();
