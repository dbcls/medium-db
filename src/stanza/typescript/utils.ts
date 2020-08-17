import {api_url} from "./consts";

export const makeOptions = (params: any): RequestInit => {
  let formBody = [];

  for (let key in params) {
    if (params[key]) {
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }
  return {
    method: "POST",
    mode: "cors" as RequestMode,
    body: formBody.join("&"),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
};

export const getData = async<T>(path: string, params: any): Promise<T> => {
  const options = makeOptions(params);
  const res = await fetch(`${api_url}${path}`, options);
  return await res.json();
};


