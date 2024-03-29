import { EVENT_READY } from "./app/Consts";
import { getData, getPram } from "./app/utils";
import { qs } from "imagelogic-tools/src/dom/qs";

document.addEventListener(EVENT_READY, () => setup());

const setup = () => {
  const id: string = getPram();
  !!id ? showSingleItem(id) : showComponentList();
};

const showComponentList = async () => {
  const list = qs("#list");
  list.setAttribute(
    "api_url",
    "http://growthmedium.org/sparqlist/api/list_components"
  );
  list.setAttribute("column_sizes", "11,89");
};

const showSingleItem = async (id: string) => {
  qs("#singleItem").style.display = "block";
  //
  const data = await getData("gmdb_component_by_gmoid", `gmo_id=${id}`);
  const name = data?.pref_label ?? id;

  const info: HTMLElement = qs("#info");
  info.setAttribute("gmo_id", id);
  //
  const mediaStanza: HTMLElement = qs("#media");
  mediaStanza.setAttribute(
    "api_url",
    `http://growthmedium.org/sparqlist/api/gmdb_media_by_gmoid?gmo_id=${id}`
  );
  mediaStanza.setAttribute("title", `Media with ${name}`);
  mediaStanza.setAttribute("column_sizes", "15,85");
};
