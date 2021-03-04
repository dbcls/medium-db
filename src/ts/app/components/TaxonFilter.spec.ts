import { __TEST__ } from "./TaxonFilter";
const TAXON_RANK = __TEST__.TAXON_RANK;
const getNextTaxon = __TEST__.getNextTaxon;
const parseApiResult = __TEST__.parseApiResult;

describe("getNextTaxon", () => {
  it("should get next taxon", () => {
    const result = getNextTaxon(TAXON_RANK._0_KINGDOM);
    expect(result).toBe(TAXON_RANK._1_PHYLUM);
  });
  it("should return undefined when querying the last layer", () => {
    const result = getNextTaxon(TAXON_RANK._9_SPECIES);
    expect(result).toBe(undefined);
  });
  it("should return undefined when querying the none existing rank", () => {
    const result = getNextTaxon(TAXON_RANK._5_TRIBE);
    expect(result).toBe(undefined);
  });
});

describe("parseApiResult", () => {
  const API_RESULT = [
    { id: "http://identifiers.org/taxonomy/28890", name: "Euryarchaeota" },
    { id: "http://identifiers.org/taxonomy/28889", name: "Crenarchaeota" },
    { id: "http://identifiers.org/taxonomy/651137", name: "Thaumarchaeota" },
    { id: "http://identifiers.org/taxonomy/192989", name: "Nanoarchaeota" },
  ];

  const result = parseApiResult(API_RESULT);
  expect(result[0].name).toBe("Euryarchaeota");
  expect(result[1].value).toBe("28889");
});
