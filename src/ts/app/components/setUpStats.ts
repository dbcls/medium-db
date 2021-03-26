import { qs } from "imagelogic-tools/src/dom/qs";

export const setUpStats = () => {
  setNum(API_MEDIA, qs("#numMedia"));
  setNum(API_COMPONENTS, qs("#numComponents"));
  setNum(API_ORGANISMS, qs("#numOrganisms"));
};

const API_MEDIA: string = "http://growthmedium.org/sparqlist/api/list_media";
const API_ORGANISMS: string =
  "http://growthmedium.org/sparqlist/api/list_organisms";
const API_COMPONENTS: string =
  "http://growthmedium.org/sparqlist/api/list_components";

const setNum = async (api: string, elm: HTMLElement) => {
  const num = await getCount(api);
  elm.innerText = num.toLocaleString("ja");
};

const getCount = async (api: string): Promise<number> => {
  const response = await fetch(api, {
    method: "POST",
    mode: "cors",
    body: `limit=10`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data: any = await response.json();
  return parseInt(data.total);
};
