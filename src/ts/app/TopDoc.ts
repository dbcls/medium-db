import {MainDoc} from "./MainDoc";
import {qs} from "imagelogic-tools/src/dom/qs";
import {fromEvent} from "rxjs";
import {debounceTime, map, tap} from "rxjs/operators";


export class TopDoc extends MainDoc {
  constructor() {
    super();
  }

  protected onReady() {
    const input: HTMLInputElement = qs("#queryInput");
    const mediaByIDs: HTMLElement = qs("#mediaByIDs");
    const mediaByKeywords: HTMLElement = qs("#mediaByKeywords");
    const componentsByIDs: HTMLElement = qs("#componentsByIDs");
    const componentsByKeywords: HTMLElement = qs("#componentsByKeywords");
    const organismsByIDs: HTMLElement = qs("#organismsByIDs");
    const organismsByKeywords: HTMLElement = qs("#organismsByKeywords");


    fromEvent(input, "input").pipe(
      map(r => (r.currentTarget as HTMLInputElement).value),
      debounceTime(500),
      map(r => mapToQuery(r))
    ).subscribe((r: QueryKeys) => {
      mediaByIDs.setAttribute("gm_ids", r.gm_ids);
      componentsByIDs.setAttribute("gmo_ids", r.gmo_ids);
      organismsByIDs.setAttribute("tax_ids", r.tax_ids);
      mediaByKeywords.setAttribute("keywords", r.keywords);
      componentsByKeywords.setAttribute("keywords", r.keywords);
      organismsByKeywords.setAttribute("keywords", r.keywords);
    });
  }
}

function mapToQuery(original: string): QueryKeys {
  const arr: string[] = original
    .split(",")
    .map(str => str.trim())
    .filter(str => !!str);

  const gm_ids = arr.filter(str => matchWithGMID(str)).join(",");
  const gmo_ids = arr.filter(str => matchWithGMOID(str)).join(",");
  const tax_ids = arr.filter(str => matchWithTAXID(str)).join(",");
  const ids: string[] = `${gm_ids},${gmo_ids},${tax_ids}`.split(",");
  const keywords = arr.filter(str => ids.indexOf(str) === -1).join(",");

  return {
    gm_ids, gmo_ids, tax_ids, keywords
  };
}

export function matchWithGMID(str: string): boolean {
  switch (true) {
    case str.match(/^JCM_M(\d+)$/) !== null:
    case str.match(/^NBRC_M(\d+)$/) !== null:
    case str.match(/^HM(\w+)$/) !== null:
    case str.match(/^SY(\w+)$/) !== null:
      return true;
    default:
      return false;
  }
}

export function matchWithGMOID(str: string): boolean {
  return str.match(/^(\d){1,7}$/) !== null;
}

export function matchWithTAXID(str: string): boolean {
  return str.match(/^GMO_(\d){6}$/) !== null;
}

interface QueryKeys {
  gm_ids: string;
  gmo_ids: string;
  tax_ids: string;
  keywords: string;
}
