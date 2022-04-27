import { URL_API_BASE } from "./Consts";

export function getPram(): string {
  return location.pathname.split("/").pop();
}

export async function getData<T = any>(
  apiName: string,
  body: string
): Promise<T> {
  const detailAPI = `${URL_API_BASE}${apiName}`;
  try {
    const res = await fetch(detailAPI, {
      method: "POST",
      mode: "cors",
      body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return await res.json();
  } catch (e) {
    return undefined;
  }
}
