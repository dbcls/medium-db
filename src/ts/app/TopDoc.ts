import {MainDoc} from "./MainDoc";
import {qs} from "imagelogic-tools/src/dom/qs";
import {fromEvent, Observable} from "rxjs";
import {debounceTime, first, map, startWith, tap} from "rxjs/operators";

export class TopDoc extends MainDoc {
  constructor() {
    super();
  }

  protected onLoadWin() {
    const info: HTMLElement = qs("#info");
    const stanzas: HTMLElement = qs("#stanzaWrapper");
    const input: HTMLInputElement = qs("#queryInput");
    const mediaByIDs: HTMLElement = qs("#mediaByIDs");
    const mediaByKeyword: HTMLElement = qs("#mediaByKeyword");
    const componentsByIDs: HTMLElement = qs("#componentsByIDs");
    const componentsByKeyword: HTMLElement = qs("#componentsByKeyword");
    const organismsByIDs: HTMLElement = qs("#organismsByIDs");
    const organismsByKeyword: HTMLElement = qs("#organismsByKeyword");

    const input$: Observable<string> = fromEvent(input, "input").pipe(
      map(r => (r.currentTarget as HTMLInputElement).value),
      // startWith("SY46,HM_D00205,NBRC_M5,JCM_M25,Glucose, GMO_001010, 315405"),
      startWith(input.value),
      debounceTime(300)
    );
    input$.subscribe(r => {
      !!r ? this.toggleDisplay(stanzas, info) : this.toggleDisplay(info, stanzas);
    });


    input$.pipe(
      map(r => mapToQuery(r))
    ).subscribe((r: QueryKeys) => {
      mediaByIDs.setAttribute("gm_ids", r.gm_ids);
      componentsByIDs.setAttribute("gmo_ids", r.gmo_ids);
      organismsByIDs.setAttribute("tax_ids", r.tax_ids);
      mediaByKeyword.setAttribute("keyword", r.keyword);
      componentsByKeyword.setAttribute("keyword", r.keyword);
      organismsByKeyword.setAttribute("keyword", r.keyword);
    });
  }

  private toggleDisplay(toShow: HTMLElement, toHide: HTMLElement) {
    toShow.style.display = "block";
    anime({
      targets: toShow,
      opacity: [0, 1],
      duration: 300,
      delay: 120,
      easing: "easeOutQuart"
    });
    anime({
      targets: toHide,
      opacity: [1, 0],
      duration: 100,
      easing: "easeOutQuart",
      complete: () => toHide.style.display = "none"
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
  const keywords = arr.filter(str => ids.indexOf(str) === -1);
  const keyword: string = keywords.length ? keywords[0] : "";

  return {
    gm_ids, gmo_ids, tax_ids, keyword
  };
}

export function matchWithGMID(str: string): boolean {
  switch (true) {
    case str.match(/^JCM_M(\d+)$/) !== null:
    case str.match(/^NBRC_M(\d+)$/) !== null:
    case str.match(/^HM(\w+)$/) !== null:
    case str.match(/^SY\d(\w*)$/) !== null:
      return true;
    default:
      return false;
  }
}

export function matchWithGMOID(str: string): boolean {
  return str.match(/^GMO_(\d){6}$/) !== null;
}

export function matchWithTAXID(str: string): boolean {
  return str.match(/^(\d){1,7}$/) !== null;
}

interface QueryKeys {
  gm_ids: string;
  gmo_ids: string;
  tax_ids: string;
  keyword: string;
}
