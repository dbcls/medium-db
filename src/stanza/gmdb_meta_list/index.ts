Stanza<StanzaParams>(async function(stanza, stanzaParams) {
  stanza.render({
    template: "stanza.html",
    parameters: {}
  });
  const offset: number = 0;
  const data = await fetchData(stanzaParams.api_url, stanzaParams.keyword, offset, parseInt(stanzaParams.limit, 10));
  const htmlPrams: HTMLParams = processData(data, offset, stanzaParams);
  render(stanza, htmlPrams, stanzaParams);
});


const render = (stanza: StanzaInstance, htmlParams: HTMLParams, stanzaParams: StanzaParams) => {
  const limit: number = parseInt(stanzaParams.limit, 10);
  stanza.render({
    template: "stanza.html",
    parameters: htmlParams
  });
  stanza.select("#btnPrev")?.addEventListener("click", async() => {
    render(stanza, makeEmptyData(htmlParams), stanzaParams);
    const offset = htmlParams.offset - limit;
    const data = await fetchData(stanzaParams.api_url, stanzaParams.keyword, offset, limit);
    const params: HTMLParams = processData(data, offset, stanzaParams);
    render(stanza, params, stanzaParams);
  });
  stanza.select("#btnNext")?.addEventListener("click", async() => {
    render(stanza, makeEmptyData(htmlParams), stanzaParams);
    const offset = htmlParams.offset + limit;
    const data = await fetchData(stanzaParams.api_url, stanzaParams.keyword, offset, limit);
    const params: HTMLParams = processData(data, offset, stanzaParams);
    render(stanza, params, stanzaParams);
  });
};

const processData = (response: APIResponse, offset: number, stanzaParams: StanzaParams): HTMLParams => {
  const columnLabels: string[] = response.columns.map(item => item.label);
  const keys: string[] = response.columns.map(item => item.key);
  const noWraps: {[key: string]: boolean} = {};
  response.columns.forEach(item => noWraps[item.key] = item.nowrap);
  const data: Item[][] = response.contents.map(item => {
    const result: Item[] = [];
    keys.forEach(key => {
      let value: StringItem;
      if (typeof item[key] === "string") {
        value = {label: item[key] as string};
      } else {
        value = item[key] as LinkItem;
      }
      if (noWraps[key]) {
        value.nowrap = true;
      }
      result.push(value);
    });
    return result;
  });
  const total: number = response.total;
  const _end: number = parseInt(stanzaParams.limit, 10) + offset;
  const end: number = _end <= total ? _end : total;
  const hasPrev: boolean = offset !== 0;
  const hasNext: boolean = end < total;
  const title: string = stanzaParams.title.replace(/#keyword#/, `"${stanzaParams.keyword}"`);
  const info: string = hasNext || hasPrev ? `showing ${offset + 1} to ${end} of total ${total} items` : `total ${total} items`;
  const _columns: string = stanzaParams.column_names;
  const showColumnNames: boolean = _columns.toLocaleLowerCase() === "false" ? false : Boolean(stanzaParams.column_names);

  return {
    title,
    offset,
    columnLabels,
    data,
    hasNext,
    hasPrev,
    info,
    showColumnNames
  };
};

const fetchData = async(url: string, query: string, offset: number, limit: number): Promise<APIResponse> => {
  // return fetchDummy(query, offset, limit);
  return fetchLive(url, query, offset, limit);
};

const fetchLive = async(url: string, query: string, offset: number, limit: number): Promise<APIResponse> => {
  const response = await fetch(url, makeOptions({keyword: query, offset, limit}));
  const result = await response.json();
  return result;
};

const fetchDummy = async(query: string, offset: number, limit: number): Promise<APIResponse> => {
  await timeout(1000);
  const total: number = 22;
  return {
    total: total,
    offset: offset,
    contents: makeContents(limit, offset, total),
    columns: [
      {
        key: "index",
        label: "INDEX",
      },
      {
        key: "gm_id",
        label: "GM ID",
        nowrap: true,
      },
      {
        key: "name",
        label: "NAME"
      },
    ]
  };
};


const makeContents = (count: number, offset: number, total: number): Content[] => {
  const result: Content[] = [];
  const actualCount = count + offset < total ? count : total - offset + 1;

  for (let i = 0; i < actualCount; i++) {
    result.push({
      index: (i + offset).toString(),
      gm_id: {
        href: "/media/SY43q",
        label: "SY43a"
      },
      name: "BL AGAR (GLUCOSE BLOOD LIVER AGAR)"
    });
  }
  return result;
};

const makeEmptyData = (params: HTMLParams): HTMLParams => {
  return {...params, data: []};
};


const timeout = (ms: number): Promise<void> => {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
};

const makeOptions = (params: any): RequestInit => {
  let formBody = [];

  for (let key in params) {
    if (params[key] !== undefined) {
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }

  return {
    method: "POST",
    mode: "cors",
    body: formBody.join("&"),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
};


type Item = StringItem | LinkItem;

interface StanzaParams {
  api_url: string;
  keyword: string;
  limit: string;
  title: string;
  column_names: string;
}

interface HTMLParams {
  columnLabels: string[];
  data: Item[][];
  offset: number;
  title: string;
  hasNext: boolean;
  hasPrev: boolean;
  info: string;
  showColumnNames: boolean;
}

interface APIResponse {
  total: number;
  offset: number;
  contents: Content[];
  columns: Column[];
}

interface Content {
  [key: string]: (LinkItem | string);
}

interface LinkItem {
  href: string;
  label: string;
  nowrap?: boolean;
}

interface StringItem {
  label: string;
  nowrap?: boolean;
}

interface Column {
  key: string;
  label: string;
  nowrap?: boolean;
}


