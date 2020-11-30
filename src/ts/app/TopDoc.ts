import {MainDoc} from "./MainDoc";
import {qs} from "imagelogic-tools/src/dom/qs";
import {fromEvent, Observable, of, zip} from "rxjs";
import {concatMap, debounceTime, map, startWith, switchMap, tap} from "rxjs/operators";
import {fromFetch} from "rxjs/fetch";
import {fromPromise} from "rxjs/internal-compatibility";

export class TopDoc extends MainDoc {
  constructor() {
    super();
  }

  protected onLoadWin() {
    const info: HTMLElement = qs("#info");
    const stanzas: HTMLElement = qs("#stanzaWrapper");
    const input: HTMLInputElement = qs("#queryInput");

    const urlQuery = location.search.split("=").pop().replace(/\+/g, " ").trim();
    if (urlQuery) {
      input.value = urlQuery;
    }
    const originalValue = input.value;


    const input$: Observable<string> = fromEvent(input, "input").pipe(
      map(r => (r.currentTarget as HTMLInputElement).value),
      // startWith("SY46,HM_D00205,NBRC_M5,JCM_M25,Glucose, GMO_001010, 315405"),
      startWith(originalValue),
      debounceTime(300)
    );
    input$.subscribe(r => {
      !!r ? this.toggleDisplay(stanzas, info) : this.toggleDisplay(info, stanzas);
    });


    input$.pipe(
      map(r => mapToQuery(r)),
      tap(() => showSearching()),
      switchMap((r: QueryKeys) => {
        switch (true) {
          case !!r.gm_ids:
            return loadMediaByIDs$(r.gm_ids);
          case !!r.gmo_ids:
            return loadComponentsByIDs$(r.gmo_ids);
          case !!r.tax_ids:
            return loadOrganismsByIDs$(r.tax_ids);
          case !!r.keyword:
            return loadItemsByKeywords(r.keyword);
          default:
            return of(0);
        }
      }),
    ).subscribe((r) => {
      console.log(r);
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

const showSearching = () => {
  clearWrapper();
  const searching = document.createElement("div");
  searching.textContent = "Searching";
  searching.classList.add("message");
  searching.classList.add("blink");
  findWrapper().appendChild(searching);
};

const clearWrapper = () => {
  const wrapper = findWrapper();
  wrapper.innerHTML = "";
};

const loadMediaByIDs$ = (query: string): Observable<any> => {
  return fromFetch(`${API_MEDIA_BY_ID}${encodeURI(query)}&limit=10&offset=0`).pipe(
    concatMap(r => fromPromise(r.json())),
    tap(r => {
      clearWrapper();
      showMediaByID(query);
    }),
  );
};

const showMediaByID = (query: string) => {
  const stanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
  stanza.setAttribute("limit", "10");
  stanza.setAttribute("column_names", "true");
  stanza.setAttribute("api_url", `${API_MEDIA_BY_ID}${encodeURI(query)}`);
  stanza.setAttribute("title", `Media of ${query}`);
  findWrapper().append(stanza);
};

const loadComponentsByIDs$ = (query: string): Observable<any> => {
  return fromFetch(`${API_COMPONENTS_BY_ID}${encodeURI(query)}${API_LIST_PARAMS}`).pipe(
    concatMap(r => fromPromise(r.json())),
    tap(r => {
      clearWrapper();
      showComponentsByID(query);
    }),
  );
};

const showComponentsByID = (query: string) => {
  const stanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
  stanza.setAttribute("limit", "10");
  stanza.setAttribute("column_names", "true");
  stanza.setAttribute("api_url", `${API_COMPONENTS_BY_ID}${encodeURI(query)}`);
  stanza.setAttribute("title", `Components of ${query}`);
  findWrapper().append(stanza);
};

const loadOrganismsByIDs$ = (query: string): Observable<any> => {
  return fromFetch(`${API_ORGANISMS_BY_ID}${encodeURI(query)}${API_LIST_PARAMS}`).pipe(
    concatMap(r => fromPromise(r.json())),
    tap(r => {
      clearWrapper();
      showOrganismsByID(query);
    }),
  );
};

const showOrganismsByID = (query: string) => {
  const stanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
  stanza.setAttribute("limit", "10");
  stanza.setAttribute("column_names", "true");
  stanza.setAttribute("api_url", `${API_ORGANISMS_BY_ID}${encodeURI(query)}`);
  stanza.setAttribute("title", `Organisms of ${query}`);
  findWrapper().append(stanza);
};

const loadItemsByKeywords = (query: string): Observable<any> => {
  return zip(
    fromFetch(`${API_MEDIA_BY_KEYWORD}${encodeURI(query)}${API_LIST_PARAMS}`).pipe(concatMap(r => fromPromise(r.json()))),
    fromFetch(`${API_COMPONENTS_BY_KEYWORD}${encodeURI(query)}${API_LIST_PARAMS}`).pipe(concatMap(r => fromPromise(r.json()))),
    fromFetch(`${API_ORGANISMS_BY_KEYWORD}${encodeURI(query)}${API_LIST_PARAMS}`).pipe(concatMap(r => fromPromise(r.json())))
  ).pipe(
    tap(([media, components, organisms]: [ListResults, ListResults, ListResults]) => {
      const hasMedia = hasContents(media);
      const hasComponents = hasContents(components);
      const hasOrganisms = hasContents(organisms);
      //
      clearWrapper();
      setTimeout(() => {
        hasMedia ? showMediaByKeyword(query) : "";
      }, 200);
      setTimeout(() => {
        hasComponents ? showComponentsByKeyword(query) : "";
      }, 400);
      setTimeout(() => {
        hasOrganisms ? showOrganismsByKeyword(query) : "";
      }, 600);
      !hasMedia && !hasComponents && !hasOrganisms ? showNotFound() : "";
    })
  );
};

const showMediaByKeyword = (query: string) => {
  const stanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
  stanza.setAttribute("limit", "10");
  stanza.setAttribute("column_names", "true");
  stanza.setAttribute("api_url", `${API_MEDIA_BY_KEYWORD}${encodeURI(query)}`);
  stanza.setAttribute("title", `Media of ${query}`);
  findWrapper().append(stanza);
};

const showComponentsByKeyword = (query: string) => {
  const stanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
  stanza.setAttribute("limit", "10");
  stanza.setAttribute("column_names", "true");
  stanza.setAttribute("api_url", `${API_COMPONENTS_BY_KEYWORD}${encodeURI(query)}`);
  stanza.setAttribute("title", `Components of ${query}`);
  findWrapper().append(stanza);
};

const showOrganismsByKeyword = (query: string) => {
  const stanza: HTMLElement = document.createElement("togostanza-gmdb_meta_list");
  stanza.setAttribute("limit", "10");
  stanza.setAttribute("column_names", "true");
  stanza.setAttribute("api_url", `${API_ORGANISMS_BY_KEYWORD}${encodeURI(query)}`);
  stanza.setAttribute("title", `Organisms of ${query}`);
  findWrapper().append(stanza);
};

const showNotFound = () => {
  clearWrapper();
  const notFound = document.createElement("div");
  notFound.textContent = "Not Found";
  notFound.classList.add("message");
  findWrapper().appendChild(notFound);
};


const API_LIST_PARAMS = "&limit=10&offset=0";
const API_MEDIA_BY_ID = "http://growthmedium.org/sparqlist/api/gmdb_list_media_by_gmids?gm_ids=";
const API_MEDIA_BY_KEYWORD = "http://growthmedium.org/sparqlist/api/gmdb_list_media_by_keyword?keyword=";
const API_COMPONENTS_BY_ID = "http://growthmedium.org/sparqlist/api/gmdb_list_components_by_gmoids?gmo_ids=";
const API_COMPONENTS_BY_KEYWORD = "http://growthmedium.org/sparqlist/api/gmdb_list_components_by_keyword?keyword=";
const API_ORGANISMS_BY_ID = "http://growthmedium.org/sparqlist/api/gmdb_list_organisms_by_taxids?tax_ids=";
const API_ORGANISMS_BY_KEYWORD = "http://growthmedium.org/sparqlist/api/gmdb_list_organisms_by_keyword?keyword=";


const findWrapper = (): HTMLElement => {
  return qs("#stanzaWrapper");
};

const toNumber = (val: string | number): number => {
  if (typeof val === "string") {
    return parseInt(val, 10);
  } else {
    return val;
  }
};

const hasContents = (obj: ListResults): boolean => {
  return toNumber(obj.total) > 0;
};

interface QueryKeys {
  gm_ids: string;
  gmo_ids: string;
  tax_ids: string;
  keyword: string;
}

interface ListResults {
  columns: any[];
  contents: any[];
  limit: string | number;
  total: string | number;
  offset: string | number;
}
