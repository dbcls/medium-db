import pluralize = require("pluralize");

export const setUpTaxonFilter = () => {
  setUpTable();
  setKingdomSelect();
  setItemVisibility(TAXON_RANK._0_KINGDOM, false);
  setLinkVisibility(TAXON_RANK._0_KINGDOM, false);
};

const NULL_VALUE = "null";

enum TAXON_RANK {
  _0_KINGDOM = "Superkingdom",
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
  const list = getList();
  availableRanks.forEach((rank: string) => {
    const listItem = document.createElement("li");
    listItem.dataset.rank = rank;

    const label = document.createElement("span");
    label.innerText = rank;
    listItem.append(label);

    const select = document.createElement("select");
    select.dataset.rank = rank;
    select.addEventListener("change", (e) => {
      onChangeSelect(e.target as HTMLSelectElement);
    });
    const nullOption = document.createElement("option");
    nullOption.text = `--Select--`;
    nullOption.value = NULL_VALUE;
    select.append(nullOption);
    listItem.append(select);

    const link = document.createElement("a");
    link.text = rank === TAXON_RANK._9_SPECIES ? "Organism Info" : "Taxon Info";
    link.href = "#";
    link.dataset.rank = rank;
    listItem.append(link);

    list.append(listItem);
  });
};

const onChangeSelect = async (select: HTMLSelectElement) => {
  const rank = select.dataset.rank as TAXON_RANK;
  const value = select.value;
  const nextRank = getNextTaxon(rank);
  clearSubSelections(rank);
  setItemVisibility(rank, value !== NULL_VALUE);
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
  const link = getList().querySelector<HTMLAnchorElement>(
    `a[data-rank=${rank}]`
  );
  link.href =
    rank === TAXON_RANK._9_SPECIES ? `/organism/${value}` : `/taxon/${value}`;
};

const setItemVisibility = (rank: TAXON_RANK, isSelected: boolean) => {
  const rows = getList().querySelectorAll("li");
  const rankLevel = getRankLevel(rank);
  rows.forEach((item) => {
    const myRank: TAXON_RANK = item.dataset.rank as TAXON_RANK;
    const myRankLevel = getRankLevel(myRank);
    if (rankLevel + (isSelected ? 1 : 0) < myRankLevel) {
      item.style.display = "none";
    } else {
      item.style.display = "flex";
    }
  });
};

const setLinkVisibility = (rank: TAXON_RANK, isSelected: boolean) => {
  const links = getList().querySelectorAll("a");
  const rankLevel = getRankLevel(rank);
  links.forEach((item) => {
    const myRank: TAXON_RANK = item.dataset.rank as TAXON_RANK;
    const myRankLevel = getRankLevel(myRank);
    if (rankLevel + (isSelected ? 1 : 0) <= myRankLevel) {
      item.style.display = "none";
    } else {
      item.style.display = "inline-block";
    }
  });
};

const clearSubSelections = (rank: TAXON_RANK) => {
  const selects = getList().querySelectorAll("select");
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
  const select = getList().querySelector(`select[data-rank=${rank}]`);
  while (select.children.length > 1) {
    select.removeChild(select.children[select.children.length - 1]);
  }
};
const setSelectOptions = (rank: TAXON_RANK, data: SelectOption[]) => {
  const select = getList().querySelector(`select[data-rank=${rank}]`);
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
  const select = getList().querySelector(
    `select[data-rank=${TAXON_RANK._0_KINGDOM}]`
  );
  createOptions(kingdomOptions).forEach((elm) => select.append(elm));
};

const changeSelect = async (id: string, rank: TAXON_RANK) => {
  const data = await fetchTaxon(id, rank);
};

const getList = () => {
  return document.querySelector("#rankList");
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
  return data
    .map((item) => ({
      name: item.name,
      value: item.id.split("/").pop(),
    }))
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
};

type fetchResult = { id: string; name: string }[];

interface SelectOption {
  value: string;
  name: string;
}

export const __TEST__ = { TAXON_RANK, getNextTaxon, parseApiResult };
