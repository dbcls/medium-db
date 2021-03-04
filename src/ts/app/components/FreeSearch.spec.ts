import { __TEST__ } from "./FreeSearch";
const matchWithGMID = __TEST__.matchWithGMID;
const matchWithGMOID = __TEST__.matchWithGMOID;
const matchWithTAXID = __TEST__.matchWithTAXID;

describe("top", () => {
  it("should match with gm_id", () => {
    // ^JCM_M(\d+)$
    expect(matchWithGMID("JCM_M101025")).toBe(true);
    expect(matchWithGMID("JCM_MX101025")).toBe(false);
    expect(matchWithGMID("JCM_M101025A")).toBe(false);
    //
    // ^NBRC_M(\d+)$
    expect(matchWithGMID("NBRC_M981455")).toBe(true);
    expect(matchWithGMID("NBRC_ME981455")).toBe(false);
    expect(matchWithGMID("NBRC_M981455X")).toBe(false);
    //
    // ^HM(\w+)$
    expect(matchWithGMID("HM981455")).toBe(true);
    expect(matchWithGMID("HM_981455")).toBe(true);
    expect(matchWithGMID("HM")).toBe(false);
    //
    // ^SY(\w+)$
    expect(matchWithGMID("SY981455")).toBe(true);
    expect(matchWithGMID("SY_981455")).toBe(false);
    expect(matchWithGMID("SY")).toBe(false);
  });
  it("should match with gmo_id", () => {
    expect(matchWithGMOID("102")).toBe(false);
    expect(matchWithGMOID("SY123456")).toBe(false);
    expect(matchWithGMOID("00112358")).toBe(false);
  });
  it("should match with tax_id", () => {
    expect(matchWithTAXID("GMO_001020")).toBe(false);
    expect(matchWithTAXID("GMO_0010209")).toBe(false);
    expect(matchWithTAXID("GMO_A001020")).toBe(false);
    expect(matchWithTAXID("GMOW_001020")).toBe(false);
  });
});
