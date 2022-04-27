import { EVENT_READY, URL_API_BASE } from "./app/Consts";
import { getData, getPram } from "./app/utils";
import { qs } from "imagelogic-tools/src/dom/qs";

document.addEventListener(EVENT_READY, () => setup());

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

const showSingleItem = async (id: string) => {
  qs("#singleItem").style.display = "block";
  //
  const data = await getData("gmdb_medium_by_gmid", `gm_id=${id}`);
  const hasName: boolean = data?.meta?.name !== "" && !!data?.meta?.name;
  const name = hasName ? data.meta.name : id;

  const info = qs("#info");
  info.setAttribute("gm_id", id);
  //
  const similar = qs("#similar");
  similar.setAttribute(
    "api_url",
    `${URL_API_BASE}gmdb_list_similar_media_by_gmid?gm_id=${id}`
  );
  similar.setAttribute("title", `Similar Growth Media of ${name}`);
  similar.setAttribute("column_sizes", "15,70,15");

  const organisms = qs("#organisms");
  organisms.setAttribute(
    "api_url",
    `${URL_API_BASE}gmdb_organisms_by_gmid?gm_id=${id}`
  );
  organisms.setAttribute("title", `Organisms cultured in ${name}`);
  organisms.setAttribute("column_sizes", "15,85");
};
