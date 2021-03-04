import { async } from "rxjs";
import { createEvalAwarePartialHost } from "ts-node/dist/repl";

export const setUpTaxonFilter = () => {
  setUpTable();
  setKingdomSelect();
  setRowVisibility(TAXON_RANK._0_KINGDOM, false);
  setLinkVisibility(TAXON_RANK._0_KINGDOM, false);
};

const NULL_VALUE = "null";

enum TAXON_RANK {
  _0_KINGDOM = "Kingdom",
  _1_PHYLUM = "Phylum",
  _2_CLASS = "Class",
  _3_ORDER = "Order",
  _4_FAMILY = "Family",
  _5_TRIBE = "Tribe",
  _6_GENUS = "Genus",
  _7_SECTION = "Section",
  _8_SERIES = "Series",
  _9_SPECIES = "Species",
  _10_VARIETY = "Variety",
  _11_FORM = "Form",
}

const availableRanks: TAXON_RANK[] = [
  TAXON_RANK._0_KINGDOM,
  TAXON_RANK._1_PHYLUM,
  TAXON_RANK._2_CLASS,
  TAXON_RANK._3_ORDER,
  TAXON_RANK._4_FAMILY,
  TAXON_RANK._6_GENUS,
  TAXON_RANK._9_SPECIES,
];

const setUpTable = () => {
  const table = getTable();
  availableRanks.forEach((rank: string, i: number) => {
    const next = availableRanks[i + 1];
    const tr = document.createElement("tr");
    tr.dataset.rank = rank;
    const th = document.createElement("th");
    th.innerText = rank;
    tr.append(th);
    const td1 = document.createElement("td");
    tr.append(td1);
    const select = document.createElement("select");
    select.dataset.rank = rank;
    select.addEventListener("change", (e) => {
      onChangeSelect(e.target as HTMLSelectElement);
    });
    const nullOption = document.createElement("option");
    nullOption.text = "select";
    nullOption.value = NULL_VALUE;
    select.append(nullOption);
    td1.append(select);

    const td2 = document.createElement("td");
    tr.append(td2);
    const link = document.createElement("a");
    link.text = "Show Detail";
    link.href = "#";
    link.dataset.rank = rank;
    td2.append(link);

    table.append(tr);
  });
};

const onChangeSelect = async (select: HTMLSelectElement) => {
  const rank = select.dataset.rank as TAXON_RANK;
  const value = select.value;
  const nextRank = getNextTaxon(rank);
  clearSubSelections(rank);
  setRowVisibility(rank, value !== NULL_VALUE);
  setLinkVisibility(rank, value !== NULL_VALUE);
  setLink(rank, value);

  if (nextRank) {
    clearSelection(nextRank);
    const nextTaxon = await fetchTaxon(value, nextRank);
    setSelectOptions(nextRank, nextTaxon);
  }
};

const setLink = (rank: TAXON_RANK, value: string) => {
  if (value === NULL_VALUE) {
    return;
  }
  const link = getTable().querySelector<HTMLAnchorElement>(
    `a[data-rank=${rank}]`
  );
  link.href =
    rank === TAXON_RANK._9_SPECIES ? `/organism/${value}` : `/taxon/${value}`;
};

const setRowVisibility = (rank: TAXON_RANK, isSelected: boolean) => {
  const rows = getTable().querySelectorAll("tr");
  const rankLevel = getRankLevel(rank);
  rows.forEach((item) => {
    const myRank: TAXON_RANK = item.dataset.rank as TAXON_RANK;
    const myRankLevel = getRankLevel(myRank);
    if (rankLevel + (isSelected ? 1 : 0) < myRankLevel) {
      item.style.display = "none";
    } else {
      item.style.display = "table-row";
    }
  });
};

const setLinkVisibility = (rank: TAXON_RANK, isSelected: boolean) => {
  const links = getTable().querySelectorAll("a");
  const rankLevel = getRankLevel(rank);
  links.forEach((item) => {
    const myRank: TAXON_RANK = item.dataset.rank as TAXON_RANK;
    const myRankLevel = getRankLevel(myRank);
    if (rankLevel + (isSelected ? 1 : 0) <= myRankLevel) {
      item.style.display = "none";
    } else {
      item.style.display = "block";
    }
  });
};

const clearSubSelections = (rank: TAXON_RANK) => {
  const selects = getTable().querySelectorAll("select");
  const rankLevel = getRankLevel(rank);
  selects.forEach((item) => {
    const myRank: TAXON_RANK = item.dataset.rank as TAXON_RANK;
    const myRankLevel = getRankLevel(myRank);
    if (rankLevel < myRankLevel) {
      item.selectedIndex = 0;
    }
  });
};

const clearSelection = (rank: TAXON_RANK) => {
  const select = getTable().querySelector(`select[data-rank=${rank}]`);
  while (select.children.length > 1) {
    select.removeChild(select.children[select.children.length - 1]);
  }
};
const setSelectOptions = (rank: TAXON_RANK, data: SelectOption[]) => {
  const select = getTable().querySelector(`select[data-rank=${rank}]`);
  createOptions(data).forEach((elm) => select.append(elm));
};

const getRankLevel = (rank: TAXON_RANK): number => {
  return availableRanks.indexOf(rank);
};

const getNextTaxon = (rank: TAXON_RANK): TAXON_RANK => {
  const rankLevel = getRankLevel(rank);
  if (rankLevel === -1) {
    return undefined;
  }
  return availableRanks[rankLevel + 1];
};

const setKingdomSelect = () => {
  const select = getTable().querySelector(
    `select[data-rank=${TAXON_RANK._0_KINGDOM}]`
  );
  createOptions(kingdomOptions).forEach((elm) => select.append(elm));
};

const changeSelect = async (id: string, rank: TAXON_RANK) => {
  const data = await fetchTaxon(id, rank);
};

const getTable = () => {
  return document.querySelector("#rankTable");
};

const setPhylumSelect = () => {};

const kingdomOptions: SelectOption[] = [
  {
    value: "2157",
    name: "Archaea",
  },
  { value: "2", name: "Bacteria" },
  {
    value: "2759",
    name: "Eukaryota",
  },
];

const fetchTaxon = async (
  id: string,
  rank: TAXON_RANK
): Promise<SelectOption[]> => {
  const response = await fetch(API, {
    method: "POST",
    mode: "cors",
    body: `tax_id=${id}&rank=${rank}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data: fetchResult = await response.json();
  return parseApiResult(data);
};
const API = "http://growthmedium.org/sparqlist/api/list_taxons_by_rank";
const createOptions = (data: SelectOption[]): HTMLOptionElement[] => {
  return data.map((item) => {
    const elm = document.createElement("option");
    elm.value = item.value;
    elm.text = item.name;
    return elm;
  });
};

const parseApiResult = (data: fetchResult): SelectOption[] => {
  return data.map((item) => ({
    name: item.name,
    value: item.id.split("/").pop(),
  }));
};

type fetchResult = { id: string; name: string }[];

interface SelectOption {
  value: string;
  name: string;
}

export const __TEST__ = { TAXON_RANK, getNextTaxon, parseApiResult };
