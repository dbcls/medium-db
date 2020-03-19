Stanza(function(stanza, params){

  const api_url = "http://ep.dbcls.jp/sparqlist/api/";
  const api_name = "gmdb_component_by_gmoid";
  const options = makeOptions(params);
  const data = {};
  let msg = "";
  let error = false;

  if(!params["gmo_id"]){
    error = true;
    msg = "gmo_id (e.g. GMO_001010) is required";
  }

  fetch(`${api_url}${api_name}`, options)
    .then(res => res.json())
    .then(json => success(json))
    .catch(e => fail(e))
    .finally(() => {
      stanza.render({
        template: "stanza.html",
        parameters: {
          result: data,
          msg: msg,
          error: error
        }
      });
    });

  function success(json){
    if(json.length === 0){
      const gmoID = params["gmo_id"];
      error = true;
      msg = `Not found. gmo_id: ${gmoID}`;
      return;
    }

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

    if(json.alt_labels_en){
      data.alt_labels_en = json.alt_labels_en.map(str => ({value: str}));
    }

    if(json.super_classes){
      data.super_classes = json.super_classes.map(obj => ({
        gmo_id: obj.gmo_id,
        uri: obj.uri,
        label_en: obj.label_en
      }));
    }

    if(json.sub_classes){
      data.sub_classes = json.sub_classes.map(obj => ({
        gmo_id: obj.gmo_id,
        uri: obj.uri,
        label_en: obj.label_en
      }));
    }

    if(json.links){
      data.links = json.links.map(str => ({
        label: getLinkLabel(str),
        url: str,
      })).filter(obj => !!obj.label);

      function getLinkLabel(link){
        switch(true){
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
      }
    }

    if(json.properties){
      data.properties = json.properties.map(obj => {
        obj.host = host;
        return obj;
      });

    }

    if(json.roles){
      data.roles = json.roles.map(obj => obj);
    }
  }

  function fail(e){
    error = true;
    msg = `Server Error: ${e}`;
  }

});

function getLinkLabel(link){
  switch(true){
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
}

function makeOptions(params){
  let formBody = [];

  for(let key in params){
    if(params[key]){
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }

  return {
    method: "POST",
    mode: "cors",
    body: formBody.join("&"),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
}
