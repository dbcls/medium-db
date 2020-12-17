Stanza<StanzaParams>(async function(stanza, stanzaParams) {
  const offset: number = 0;
  const data = await fetchData(stanzaParams.api_url, offset, parseInt(stanzaParams.limit, 10));
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
    await movePage(stanza, htmlParams, stanzaParams, limit, DIRECTION.PREV);
  });
  stanza.select("#btnNext")?.addEventListener("click", async() => {
    await movePage(stanza, htmlParams, stanzaParams, limit, DIRECTION.NEXT);
  });
};

const movePage = async(stanza: StanzaInstance, htmlParams: HTMLParams, stanzaParams: StanzaParams, limit: number, direction: DIRECTION) => {
  render(stanza, {...htmlParams, isLoading: true}, stanzaParams);
  const offset = htmlParams.offset + limit * direction;
  const data = await fetchData(stanzaParams.api_url, offset, limit);
  const params: HTMLParams = processData(data, offset, stanzaParams);
  render(stanza, params, stanzaParams);
};

const processData = (response: APIResponse, offset: number, stanzaParams: StanzaParams): HTMLParams => {
  switch (response.status) {
    case 200:
      return makeSuccessData(response, offset, stanzaParams);
    default:
      return makeFailParams(response, stanzaParams);
  }
};

const makeSuccessData = (response: APIResponse, offset: number, stanzaParams: StanzaParams): HTMLParams => {
  const columnLabels: string[] = response.body.columns.map(item => item.label);
  const keys: string[] = response.body.columns.map(item => item.key);
  const noWraps: {[key: string]: boolean} = {};
  response.body.columns.forEach(item => noWraps[item.key] = item.nowrap);
  const data: Item[][] = response.body.contents.map(item => {
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
  const total: number = response.body.total;
  const _end: number = parseInt(stanzaParams.limit, 10) + offset;
  const end: number = _end <= total ? _end : total;
  const hasPrev: boolean = offset !== 0;
  const hasNext: boolean = end < total;
  const title: string = stanzaParams.title;
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
    showColumnNames,
    status: 200,
    statusText: ""
  };
};

const makeFailParams = (response: APIResponse, stanzaParams: StanzaParams): HTMLParams => {
  return {
    title: stanzaParams.title,
    offset: 0,
    columnLabels: null,
    data: null,
    hasNext: false,
    hasPrev: false,
    info: null,
    showColumnNames: false,
    status: response.status,
    statusText: response.message,
  };

};

const fetchData = async(url: string, offset: number, limit: number): Promise<APIResponse> => {
  // return fetchDummy(query, offset, limit);
  return fetchLive(url, offset, limit);
};

const fetchLive = async(url: string, offset: number, limit: number): Promise<APIResponse> => {
  const [uri, query]: [string, string] = separateURL(url);
  const response = await fetch(uri, makeOptions({offset, limit}, query));
  if (response.status !== 200) {
    return {
      status: response.status,
      message: response.statusText,
      body: null
    };
  }
  const body: any = await response.json();
  return {
    status: 200,
    body
  };
};

const fetchDummy = async(query: string, offset: number, limit: number): Promise<APIResponse> => {
  await timeout(1000);
  const total: number = 22;
  return {
    status: 200,
    body: {
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
    }
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

const separateURL = (url: string): [string, string] => {
  const separated = /(.*)\?(.*)/.exec(url);
  let uri, query;
  if (separated) {
    uri = separated[1];
    query = separated[2];
  } else {
    uri = url;
    query = "";
  }
  return [uri, query];
};

const filterQuery = (query: string): string => {

  // console.log(query);
  let isOmitted: boolean = false;
  const result: string = query.split("&").filter(str => {
    const reg = /(.*)=(.*)/.exec(str);
    const [key, value]: [string, string] = [reg[1], reg[2]];
    switch (key) {
      case "limit":
      case "offset":
        isOmitted = true;
        return false;
      default:
        return true;
    }
  }).join("&");
  if (isOmitted) {
    console.warn("limit and offset on API_URL have been omitted as they are set from the Stanza");
  }
  // console.log(result);
  return result;
};


const makeOptions = (params: any, query: string): RequestInit => {
  let formBody = [];


  for (let key in params) {
    if (params[key] !== undefined) {
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }
  const body = `${filterQuery(query)}&${formBody.join("&")}`;

  return {
    method: "POST",
    mode: "cors",
    body,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
};

enum DIRECTION {
  NEXT = 1,
  PREV = -1
}


type Item = StringItem | LinkItem;

interface StanzaParams {
  api_url: string;
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
  isLoading?: boolean;
  status: number;
  statusText: string;
}

interface APIResponse {
  status: number;
  message?: string;
  body: {
    total: number;
    offset: number;
    contents: Content[];
    columns: Column[];
  };
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


