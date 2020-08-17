import {getData} from "../typescript/utils";

const api_name = "gmdb_component_by_gmoid";

interface StanzaHtmlParam {
  gmo_id: string;
}

interface StanzaRenderParams {
  result: any;
  msg: string;
  error: boolean;
}

interface APIResult {
  pref_label: string;
  id: string;
  label_ja: string;
  alt_labels_en: string[];
  super_classes: GmoClass[];
  sub_classes: GmoClass[];
  properties: GmoClass[];
  roles: GmoClass[];
  links: string[];
}

interface GmoClass {
  gmo_id: string;
  uri: string;
  label_en: string;
}

Stanza<StanzaHtmlParam>(async(stanza, params) => {
  const renderParams: StanzaRenderParams = {
    result: null,
    msg: null,
    error: false,
  };

  if (!params["gmo_id"]) {
    renderParams.error = true;
    renderParams.msg = "gmo_id (e.g. GMO_001010) is required";
  }

  try {
    const data = await getData<APIResult>(api_name, params);
    if (!data.pref_label) {
      const gmoID = params["gmo_id"];
      renderParams.error = true;
      renderParams.msg = `Not found. gmo_id: ${gmoID}`;
    } else {
      renderParams.result = parseData(data);
    }
  } catch (e) {
    renderParams.error = true;
    renderParams.msg = `Server Error: ${e}`;
  }

  stanza.render({
    template: "stanza.html",
    parameters: renderParams
  });
});


function parseData(json: APIResult): any {
  const data: any = {};
  data.alt_labels_en = [];
  data.alt_labels_ja = [];
  data.super_classes = [];
  data.sub_classes = [];
  data.links = [];
  data.properties = [];
  data.roles = [];
  const host = location.host;


  data.gmo_id = json.id;
  data.pref_label = json.pref_label;
  data.json_label_ja = json.label_ja;

  if (json.alt_labels_en) {
    data.alt_labels_en = json.alt_labels_en.map((str: string) => ({value: str}));
  }

  if (json.super_classes) {
    data.super_classes = json.super_classes.map((obj: any) => ({
      gmo_id: obj.gmo_id,
      uri: obj.uri,
      label_en: obj.label_en
    }));
  }

  if (json.sub_classes) {
    data.sub_classes = json.sub_classes.map((obj: GmoClass) => ({
      gmo_id: obj.gmo_id,
      uri: obj.uri,
      label_en: obj.label_en
    }));
  }

  if (json.links) {
    data.links = json.links.map((str: string) => ({
      label: getLinkLabel(str),
      url: str,
    })).filter((obj: any) => !!obj.label);
  }

  if (json.properties) {
    data.properties = json.properties.map((obj: any) => {
      obj.host = host;
      return obj;
    });

  }

  if (json.roles) {
    data.roles = json.roles.map((obj: any) => obj);
  }

  return data;
}


const getLinkLabel = (link: string) => {
  switch (true) {
    case /pccompound/.test(link):
      return "PubChem";
    case /wikipedia/.test(link):
      return "Wikipedia";
    case /ncicb/.test(link):
      return "NCI Thesaurus";
    case /CHEBI/.test(link):
      return "ChEBI";
    case /SNOMEDCT/.test(link):
      return "SNOMED-CT";
    default:
      return "";
  }
};
