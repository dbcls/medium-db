import { getData, getPram } from "./app/utils";
import { EVENT_READY } from "./app/Consts";
import { qs } from "imagelogic-tools/src/dom/qs";

document.addEventListener(EVENT_READY, () => setup());

const setup = () => {
  const id: string = getPram();
  !!id ? showSingleItem(id) : showOrganismList();
};
const showOrganismList = () => {
  qs("#all").style.display = "block";
  const list = qs("#list");
  list.setAttribute(
    "api_url",
    "http://growthmedium.org/sparqlist/api/list_organisms"
  );
  list.setAttribute("column_sizes", "10,40,50");
};
const showSingleItem = async (id: string) => {
  qs("#singleItem").style.display = "block";
  //
  const data = await getData("gmdb_organism_by_taxid", `tax_id=${id}`);
  const name = data?.scientific_name ?? id;

  const info: HTMLElement = qs("#info");
  info.setAttribute("tax_id", id);

  const phenotype: HTMLElement = qs("#phenotype");
  phenotype.setAttribute("tax_id", id);

  const media: HTMLElement = qs("#media");
  media.setAttribute(
    "api_url",
    `http://growthmedium.org/sparqlist/api/gmdb_media_by_taxid?tax_id=${id}`
  );
  media.setAttribute("column_sizes", "20,80");
  media.setAttribute("title", `Media with ${name}`);
};
