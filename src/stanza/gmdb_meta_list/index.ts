import {qs} from "imagelogic-tools/src/dom/qs";
import {api_url} from "../typescript/consts";

interface StanzaHtmlParam {
  api_url: string;
  query: string;
  offset: string;
  limit: string;
}

interface HTMLParams {
  num: number;
}


Stanza<StanzaHtmlParam>(function(stanza, params) {
  const data = myData;
  const htmlParams: HTMLParams = {
    num: 0
  };
  render(stanza, htmlParams);
});

const render = (stanza: StanzaInstance, params: HTMLParams) => {
  stanza.render({
    template: "stanza.html",
    parameters: params
  });
  stanza.select("#myBtn").addEventListener("click", () => {
    params.num += 1;
    render(stanza, params);
  });
};


const myData: APIResponse = {
  total: 9999,
  offset: 1,
  contents: [
    {
      gm_id: {
        href: "/media/SY37/",
        label: "SY37"
      },
      name: "BHI w/ heat-inactivated Fetal Bovine Serum and Glucose"
    },
    {
      gm_id: {
        href: "/media/SY43q",
        label: "SY43a"
      },
      name: "BL AGAR (GLUCOSE BLOOD LIVER AGAR)"
    }
  ],
  columns: [
    {
      key: "gm_id",
      label: "GM ID"
    },
    {
      key: "name",
      label: "NAME"
    },
  ]
};


interface APIResponse {
  total: number;
  offset: number;
  contents: Content[];
  columns: Column[];
}

interface Content {
  [key: string]: (string | LinkItem);
}

interface LinkItem {
  href: string;
  label: string;
}

interface Column {
  key: string;
  label: string;
}




