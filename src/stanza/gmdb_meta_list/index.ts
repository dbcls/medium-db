interface StanzaHtmlParam {
  api_url: string;
  query: string;
  offset: string;
  limit: string;
}

interface HTMLParams {
  columnLabels: string[];
  data: Item[][];
  page: number;
}


Stanza<StanzaHtmlParam>(function(stanza, params) {
  render(stanza, processData(myData, 1));
});


const render = (stanza: StanzaInstance, params: HTMLParams) => {
  stanza.render({
    template: "stanza.html",
    parameters: params
  });
  stanza.select("#myBtn").addEventListener("click", () => {
    const data = processData(myData, params.page + 1);
    render(stanza, data);
  });
};

const processData = (response: APIResponse, page: number): HTMLParams => {
  const columnLabels: string[] = response.columns.map(item => item.label);
  const keys: string[] = response.columns.map(item => item.key);
  const data: Item[][] = response.contents.map(item => {
    const result: Item[] = [];
    keys.forEach(key => {
      const value = item[key];
      result.push(value);
    });
    return result;
  });

  return {
    page: page,
    columnLabels,
    data: data
  };
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


type Item = (string | LinkItem);

interface APIResponse {
  total: number;
  offset: number;
  contents: Content[];
  columns: Column[];
}

interface Content {
  [key: string]: Item;
}

interface LinkItem {
  href: string;
  label: string;
}

interface Column {
  key: string;
  label: string;
}




